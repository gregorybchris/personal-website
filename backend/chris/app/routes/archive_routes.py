import logging

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from chris.app import logging_utilities
from chris.datasets.datasets import Datasets
from chris.datasets.fetch import fetch_dataset

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get(path="/archive")
@logging_utilities.log_context("get_archive", tag="api")
def get_archive() -> JSONResponse:
    return JSONResponse(fetch_dataset(Datasets.ARCHIVE))
