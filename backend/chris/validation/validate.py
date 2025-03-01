from pathlib import Path

from jsonvl import Validator
from jsonvl.errors import JsonValidationError

from chris.validation.constraints import MonotoneIncreaseConstraint

DATA_DIRPATH = Path(__file__).parent.parent / "datasets" / "data"
SCHEMAS_DIRPATH = Path(__file__).parent / "schemas"


def validate_all() -> None:
    validator = Validator()
    validator.register_constraint(MonotoneIncreaseConstraint(), "array", "monotone_inc")
    schemas = [
        ("blog", "posts"),
        ("media", "books"),
        ("media", "instagrams"),
        ("media", "memes"),
        ("media", "movies"),
        ("media", "podcasts"),
        ("media", "tiktoks"),
        ("media", "tv-shows"),
        ("media", "youtube-channels"),
        ("outdoor", "hiking-routes"),
        ("outdoor", "running-routes"),
        ("professional", "courses"),
        ("professional", "jobs"),
        ("projects", "projects"),
    ]
    for folder_name, file_name in schemas:
        data_filepath = DATA_DIRPATH / folder_name / f"{file_name}.json"
        schema_filepath = SCHEMAS_DIRPATH / folder_name / f"{file_name}-schema.json"

        try:
            validator.validate_file(data_filepath, schema_filepath)
        except JsonValidationError as e:
            print(f"Validation failed: {file_name}")
            print(f"  {e}")
        else:
            print(f"Validation succeeded: {file_name}")
