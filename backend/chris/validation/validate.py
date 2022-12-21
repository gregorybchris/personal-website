"""Post validator."""
from jsonvl import Validator, validate_file
from pathlib import Path
from chris.validation.constraints import MonotoneIncreaseConstraint

DATA_DIRPATH = Path(__file__).parent / ".." / "datasets" / "data"
SCHEMAS_DIRPATH = Path(__file__).parent / "schemas"

POSTS_FILEPATH = DATA_DIRPATH / "blog" / "posts.json"
POSTS_SCHEMA_FILEPATH = SCHEMAS_DIRPATH / "posts-schema.json"

PROJECTS_FILEPATH = DATA_DIRPATH / "projects" / "projects.json"
PROJECTS_SCHEMA_FILEPATH = SCHEMAS_DIRPATH / "projects-schema.json"

HIKES_FILEPATH = DATA_DIRPATH / "outdoor" / "hiking-routes.json"
HIKES_SCHEMA_FILEPATH = SCHEMAS_DIRPATH / "hiking-routes-schema.json"

JOBS_FILEPATH = DATA_DIRPATH / "professional" / "jobs.json"
JOBS_SCHEMA_FILEPATH = SCHEMAS_DIRPATH / "jobs-schema.json"


def validate_posts() -> None:
    """Validate all posts."""
    validate_file(POSTS_FILEPATH, POSTS_SCHEMA_FILEPATH)
    print("Validation succeeded: posts")


def validate_projects() -> None:
    """Validate all projects."""
    validator = Validator()
    validator.register_constraint(MonotoneIncreaseConstraint(), "array", "monotone_inc")
    validator.validate_file(PROJECTS_FILEPATH, PROJECTS_SCHEMA_FILEPATH)
    print("Validation succeeded: projects")


def validate_hikes() -> None:
    """Validate all hikes."""
    validator = Validator()
    validator.register_constraint(MonotoneIncreaseConstraint(), "array", "monotone_inc")
    validator.validate_file(HIKES_FILEPATH, HIKES_SCHEMA_FILEPATH)
    print("Validation succeeded: hikes")


def validate_jobs() -> None:
    """Validate all jobs."""
    validate_file(JOBS_FILEPATH, JOBS_SCHEMA_FILEPATH)
    print("Validation succeeded: jobs")
