import click

from chris.utilities.generate_uuid import generate
from chris.validation.validate import validate_all


@click.group()
def main() -> None:
    pass


@main.command()
@click.option("-n", "--n-uuids", type=int, default=1, help="Number of uuids to generate")
def uuid(n_uuids: int) -> None:
    generate(n=n_uuids)


@main.command()
def validate() -> None:
    validate_all()
