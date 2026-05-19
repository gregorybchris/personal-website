import logging
from functools import lru_cache
from typing import Any, Optional

import httpx
import yaml
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from chris.app import logging_utilities

logger = logging.getLogger(__name__)

router = APIRouter()

SONGS_YAML_URL = "https://raw.githubusercontent.com/gregorybchris/cadenza/main/songs.yaml"


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


def modulate_chords(chords: str, offset: int) -> str:
    """Modulate a chord chart up or down by ``offset`` semitones.

    NOTE: This is currently a stub. Modulation will be delegated to the
    cadenza package once it is available; for now the chords are returned
    unchanged for every offset value.
    """
    del offset  # Unused until the modulation package is integrated.
    return chords


@router.get(path="/chords/songs")
@logging_utilities.log_context("get_chords_songs", tag="api")
def get_chords_songs(search: str = "", offset: int = 0) -> JSONResponse:
    """Return every song that matches the given filters.

    Args:
        search: Case-insensitive substring matched against title and artist.
        offset: Number of semitones to modulate the chords by.
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

        results.append(
            {
                "id": song.id,
                "title": song.title,
                "artist": song.artist,
                "chords": modulate_chords(song.chords, offset),
                "tempo": song.tempo,
                "beat_duration": song.beat_duration,
                "chord_duration": song.chord_duration,
                "key": song.key.model_dump() if song.key else None,
            }
        )

    results.sort(key=lambda song: song["title"].lower())
    return JSONResponse({"songs": results})
