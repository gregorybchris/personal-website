from fastapi import APIRouter
from fastapi.responses import JSONResponse

from chris.app import logging_utilities
from chris.datasets.datasets import Datasets
from chris.datasets.fetch import fetch_dataset

router = APIRouter()


@logging_utilities.log_context("get_posts", tag="api")
@router.get(path="/posts")
def get_posts() -> JSONResponse:
    return JSONResponse({"posts": fetch_dataset(Datasets.POSTS)})
