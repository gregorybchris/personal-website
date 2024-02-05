from fastapi import APIRouter
from fastapi.responses import JSONResponse

from chris.app import logging_utilities
from chris.datasets.datasets import Datasets
from chris.datasets.fetch import fetch_dataset

router = APIRouter()


@logging_utilities.log_context("get_media", tag="api")
@router.get(path="/media")
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


@logging_utilities.log_context("get_media_movies", tag="api")
@router.get(path="/media/movies")
def get_media_movies() -> JSONResponse:
    return JSONResponse(fetch_dataset(Datasets.MOVIES))


@logging_utilities.log_context("get_media_podcasts", tag="api")
@router.get(path="/media/podcasts")
def get_media_podcasts() -> JSONResponse:
    return JSONResponse(fetch_dataset(Datasets.PODCASTS))


@logging_utilities.log_context("get_media_tv", tag="api")
@router.get(path="/media/tv")
def get_media_tv() -> JSONResponse:
    return JSONResponse(fetch_dataset(Datasets.TV_SHOWS))


@logging_utilities.log_context("get_media_youtube", tag="api")
@router.get(path="/media/youtube")
def get_media_youtube() -> JSONResponse:
    return JSONResponse(fetch_dataset(Datasets.YOUTUBE_CHANNELS))


@logging_utilities.log_context("get_media_books", tag="api")
@router.get(path="/media/books")
def get_media_books() -> JSONResponse:
    return JSONResponse(fetch_dataset(Datasets.BOOKS))
