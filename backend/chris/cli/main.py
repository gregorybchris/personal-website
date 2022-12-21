"""Main entrypoint for the chris package."""
import click

from chris.utilities.generate_guid import generate
from chris.validation.validate import validate_posts
from chris.validation.validate import validate_projects
from chris.validation.validate import validate_hikes


@click.group()
def cli() -> None:
    pass


@cli.command()
@click.option("-n", "--n-guids", type=int, default=1, help="Number of guids to generate")
def guid(n_guids: int) -> None:
    generate(n=n_guids)


@cli.command()
@click.option("-t",
              "--entity-type",
              type=click.Choice(["posts", "projects", "hikes"]),
              multiple=True,
              help="Type of entity to validate")
def validate(entity_type: str) -> None:
    validator_map = {
        "posts": validate_posts,
        "projects": validate_projects,
        "hikes": validate_hikes,
    }
    for entity, validator in validator_map.items():
        if entity in entity_type or len(entity_type) == 0:
            validator()
