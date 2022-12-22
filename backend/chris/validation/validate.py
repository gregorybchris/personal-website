"""Post validator."""
from jsonvl import Validator, validate_file
from pathlib import Path
from chris.validation.constraints import MonotoneIncreaseConstraint

DATA_DIRPATH = Path(__file__).parent / ".." / "datasets" / "data"
SCHEMAS_DIRPATH = Path(__file__).parent / "schemas"


def validate_posts() -> None:
    """Validate all posts."""
    validate_file(
        DATA_DIRPATH / "blog" / "posts.json",
        SCHEMAS_DIRPATH / "posts-schema.json",
    )
    print("Validation succeeded: posts")


def validate_projects() -> None:
    """Validate all projects."""
    validator = Validator()
    validator.register_constraint(MonotoneIncreaseConstraint(), "array", "monotone_inc")
    validator.validate_file(
        DATA_DIRPATH / "projects" / "projects.json",
        SCHEMAS_DIRPATH / "projects-schema.json",
    )
    print("Validation succeeded: projects")


def validate_hikes() -> None:
    """Validate all hikes."""
    validator = Validator()
    validator.register_constraint(MonotoneIncreaseConstraint(), "array", "monotone_inc")
    validator.validate_file(
        DATA_DIRPATH / "outdoor" / "hiking-routes.json",
        SCHEMAS_DIRPATH / "hiking-routes-schema.json",
    )
    print("Validation succeeded: hikes")


def validate_jobs() -> None:
    """Validate all jobs."""
    validate_file(
        DATA_DIRPATH / "professional" / "jobs.json",
        SCHEMAS_DIRPATH / "jobs-schema.json",
    )
    print("Validation succeeded: jobs")


def validate_books() -> None:
    """Validate all books."""
    validate_file(
        DATA_DIRPATH / "media" / "books.json",
        SCHEMAS_DIRPATH / "books-schema.json",
    )
    print("Validation succeeded: books")
