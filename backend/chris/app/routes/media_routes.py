import logging
from typing import Optional

from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from chris.app import logging_utilities
from chris.datasets.datasets import Datasets
from chris.datasets.fetch import fetch_dataset

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get(path="/media")
@logging_utilities.log_context("get_media", tag="api")
def get_media() -> JSONResponse:
    books = fetch_dataset(Datasets.BOOKS)
    movies = fetch_dataset(Datasets.MOVIES)
    podcasts = fetch_dataset(Datasets.PODCASTS)
    tv_shows = fetch_dataset(Datasets.TV_SHOWS)
    youtube_channels = fetch_dataset(Datasets.YOUTUBE_CHANNELS)

    return JSONResponse(
        {
            "books": books,
            "movies": movies,
            "podcasts": podcasts,
            "tv": tv_shows,
            "youtube": youtube_channels,
        }
    )


@router.get(path="/media/movies")
@logging_utilities.log_context("get_media_movies", tag="api")
def get_media_movies() -> JSONResponse:
    return JSONResponse(fetch_dataset(Datasets.MOVIES))


@router.get(path="/media/podcasts")
@logging_utilities.log_context("get_media_podcasts", tag="api")
def get_media_podcasts() -> JSONResponse:
    return JSONResponse(fetch_dataset(Datasets.PODCASTS))


@router.get(path="/media/tv")
@logging_utilities.log_context("get_media_tv", tag="api")
def get_media_tv() -> JSONResponse:
    return JSONResponse(fetch_dataset(Datasets.TV_SHOWS))


@router.get(path="/media/youtube")
@logging_utilities.log_context("get_media_youtube", tag="api")
def get_media_youtube() -> JSONResponse:
    return JSONResponse(fetch_dataset(Datasets.YOUTUBE_CHANNELS))


@router.get(path="/media/books")
@logging_utilities.log_context("get_media_books", tag="api")
def get_media_books() -> JSONResponse:
    return JSONResponse(fetch_dataset(Datasets.BOOKS))


class PostMediaTikToksRequest(BaseModel):
    query: str
    id: Optional[str]


@router.post(path="/media/tiktoks")
@logging_utilities.log_context("post_media_tiktoks", tag="api")
def post_media_tiktoks(request: PostMediaTikToksRequest) -> JSONResponse:
    max_results = 25

    query = request.query
    tiktoks = fetch_dataset(Datasets.TIKTOKS)

    if request.id is not None:
        results = [tiktok for tiktok in tiktoks if tiktok["id"] == request.id]
        return JSONResponse({"query": query, "results": results})

    if query == "":
        results = [tiktok for tiktok in tiktoks if tiktok["favorite"]]
        return JSONResponse({"query": query, "results": results})

    query_tokens = [token.lower() for token in query.lower().split(" ")]

    scores = []
    for tiktok in tiktoks:
        tags = [tag.lower() for tag in tiktok["tags"]]
        score = 0
        for token in query_tokens:
            if token in tags:
                score += 1
        if tiktok["creator"] is not None and tiktok["creator"].lower() == query.lower():
            score += 10
        scores.append((tiktok, score))
    sorted_scores = sorted(scores, key=lambda x: x[1], reverse=True)
    results = [tiktok for tiktok, score in sorted_scores if score > 0]

    if len(results) > max_results:
        results = results[:max_results]

    return JSONResponse({"query": request.query, "results": results})


class PostMediaMemesRequest(BaseModel):
    query: str
    id: Optional[str]


@router.post(path="/media/memes")
@logging_utilities.log_context("post_media_memes", tag="api")
def post_media_memes(request: PostMediaMemesRequest) -> JSONResponse:
    max_results = 25

    query = request.query
    memes = fetch_dataset(Datasets.MEMES)

    if request.id is not None:
        results = [meme for meme in memes if meme["id"] == request.id]
        return JSONResponse({"query": query, "results": results})

    if query == "":
        results = [meme for meme in memes if meme["favorite"]]
        return JSONResponse({"query": query, "results": results})

    query_tokens = [token.lower() for token in query.lower().split(" ")]

    scores = []
    for meme in memes:
        tags = [tag.lower() for tag in meme["tags"]]
        score = 0
        for token in query_tokens:
            if token in tags:
                score += 1
        scores.append((meme, score))
    sorted_scores = sorted(scores, key=lambda x: x[1], reverse=True)
    results = [meme for meme, score in sorted_scores if score > 0]

    if len(results) > max_results:
        results = results[:max_results]

    return JSONResponse({"query": request.query, "results": results})
