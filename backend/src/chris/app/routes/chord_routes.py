import logging
import re
from functools import lru_cache
from typing import Any, Optional

import httpx
import yaml
from cadenza.core.chord import Chord
from cadenza.core.diatonic_mode import DiatonicMode
from cadenza.core.diatonic_scale import DiatonicScale
from cadenza.core.errors import ParseError
from cadenza.core.note import Note
from cadenza.core.song import Song as CadenzaSong
from cadenza.core.transposer import Transposer
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from chris.app import logging_utilities

logger = logging.getLogger(__name__)

router = APIRouter()

SONGS_YAML_URL = "https://raw.githubusercontent.com/gregorybchris/cadenza/main/songs.yaml"

# Matches a trailing repeat marker, e.g. the "(x2)" in "C G Am F (x2)".
_REPEAT_PATTERN = re.compile(r"^(.*)\s+\(x(\d+)\)$")


class Key(BaseModel):
    root: str
    mode: str


class Song(BaseModel):
    id: str
    title: str
    artist: str
    chords: str
    tempo: Optional[int] = None
    beat_duration: Optional[str] = None
    chord_duration: Optional[str] = None
    key: Optional[Key] = None


@lru_cache(maxsize=1)
def fetch_songs() -> list[Song]:
    """Fetch and parse the cadenza songs YAML file.

    Cached in memory after the first request. Restart the server to pick up
    upstream changes to the YAML file.
    """
    response = httpx.get(SONGS_YAML_URL, timeout=10.0)
    response.raise_for_status()
    data = yaml.safe_load(response.text)
    return [Song(**song) for song in data.get("songs", [])]


def _transpose_token(token: str, offset: int, scale: Optional[DiatonicScale], symbols: bool) -> str:
    """Transpose a single whitespace-delimited token if it parses as a chord.

    Non-chord tokens (such as "(x2)" repeat markers) are returned unchanged.
    """
    try:
        chord = Chord.from_str(token)
    except ParseError:
        return token

    try:
        if scale is None:
            transposed = Transposer.transpose_chord_unsafe(chord, offset)
        else:
            transposed = Transposer.transpose_chord(chord, offset, scale=scale)
        return transposed.to_str(symbols=symbols)
    except Exception:  # noqa: BLE001 - never let one odd chord break the chart
        logger.warning(f"Could not transpose chord token: {token}")
        return token


def _transpose_lines(chords: str, offset: int, scale: Optional[DiatonicScale], symbols: bool) -> str:
    """Transpose a chord chart line by line, token by token.

    Used for songs without a declared key (and as a fallback). The original
    layout is preserved: blank lines, comment lines (starting with "~"), and
    repeat markers like "(x2)" are passed through untouched.
    """
    lines = []
    for line in chords.splitlines():
        if not line.strip() or line.startswith("~"):
            lines.append(line)
            continue
        lines.append(
            " ".join(_transpose_token(token, offset, scale, symbols) for token in line.split())
        )

    modulated = "\n".join(lines)
    if chords.endswith("\n"):
        modulated += "\n"
    return modulated


def _render_chord_chart(original: str, transposed_lines: list[list[Chord]], symbols: bool) -> str:
    """Render cadenza's transposed chord lines back over the original layout.

    cadenza parses a chart into a flat list of chord lines, dropping comment
    lines (starting with "~") and expanding "(xN)" markers into N lines. This
    walks the original text and replays the transposed chords onto it so the
    comments, blank lines, and repeat markers are preserved.
    """
    rendered = []
    index = 0
    for line in original.splitlines():
        if line.startswith("~"):
            rendered.append(line)
            continue

        repeat_match = _REPEAT_PATTERN.match(line)
        repeat_count = int(repeat_match.group(2)) if repeat_match else 1
        chord_line = transposed_lines[index]
        index += repeat_count

        text = " ".join(chord.to_str(symbols=symbols) for chord in chord_line)
        rendered.append(f"{text} (x{repeat_match.group(2)})" if repeat_match else text)

    modulated = "\n".join(rendered)
    if original.endswith("\n"):
        modulated += "\n"
    return modulated


def _modulate_keyed_song(
    song: Song, offset: int, key: Key, symbols: bool
) -> tuple[str, dict[str, str]]:
    """Modulate a keyed song with cadenza's high-level Transposer.transpose_song.

    Returns the modulated chord chart and the modulated key. Transposing the
    whole song keeps the chords and key spelled consistently in the new key.
    """
    root = Note.from_str(key.root)
    mode = DiatonicMode.from_str(key.mode)
    # transpose_song spells enharmonics against the destination key's scale.
    scale = DiatonicScale(root=Transposer.transpose_note_unsafe(root, offset), mode=mode)

    cadenza_song = CadenzaSong.model_validate(
        {
            "id": song.id,
            "title": song.title,
            "artist": song.artist,
            "chords": song.chords,
            "key": {"root": key.root, "mode": key.mode},
        }
    )
    transposed = Transposer.transpose_song(cadenza_song, offset, scale=scale)

    chords = _render_chord_chart(song.chords, transposed.chords, symbols)
    new_key = {
        "root": transposed.key.root.to_str(symbols=symbols),
        "mode": transposed.key.mode.to_str(),
    }
    return chords, new_key


def _symbolized_key(key: Key, symbols: bool) -> dict[str, str]:
    """Render a key's root with proper sharp/flat symbols, leaving the mode as-is."""
    try:
        root = Note.from_str(key.root).to_str(symbols=symbols)
    except ParseError:
        root = key.root
    return {"root": root, "mode": key.mode}


def modulate_song(
    song: Song, offset: int, symbols: bool
) -> tuple[str, Optional[dict[str, str]]]:
    """Modulate a song's chords (and key) up or down by ``offset`` semitones.

    Keyed songs are transposed with cadenza's Transposer.transpose_song so the
    chords and key stay consistent. Keyless songs fall back to transposing each
    chord on its own, without scale context for enharmonic spelling. An offset
    of zero still renders through cadenza so chords and keys pick up proper
    sharp/flat symbols when ``symbols`` is enabled.
    """
    if song.key is not None:
        try:
            return _modulate_keyed_song(song, offset, song.key, symbols)
        except Exception:  # noqa: BLE001 - degrade to the keyless path on any failure
            logger.warning(f"transpose_song failed for '{song.title}', using fallback")

    chords = _transpose_lines(song.chords, offset, scale=None, symbols=symbols)
    return chords, _symbolized_key(song.key, symbols) if song.key else None


@router.get(path="/chords/songs")
@logging_utilities.log_context("get_chords_songs", tag="api")
def get_chords_songs(search: str = "", offset: int = 0, symbols: bool = True) -> JSONResponse:
    """Return every song that matches the given filters.

    Args:
        search: Case-insensitive substring matched against title and artist.
        offset: Number of semitones to modulate the chords by.
        symbols: Whether to render chords with sharp/flat symbols (♯/♭).
    """
    songs = fetch_songs()

    search_normalized = search.strip().lower()

    results: list[dict[str, Any]] = []
    for song in songs:
        if search_normalized:
            matches_title = search_normalized in song.title.lower()
            matches_artist = search_normalized in song.artist.lower()
            if not (matches_title or matches_artist):
                continue

        chords, key = modulate_song(song, offset, symbols)
        results.append(
            {
                "id": song.id,
                "title": song.title,
                "artist": song.artist,
                "chords": chords,
                "tempo": song.tempo,
                "beat_duration": song.beat_duration,
                "chord_duration": song.chord_duration,
                "key": key,
            }
        )

    results.sort(key=lambda song: song["title"].lower())
    return JSONResponse({"songs": results})
