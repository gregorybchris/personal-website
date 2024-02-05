import logging

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from chris.app import logging_utilities
from chris.datasets.datasets import Datasets
from chris.datasets.fetch import fetch_dataset

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get(path="/recipes")
@logging_utilities.log_context("get_recipes", tag="api")
def get_recipes() -> JSONResponse:
    return JSONResponse(fetch_dataset(Datasets.RECIPES))
