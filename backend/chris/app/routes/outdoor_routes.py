from fastapi import APIRouter
from fastapi.responses import JSONResponse

from chris.app import logging_utilities
from chris.datasets.datasets import Datasets
from chris.datasets.fetch import fetch_dataset

router = APIRouter()


@logging_utilities.log_context("get_outdoor", tag="api")
@router.get(path="/outdoor")
def get_outdoor() -> JSONResponse:
    return JSONResponse(
        {
            "cycling": fetch_dataset(Datasets.CYCLING_ROUTES),
            "hiking": fetch_dataset(Datasets.HIKING_ROUTES),
            "running": fetch_dataset(Datasets.RUNNING_ROUTES),
        }
    )


@logging_utilities.log_context("get_outdoor_cycling", tag="api")
@router.get(path="/outdoor/cycling")
def get_outdoor_cycling() -> JSONResponse:
    return JSONResponse(fetch_dataset(Datasets.CYCLING_ROUTES))


@logging_utilities.log_context("get_outdoor_hiking", tag="api")
@router.get(path="/outdoor/hiking")
def get_outdoor_hiking() -> JSONResponse:
    return JSONResponse(fetch_dataset(Datasets.HIKING_ROUTES))


@logging_utilities.log_context("get_outdoor_running", tag="api")
@router.get(path="/outdoor/running")
def get_outdoor_running() -> JSONResponse:
    return JSONResponse(fetch_dataset(Datasets.RUNNING_ROUTES))
