import logging

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from chris.app import logging_utilities
from chris.datasets.datasets import Datasets
from chris.datasets.fetch import fetch_dataset_json

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get(path="/art")
@logging_utilities.log_context("get_art", tag="api")
def get_art() -> JSONResponse:
    pottery = fetch_dataset_json(Datasets.POTTERY)

    return JSONResponse(
        {
            "pottery": pottery,
        }
    )


@router.get(path="/art/pottery")
@logging_utilities.log_context("get_art_pottery", tag="api")
def get_art_pottery() -> JSONResponse:
    return JSONResponse(fetch_dataset_json(Datasets.POTTERY))
