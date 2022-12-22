"""Main entrypoint for the chris package."""
import click

from chris.utilities.generate_guid import generate
from chris.validation.validate import (
    validate_books,
    validate_hikes,
    validate_jobs,
    validate_posts,
    validate_projects,
)


@click.group()
def cli() -> None:
    pass


@cli.command()
@click.option("-n", "--n-guids", type=int, default=1, help="Number of guids to generate")
def guid(n_guids: int) -> None:
    generate(n=n_guids)


@cli.command()
@click.option(
    "-t",
    "--entity-type",
    type=click.Choice(["hikes", "posts", "projects"]),
    multiple=True,
    help="Type of entity to validate",
)
def validate(entity_type: str) -> None:
    validator_map = {
        "books": validate_books,
        "hikes": validate_hikes,
        "jobs": validate_jobs,
        "posts": validate_posts,
        "projects": validate_projects,
    }
    for entity, validator in validator_map.items():
        if entity in entity_type or len(entity_type) == 0:
            validator()
