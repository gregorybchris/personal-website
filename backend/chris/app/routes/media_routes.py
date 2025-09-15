import logging
import random
from typing import Any, Optional

from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from chris.app import logging_utilities
from chris.app.imdb_utilities import MOVIE_POSTER_CACHE, TV_POSTER_CACHE, get_media_poster
from chris.datasets.datasets import Datasets
from chris.datasets.fetch import fetch_dataset_json

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get(path="/media")
@logging_utilities.log_context("get_media", tag="api")
def get_media() -> JSONResponse:
    books = fetch_dataset_json(Datasets.BOOKS)
    movies = fetch_dataset_json(Datasets.MOVIES)
    podcasts = fetch_dataset_json(Datasets.PODCASTS)
    tv_shows = fetch_dataset_json(Datasets.TV_SHOWS)
    youtube_channels = fetch_dataset_json(Datasets.YOUTUBE_CHANNELS)
    youtube_videos = fetch_dataset_json(Datasets.YOUTUBE_VIDEOS)

    return JSONResponse(
        {
            "books": books,
            "movies": movies,
            "podcasts": podcasts,
            "tv": tv_shows,
            "youtube-channels": youtube_channels,
            "youtube-videos": youtube_videos,
        }
    )


@router.get(path="/media/movies")
@logging_utilities.log_context("get_media_movies", tag="api")
def get_media_movies() -> JSONResponse:
    dataset_json = fetch_dataset_json(Datasets.MOVIES)
    for record in dataset_json:
        link = record["link"]
        imdb_id = link.split("/")[-1]
        record["poster_url"] = None

        if imdb_id in MOVIE_POSTER_CACHE:
            record["poster_url"] = MOVIE_POSTER_CACHE[imdb_id]
            continue

        try:
            record["poster_url"] = get_media_poster(imdb_id, media_type="movie")
        except ValueError as e:
            logger.error(f"Error getting poster for movie with IMDB ID {imdb_id}: {e}")

    return JSONResponse(dataset_json)


@router.get(path="/media/podcasts")
@logging_utilities.log_context("get_media_podcasts", tag="api")
def get_media_podcasts() -> JSONResponse:
    return JSONResponse(fetch_dataset_json(Datasets.PODCASTS))


@router.get(path="/media/tv")
@logging_utilities.log_context("get_media_tv", tag="api")
def get_media_tv() -> JSONResponse:
    dataset_json = fetch_dataset_json(Datasets.TV_SHOWS)
    for record in dataset_json:
        link = record["link"]
        imdb_id = link.split("/")[-1]
        record["poster_url"] = None

        if imdb_id in TV_POSTER_CACHE:
            record["poster_url"] = TV_POSTER_CACHE[imdb_id]
            continue

        try:
            record["poster_url"] = get_media_poster(imdb_id, media_type="tv")
        except ValueError as e:
            logger.error(f"Error getting poster for TV show with IMDB ID {imdb_id}: {e}")

    return JSONResponse(dataset_json)


@router.get(path="/media/youtube_channels")
@logging_utilities.log_context("get_media_youtube_channels", tag="api")
def get_media_youtube_channels() -> JSONResponse:
    return JSONResponse(fetch_dataset_json(Datasets.YOUTUBE_CHANNELS))


@router.get(path="/media/books")
@logging_utilities.log_context("get_media_books", tag="api")
def get_media_books() -> JSONResponse:
    return JSONResponse(fetch_dataset_json(Datasets.BOOKS))


class PostMediaRequest(BaseModel):
    query: str
    id: Optional[str]


@router.post(path="/media/tiktoks")
@logging_utilities.log_context("post_media_tiktoks", tag="api")
def post_media_tiktoks(request: PostMediaRequest) -> JSONResponse:
    tiktoks = fetch_dataset_json(Datasets.TIKTOKS)
    return media_search(id=request.id, query=request.query, items=tiktoks)


@router.post(path="/media/memes")
@logging_utilities.log_context("post_media_memes", tag="api")
def post_media_memes(request: PostMediaRequest) -> JSONResponse:
    memes = fetch_dataset_json(Datasets.MEMES)
    return media_search(id=request.id, query=request.query, items=memes)


@router.post(path="/media/instagrams")
@logging_utilities.log_context("post_media_instagrams", tag="api")
def post_media_instagrams(request: PostMediaRequest) -> JSONResponse:
    instagrams = fetch_dataset_json(Datasets.INSTAGRAMS)
    return media_search(id=request.id, query=request.query, items=instagrams)


@router.post(path="/media/youtube_videos")
@logging_utilities.log_context("post_media_youtube_videos", tag="api")
def post_media_youtube_videos(request: PostMediaRequest) -> JSONResponse:
    youtube_videos = fetch_dataset_json(Datasets.YOUTUBE_VIDEOS)
    return media_search(id=request.id, query=request.query, items=youtube_videos)


def media_search(
    id: Optional[str],  # noqa: A002
    query: str,
    items: Any,
    max_results: int = 25,
) -> JSONResponse:
    if id is not None:
        results = [item for item in items if item["id"] == id]
        return JSONResponse({"query": query, "results": results})

    if query == "":
        results = [item for item in items if item["favorite"]]
        return JSONResponse({"query": query, "results": results})

    if query == "!":
        random_items = random.sample(items, min(len(items), max_results))
        return JSONResponse({"query": query, "results": random_items})

    query_tokens = [token.lower() for token in query.lower().split(" ")]

    scores = []
    for item in items:
        tags = [tag.lower() for tag in item["tags"]]
        score = 0
        for token in query_tokens:
            if token in tags:
                score += 1

        if item.get("creator") is not None and item["creator"].lower() == query.lower():
            score += 10
        scores.append((item, score))
    sorted_scores = sorted(scores, key=lambda x: x[1], reverse=True)
    results = [item for item, score in sorted_scores if score > 0]

    if len(results) > max_results:
        results = results[:max_results]

    return JSONResponse({"query": query, "results": results})
