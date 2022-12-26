"""Main entrypoint for the chris package."""
import click

from chris.utilities.generate_guid import generate
from chris.validation.validate import validate_all


@click.group()
def cli() -> None:
    pass


@cli.command()
@click.option("-n", "--n-guids", type=int, default=1, help="Number of guids to generate")
def guid(n_guids: int) -> None:
    generate(n=n_guids)


@cli.command()
def validate() -> None:
    validate_all()
