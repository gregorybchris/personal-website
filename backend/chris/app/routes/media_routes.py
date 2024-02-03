from fastapi import APIRouter
from fastapi.responses import JSONResponse

from chris.app import logging_utilities
from chris.datasets.fetch import fetch_dataset
from chris.datasets.datasets import Datasets

router = APIRouter()



@logging_utilities.log_context("get_media", tag="api")
@router.get(path="/media")
def get_media() -> JSONResponse:
    """Get media data."""
    books = fetch_dataset(Datasets.BOOKS)
    movies_df = fetch_dataset(Datasets.MOVIES)
    podcasts_df = fetch_dataset(Datasets.PODCASTS)
    tv_shows_df = fetch_dataset(Datasets.TV_SHOWS)
    youtube_channels = fetch_dataset(Datasets.YOUTUBE_CHANNELS)
    
    return JSONResponse({
        "books": books,
        "movies": list(movies_df.T.to_dict().values()),
        "podcasts": list(podcasts_df.T.to_dict().values()),
        "tv": list(tv_shows_df.T.to_dict().values()),
        "youtube": youtube_channels,
    })


@logging_utilities.log_context("get_media_movies", tag="api")
@router.get(path="/media/movies")
def get_media_movies() -> JSONResponse:
    """Get movie data."""
    movies_df = fetch_dataset(Datasets.MOVIES)
    return JSONResponse(list(movies_df.T.to_dict().values()))


@logging_utilities.log_context("get_media_podcasts", tag="api")
@router.get(path="/media/podcasts")
def get_media_podcasts() -> JSONResponse:
    """Get podcast data."""
    podcasts_df = fetch_dataset(Datasets.PODCASTS)
    return JSONResponse(list(podcasts_df.T.to_dict().values()))


@logging_utilities.log_context("get_media_tv", tag="api")
@router.get(path="/media/tv")
def get_media_tv() -> JSONResponse:
    """Get TV data."""
    tv_df = fetch_dataset(Datasets.TV_SHOWS)
    return JSONResponse(list(tv_df.T.to_dict().values()))


@logging_utilities.log_context("get_media_youtube", tag="api")
@router.get(path="/media/youtube")
def get_media_youtube() -> JSONResponse:
    """Get YouTube data."""
    return JSONResponse(fetch_dataset(Datasets.YOUTUBE_CHANNELS))


@logging_utilities.log_context("get_media_books", tag="api")
@router.get(path="/media/books")
def get_media_books() -> JSONResponse:
    """Get books data."""
    return JSONResponse(fetch_dataset(Datasets.BOOKS))
