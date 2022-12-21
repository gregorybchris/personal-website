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


# @logging_utilities.log_context("get_professional", tag="api")
@router.get(path="/professional", response_model=TempModel)
def get_professional():
    """Get professional data."""
    return JSONResponse({
        "courses": fetch_dataset(Datasets.COURSES),
        "jobs": fetch_dataset(Datasets.JOBS),
    })


# @logging_utilities.log_context("get_professional_courses", tag="api")
@router.get(path="/professional/courses", response_model=TempModel)
def get_professional_courses():
    """Get college course data."""
    return JSONResponse(fetch_dataset(Datasets.COURSES))


# @logging_utilities.log_context("get_professional_jobs", tag="api")
@router.get(path="/professional/jobs", response_model=TempModel)
def get_professional_jobs():
    """Get job data."""
    return JSONResponse(fetch_dataset(Datasets.JOBS))
