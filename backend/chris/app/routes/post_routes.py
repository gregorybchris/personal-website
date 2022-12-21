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


# @logging_utilities.log_context("get_posts", tag="api")
@router.get(path="/posts", response_model=TempModel)
def get_posts():
    """Get blog post data."""
    return JSONResponse({"posts": fetch_dataset(Datasets.POSTS)})
