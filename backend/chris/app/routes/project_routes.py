from fastapi import APIRouter
from fastapi.logger import logger
from fastapi.responses import JSONResponse
from pydantic import BaseModel

# from chris.app import logging_utilities
from chris.datasets.fetch import fetch_dataset
from chris.datasets.datasets import Datasets

router = APIRouter()


class TempModel(BaseModel):
    # TODO: Change this model
    temp: str = "temp"


# @logging_utilities.log_context("get_projects", tag="api")
@router.get(path="/projects", response_model=TempModel)
def get_projects():
    """Get project data."""
    return JSONResponse(fetch_dataset(Datasets.PROJECTS))


# @logging_utilities.log_context("post_projects_download", tag="api")
@router.post(path="/projects/download/<project_id>", response_model=TempModel)
def post_projects_download(project_id: str):
    """Post a project download action."""
    projects = fetch_dataset(Datasets.PROJECTS)
    for project in projects:
        if project["project_id"] == project_id:
            project_name = project["name"]
            logger.log(f"Project \"{project_name}\" ({project_id}) downloaded")

            return JSONResponse({"message": f"Successfully downloaded project {project_name}"})
    return JSONResponse({"message": f"Project with ID {project_id} not found"})