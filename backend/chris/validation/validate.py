"""Post validator."""
from jsonvl import Validator, validate_file
from jsonvl.errors import JsonValidationError
from pathlib import Path
from chris.validation.constraints import MonotoneIncreaseConstraint

DATA_DIRPATH = Path(__file__).parent / ".." / "datasets" / "data"
SCHEMAS_DIRPATH = Path(__file__).parent / "schemas"


def validate_posts() -> None:
    """Validate all posts."""
    try:
        validate_file(
            DATA_DIRPATH / "blog" / "posts.json",
            SCHEMAS_DIRPATH / "posts-schema.json",
        )
    except JsonValidationError as e:
        print("Validation failed: posts")
        print(e)
    print("Validation succeeded: posts")


def validate_projects() -> None:
    """Validate all projects."""
    validator = Validator()
    validator.register_constraint(MonotoneIncreaseConstraint(), "array", "monotone_inc")
    try:
        validator.validate_file(
            DATA_DIRPATH / "projects" / "projects.json",
            SCHEMAS_DIRPATH / "projects-schema.json",
        )
    except JsonValidationError as e:
        print("Validation failed: projects")
        print(e)
    print("Validation succeeded: projects")


def validate_hikes() -> None:
    """Validate all hikes."""
    validator = Validator()
    validator.register_constraint(MonotoneIncreaseConstraint(), "array", "monotone_inc")
    try:
        validator.validate_file(
            DATA_DIRPATH / "outdoor" / "hiking-routes.json",
            SCHEMAS_DIRPATH / "hiking-routes-schema.json",
        )
    except JsonValidationError as e:
        print("Validation failed: hikes")
        print(e)
    print("Validation succeeded: hikes")


def validate_jobs() -> None:
    """Validate all jobs."""
    try:
        validate_file(
            DATA_DIRPATH / "professional" / "jobs.json",
            SCHEMAS_DIRPATH / "jobs-schema.json",
        )
    except JsonValidationError as e:
        print("Validation failed: jobs")
        print(e)
    print("Validation succeeded: jobs")


def validate_books() -> None:
    """Validate all books."""
    try:
        validate_file(
            DATA_DIRPATH / "media" / "books.json",
            SCHEMAS_DIRPATH / "books-schema.json",
        )
    except JsonValidationError as e:
        print("Validation failed: books")
        print(e)
    print("Validation succeeded: books")
