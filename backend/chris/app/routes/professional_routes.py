import logging

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from chris.app import logging_utilities
from chris.datasets.datasets import Datasets
from chris.datasets.fetch import fetch_dataset

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get(path="/professional")
@logging_utilities.log_context("get_professional", tag="api")
def get_professional() -> JSONResponse:
    return JSONResponse(
        {
            "courses": fetch_dataset(Datasets.COURSES),
            "jobs": fetch_dataset(Datasets.JOBS),
        }
    )


@router.get(path="/professional/courses")
@logging_utilities.log_context("get_professional_courses", tag="api")
def get_professional_courses() -> JSONResponse:
    return JSONResponse(fetch_dataset(Datasets.COURSES))


@router.get(path="/professional/jobs")
@logging_utilities.log_context("get_professional_jobs", tag="api")
def get_professional_jobs() -> JSONResponse:
    return JSONResponse(fetch_dataset(Datasets.JOBS))
