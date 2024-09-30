from pathlib import Path

from jsonvl import Validator
from jsonvl.errors import JsonValidationError

from chris.validation.constraints import MonotoneIncreaseConstraint

DATA_DIRPATH = Path(__file__).parent.parent / "datasets" / "data"
SCHEMAS_DIRPATH = Path(__file__).parent / "schemas"


def validate_all() -> None:
    validator = Validator()
    validator.register_constraint(MonotoneIncreaseConstraint(), "array", "monotone_inc")
    schema_map = [
        # Media
        ("books", "media/books.json", "books-schema.json"),
        ("memes", "media/memes.json", "memes-schema.json"),
        ("movies", "media/movies.json", "movies-schema.json"),
        ("podcasts", "media/podcasts.json", "podcasts-schema.json"),
        ("tiktoks", "media/tiktoks.json", "tiktoks-schema.json"),
        ("tv-shows", "media/tv-shows.json", "tv-shows-schema.json"),
        ("youtube-channels", "media/youtube-channels.json", "youtube-channels-schema.json"),
        # Professional
        ("courses", "professional/courses.json", "courses-schema.json"),
        ("jobs", "professional/jobs.json", "jobs-schema.json"),
        # Outdoor
        ("hiking", "outdoor/hiking-routes.json", "hiking-routes-schema.json"),
        ("running", "outdoor/running-routes.json", "running-routes-schema.json"),
        # Projects
        ("projects", "projects/projects.json", "projects-schema.json"),
        # Blog
        ("posts", "blog/posts.json", "posts-schema.json"),
    ]
    for name, data_filename, schema_filename in schema_map:
        data_filepath = DATA_DIRPATH / data_filename
        schema_filepath = SCHEMAS_DIRPATH / schema_filename

        try:
            validator.validate_file(data_filepath, schema_filepath)
        except JsonValidationError as e:
            print(f"Validation failed: {name}")
            print(e)
        else:
            print(f"Validation succeeded: {name}")
