"""Post validator."""
from jsonvl import validate_file
from pathlib import Path


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
    validate_file(PROJECTS_FILEPATH, PROJECTS_SCHEMA_FILEPATH)
    print("Validation succeeded: projects")
