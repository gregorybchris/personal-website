from logging import getLogger
from pathlib import Path

from fastapi import APIRouter
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel

from chris import __version__ as package_version
from chris.app import logging_utilities

logger = getLogger(__name__)

router = APIRouter()


class Status(BaseModel):
    status: str = "healthy"


class Version(BaseModel):
    version: str = "0.1.0"


@router.get(path="/", response_model=Status)
@logging_utilities.log_context("get_status", tag="api")
def get_status() -> JSONResponse:
    logger.info("GET app status")
    return JSONResponse(
        {
            "status": "healthy",
        }
    )


@router.get(path="/version", response_model=Version)
@logging_utilities.log_context("get_version", tag="api")
def get_version() -> JSONResponse:
    logger.info("GET app version")
    return JSONResponse(
        {
            "version": package_version,
        }
    )


@router.get(path="/index")
@logging_utilities.log_context("get_index", tag="api")
def get_index() -> HTMLResponse:
    logger.info("GET app index!")
    templates_dirpath = Path(__file__).parent.parent / "templates"
    index_filepath = templates_dirpath / "index.html"
    index_content = index_filepath.read_text()
    return HTMLResponse(content=index_content, status_code=200)
