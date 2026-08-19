import logging
import re
import time
from functools import lru_cache
from typing import Any, Optional

import httpx
import yaml
from cadenza.core.chord import Chord
from cadenza.core.diatonic_key import DiatonicKey
from cadenza.core.errors import ParseError
from cadenza.core.functional_analysis import FunctionalAnalysis
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


_CACHE_TTL_SECONDS = 300


def fetch_songs() -> list[Song]:
    """Fetch and parse the cadenza songs YAML file.

    Cached in memory, refreshed at most once every 5 minutes to pick up
    upstream changes to the YAML file.
    """
    return _fetch_songs(time.monotonic() // _CACHE_TTL_SECONDS)


@lru_cache(maxsize=1)
def _fetch_songs(_ttl_bucket: float) -> list[Song]:
    response = httpx.get(SONGS_YAML_URL, timeout=10.0)
    response.raise_for_status()
    data = yaml.safe_load(response.text)
    return [Song(**song) for song in data.get("songs", [])]


def _render_chord_line(chord_line: list[Chord], symbols: bool, root: Optional[Note]) -> tuple[Optional[str], str]:
    """Render one line of chords, along with the functional analysis line that sits above it.

    Given a ``root`` to analyze against, each chord and its function share a
    column so that the two lines line up in the chart's monospace font.
    """
    chords = [chord.to_str(symbols=symbols) for chord in chord_line]
    if root is None:
        return None, " ".join(chords)

    functions = [FunctionalAnalysis.get_chord_function_str(chord, root) for chord in chord_line]
    widths = [max(len(chord), len(function)) for chord, function in zip(chords, functions, strict=True)]

    def columns(texts: list[str]) -> str:
        return " ".join(text.ljust(width) for text, width in zip(texts, widths, strict=True)).rstrip()

    return columns(functions), columns(chords)


def _render_chord_chart(
    original: str,
    chord_lines: list[list[Chord]],
    symbols: bool,
    root: Optional[Note] = None,
) -> str:
    """Render cadenza's parsed chord lines back over the original layout.

    cadenza parses a chart into a flat list of chord lines, dropping comment
    lines (starting with "~") and expanding "(xN)" markers into N lines. This
    walks the original text and replays the chords onto it so the comments,
    blank lines, and repeat markers are preserved.

    When ``root`` is given, each chord line is preceded by its functional
    analysis, the way cadenza's own chart printer shows it.
    """
    rendered = []
    index = 0
    for line in original.splitlines():
        if line.startswith("~"):
            rendered.append(line)
            continue

        repeat_match = _REPEAT_PATTERN.match(line)
        repeat_count = int(repeat_match.group(2)) if repeat_match else 1
        chord_line = chord_lines[index]
        index += repeat_count

        # A blank line parses to no chords, so there is nothing to analyze there.
        functions, text = _render_chord_line(chord_line, symbols, root if chord_line else None)
        if functions is not None:
            rendered.append(functions)
        rendered.append(f"{text} (x{repeat_match.group(2)})" if repeat_match else text)

    modulated = "\n".join(rendered)
    if original.endswith("\n"):
        modulated += "\n"
    return modulated


def _parse_song(song: Song) -> CadenzaSong:
    """Parse a songbook entry into a cadenza song."""
    payload: dict[str, Any] = {
        "id": song.id,
        "title": song.title,
        "artist": song.artist,
        "chords": song.chords,
    }
    if song.key is not None:
        payload["key"] = {"root": song.key.root, "mode": song.key.mode}
    return CadenzaSong.model_validate(payload)


def _render_key(key: DiatonicKey, symbols: bool) -> dict[str, str]:
    """Render a cadenza key as the root/mode pair the API returns."""
    return {"root": key.root.to_str(symbols=symbols), "mode": key.mode.to_str()}


def _symbolized_key(key: Key, symbols: bool) -> dict[str, str]:
    """Render a key's root with proper sharp/flat symbols, leaving the mode as-is."""
    try:
        root = Note.from_str(key.root).to_str(symbols=symbols)
    except ParseError:
        root = key.root
    return {"root": root, "mode": key.mode}


def modulate_song(
    song: Song,
    offset: int,
    symbols: bool,
    functions: bool = False,
) -> tuple[str, Optional[dict[str, str]]]:
    """Modulate a song's chords and key up or down by ``offset`` semitones.

    Only a keyed song can be modulated. A chord is spelled by the function it
    serves in a key, so a song with no key gives cadenza nothing to spell the
    result against and it would have to guess. Those songs always render as
    written, and the frontend disables its modulate controls to match.

    A key is what makes a chord a tonic or a dominant, so ``functions`` is
    likewise ignored for a keyless song.

    Every song still renders through cadenza so its chords and key pick up
    proper sharp/flat symbols when ``symbols`` is enabled.
    """
    try:
        cadenza_song = _parse_song(song)
        if song.key is not None:
            cadenza_song = Transposer.transpose_song(cadenza_song, offset)
        root = cadenza_song.key.root if functions and cadenza_song.key is not None else None
        chords = _render_chord_chart(song.chords, cadenza_song.chords, symbols, root)
    except Exception:  # noqa: BLE001 - one bad chart must not take down the songbook
        logger.warning(f"Could not render chords for '{song.title}', returning them as written")
        return song.chords, _symbolized_key(song.key, symbols) if song.key else None

    key = _render_key(cadenza_song.key, symbols) if cadenza_song.key is not None else None
    return chords, key


@router.get(path="/chords/songs")
@logging_utilities.log_context("get_chords_songs", tag="api")
def get_chords_songs(
    search: str = "",
    offset: int = 0,
    symbols: bool = False,
    functions: bool = False,
) -> JSONResponse:
    """Return every song that matches the given filters.

    Args:
        search: Case-insensitive substring matched against title and artist.
        offset: Number of semitones to modulate the chords by. Ignored for songs with no key.
        symbols: Whether to render chords with sharp/flat symbols (♯/♭).
        functions: Whether to label each chord line with its functional analysis. Ignored for songs with no key.
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

        chords, key = modulate_song(song, offset, symbols, functions)
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
