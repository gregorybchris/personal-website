from fastapi import APIRouter
from fastapi.logger import logger
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from chris import __version__ as package_version
from chris.app import logging_utilities

router = APIRouter()


class Status(BaseModel):
    status: str = "healthy"


class Version(BaseModel):
    version: str = "0.1.0"


@logging_utilities.log_context("get_status", tag="api")
@router.get(path="/", response_model=Status)
def get_status() -> JSONResponse:
    logger.info("GET app status")
    return JSONResponse({
        "status": "healthy",
    })


@logging_utilities.log_context("get_version", tag="api")
@router.get(path="/version", response_model=Version)
def get_version() -> JSONResponse:
    logger.info("GET app version")
    return JSONResponse({
        "version": package_version,
    })
