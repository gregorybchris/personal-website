import logging

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from chris.app import logging_utilities
from chris.datasets.datasets import Datasets
from chris.datasets.fetch import fetch_dataset

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get(path="/outdoor")
@logging_utilities.log_context("get_outdoor", tag="api")
def get_outdoor() -> JSONResponse:
    return JSONResponse(
        {
            "cycling": fetch_dataset(Datasets.CYCLING_ROUTES),
            "hiking": fetch_dataset(Datasets.HIKING_ROUTES),
            "running": fetch_dataset(Datasets.RUNNING_ROUTES),
        }
    )


@router.get(path="/outdoor/cycling")
@logging_utilities.log_context("get_outdoor_cycling", tag="api")
def get_outdoor_cycling() -> JSONResponse:
    return JSONResponse(fetch_dataset(Datasets.CYCLING_ROUTES))


@router.get(path="/outdoor/hiking")
@logging_utilities.log_context("get_outdoor_hiking", tag="api")
def get_outdoor_hiking() -> JSONResponse:
    return JSONResponse(fetch_dataset(Datasets.HIKING_ROUTES))


@router.get(path="/outdoor/running")
@logging_utilities.log_context("get_outdoor_running", tag="api")
def get_outdoor_running() -> JSONResponse:
    return JSONResponse(fetch_dataset(Datasets.RUNNING_ROUTES))
