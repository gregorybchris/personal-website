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


# @logging_utilities.log_context("get_recipes", tag="api")
@router.get(path="/recipes", response_model=TempModel)
def get_recipes() -> JSONResponse:
    """Get recipe data."""
    return JSONResponse(fetch_dataset(Datasets.RECIPES))
