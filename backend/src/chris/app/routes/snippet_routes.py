import logging

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from chris.app import logging_utilities
from chris.datasets.datasets import Datasets
from chris.datasets.fetch import fetch_dataset_json

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get(path="/snippets")
@logging_utilities.log_context("get_snippets", tag="api")
def get_snippets() -> JSONResponse:
    return JSONResponse(fetch_dataset_json(Datasets.SNIPPETS))
