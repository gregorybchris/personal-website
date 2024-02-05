import logging

from fastapi import APIRouter
from fastapi.responses import JSONResponse

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
