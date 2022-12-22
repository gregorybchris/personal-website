from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from chris.app import logging_utilities
from chris.datasets.fetch import fetch_dataset
from chris.datasets.datasets import Datasets

router = APIRouter()


class TempModel(BaseModel):
    # TODO: Change this model
    temp: str = "temp"


@logging_utilities.log_context("get_outdoor", tag="api")
@router.get(path="/outdoor", response_model=TempModel)
def get_outdoor() -> JSONResponse:
    """Get outdoor data."""
    return JSONResponse({
        "cycling": fetch_dataset(Datasets.CYCLING_ROUTES),
        "hiking": fetch_dataset(Datasets.HIKING_ROUTES),
        "running": fetch_dataset(Datasets.RUNNING_ROUTES),
    })


@logging_utilities.log_context("get_outdoor_cycling", tag="api")
@router.get(path="/outdoor/cycling", response_model=TempModel)
def get_outdoor_cycling() -> JSONResponse:
    """Get cycling data."""
    return JSONResponse(fetch_dataset(Datasets.CYCLING_ROUTES))


@logging_utilities.log_context("get_outdoor_hiking", tag="api")
@router.get(path="/outdoor/hiking", response_model=TempModel)
def get_outdoor_hiking() -> JSONResponse:
    """Get hiking data."""
    return JSONResponse(fetch_dataset(Datasets.HIKING_ROUTES))


@logging_utilities.log_context("get_outdoor_running", tag="api")
@router.get(path="/outdoor/running", response_model=TempModel)
def get_outdoor_running() -> JSONResponse:
    """Get running data."""
    return JSONResponse(fetch_dataset(Datasets.RUNNING_ROUTES))
