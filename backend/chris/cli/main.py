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
@click.option("-n", "--n_guids", type=int, default=1, help="Number of guids to generate")
def guid(n_guids: int) -> None:
    generate(n=n_guids)


@cli.command()
@click.option("--type", type=click.Choice(["posts", "projects", "hikes"]), help="Type of entity to validate")
def validate(type: str) -> None:
    if type is None or type == "posts":
        validate_posts()
    if type is None or type == "projects":
        validate_projects()
    if type is None or type == "hikes":
        validate_hikes()
