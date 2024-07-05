from datetime import datetime
from logging import getLogger
from typing import Any, Dict, List

from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from chris.app import logging_utilities
from chris.datasets.datasets import Datasets
from chris.datasets.fetch import fetch_dataset_json

logger = getLogger(__name__)

router = APIRouter()


class RequestModel(BaseModel):
    choices: List[List[bool]]
    feedback: str


@router.get(path="/surveys")
@logging_utilities.log_context("get_surveys", tag="api")
def get_surveys() -> JSONResponse:
    return JSONResponse(fetch_dataset_json(Datasets.SURVEYS))


@router.post(path="/surveys/{survey_id}")
@logging_utilities.log_context("post_survey_results", tag="api")
def post_survey_results(request: RequestModel, survey_id: str) -> JSONResponse:
    surveys = fetch_dataset_json(Datasets.SURVEYS)
    # TODO: Check for invalid survey ID
    for survey in surveys:
        if survey["survey_id"] == survey_id:
            survey_name = survey["name"]
            logger.info(f'Survey "{survey_name}" ({survey_id}) submitted')
            _ = {
                "survey_id": survey_id,
                "created_date": datetime.now(),
                "response": request,
            }
            # db.insert_one(document)

            return JSONResponse({"message": f'Successfully submitted survey "{survey_name}"'})
    return JSONResponse({"message": f"Survey with ID {survey_id} not found"})


@router.get(path="/surveys/results")
@logging_utilities.log_context("get_survey_results", tag="api")
def get_survey_results() -> JSONResponse:
    # result_documents = list(db.find_all())
    result_documents: List[Dict[str, Any]] = []
    counts = {}
    for result_document in result_documents:
        survey_id = result_document["survey_id"]
        choices_array = [[int(v) for v in vs] for vs in result_document["response"]["choices"]]
        if survey_id not in counts:
            counts[survey_id] = [[0 for _ in xs] for xs in choices_array]

        for i in range(len(counts[survey_id])):
            for j in range(len(counts[survey_id][0])):
                counts[survey_id][i][j] += choices_array[i][j]
    surveys = fetch_dataset_json(Datasets.SURVEYS)
    survey_map = {survey["survey_id"]: survey for survey in surveys}
    return JSONResponse(_results_from_counts(counts, survey_map))


def _results_from_counts(counts: Dict[str, List[List[int]]], survey_map: Dict[str, Any]) -> List[Dict[str, Any]]:
    results = []
    for survey_id, survey_counts in counts.items():
        survey = survey_map[survey_id]
        survey_result_questions = []
        for question_counts, question in zip(survey_counts, survey["questions"]):
            question_counts_sum = sum(question_counts)
            question_frequencies = [c / question_counts_sum for c in question_counts]
            question_result_choices = []
            for option_number in range(len(question["options"])):
                question_result_choices.append(
                    {
                        "option": question["options"][option_number],
                        "frequency": float(question_frequencies[option_number]),
                        "count": float(question_counts[option_number]),
                    }
                )
            survey_result_questions.append(
                {
                    "question": question["text"],
                    "options": question_result_choices,
                }
            )
        results.append(
            {
                "survey_name": survey["name"],
                "questions": survey_result_questions,
            }
        )
    return results
