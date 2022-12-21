from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel

# from chris.app import logging_utilities
from chris.datasets.fetch import fetch_dataset
from chris.datasets.datasets import Datasets

router = APIRouter()


class TempModel(BaseModel):
    # TODO: Change this model
    temp: str = "temp"


# @logging_utilities.log_context("get_media", tag="api")
@router.get(path="/media", response_model=TempModel)
def get_media() -> JSONResponse:
    """Get media data."""
    movies_df = fetch_dataset(Datasets.MOVIES)
    podcasts_df = fetch_dataset(Datasets.PODCASTS)
    tv_shows_df = fetch_dataset(Datasets.TV_SHOWS)
    youtube_channels_df = fetch_dataset(Datasets.YOUTUBE_CHANNELS)
    return JSONResponse({
        "movies": list(movies_df.T.to_dict().values()),
        "podcasts": list(podcasts_df.T.to_dict().values()),
        "tv": list(tv_shows_df.T.to_dict().values()),
        "youtube": list(youtube_channels_df.T.to_dict().values()),
    })


# @logging_utilities.log_context("get_media_movies", tag="api")
@router.get(path="/media/movies", response_model=TempModel)
def get_media_movies() -> JSONResponse:
    """Get movie data."""
    movies_df = fetch_dataset(Datasets.MOVIES)
    return JSONResponse(list(movies_df.T.to_dict().values()))


# @logging_utilities.log_context("get_media_podcasts", tag="api")
@router.get(path="/media/tv", response_model=TempModel)
def get_media_podcasts() -> JSONResponse:
    """Get podcast data."""
    podcasts_df = fetch_dataset(Datasets.PODCASTS)
    return JSONResponse(list(podcasts_df.T.to_dict().values()))


# @logging_utilities.log_context("get_media_tv", tag="api")
@router.get(path="/media/podcasts", response_model=TempModel)
def get_media_tv() -> JSONResponse:
    """Get TV data."""
    tv_df = fetch_dataset(Datasets.TV_SHOWS)
    return JSONResponse(list(tv_df.T.to_dict().values()))


# @logging_utilities.log_context("get_media_youtube", tag="api")
@router.get(path="/media/youtube", response_model=TempModel)
def get_media_youtube() -> JSONResponse:
    """Get YouTube data."""
    youtube_df = fetch_dataset(Datasets.YOUTUBE_CHANNELS)
    return JSONResponse(list(youtube_df.T.to_dict().values()))
