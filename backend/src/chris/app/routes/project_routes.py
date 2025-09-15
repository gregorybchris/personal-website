from logging import getLogger

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from chris.app import logging_utilities
from chris.datasets.datasets import Datasets
from chris.datasets.fetch import fetch_dataset_json

logger = getLogger(__name__)

router = APIRouter()


@router.get(path="/projects")
@logging_utilities.log_context("get_projects", tag="api")
def get_projects() -> JSONResponse:
    return JSONResponse(fetch_dataset_json(Datasets.PROJECTS))


@router.post(path="/projects/download/{project_id}")
@logging_utilities.log_context("post_projects_download", tag="api")
def post_projects_download(project_id: str) -> JSONResponse:
    projects = fetch_dataset_json(Datasets.PROJECTS)
    for project in projects:
        if project["project_id"] == project_id:
            project_name = project["name"]
            logger.info(f'Project "{project_name}" ({project_id}) downloaded')

            return JSONResponse({"message": f"Successfully downloaded project {project_name}"})
    return JSONResponse({"message": f"Project with ID {project_id} not found"})
