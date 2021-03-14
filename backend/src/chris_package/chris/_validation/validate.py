"""Post validator."""
from jsonvl import Validator, validate_file
from pathlib import Path
from chris._validation.constraints import MonotoneIncreaseConstraint


DATA_DIRPATH = Path(__file__).parent / '..' / 'datasets' / 'data'
POSTS_FILEPATH = DATA_DIRPATH / 'blog' / 'posts.json'
PROJECTS_FILEPATH = DATA_DIRPATH / 'projects' / 'projects.json'

SCHEMAS_DIRPATH = Path(__file__).parent / 'schemas'
POSTS_SCHEMA_FILEPATH = SCHEMAS_DIRPATH / 'posts-schema.json'
PROJECTS_SCHEMA_FILEPATH = SCHEMAS_DIRPATH / 'projects-schema.json'


def validate_posts():
    """Validate all posts."""
    validate_file(POSTS_FILEPATH, POSTS_SCHEMA_FILEPATH)
    print("Validation succeeded: posts")


def validate_projects():
    """Validate all projects."""
    validator = Validator()
    validator.register_constraint(MonotoneIncreaseConstraint(), 'array', 'monotone_inc')
    validator.validate_file(PROJECTS_FILEPATH, PROJECTS_SCHEMA_FILEPATH)
    print("Validation succeeded: projects")
