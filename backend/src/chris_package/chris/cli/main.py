"""Main entrypoint for the chris package."""
import argparse

from chris.app.app import App
from chris._utilities.generate_guid import generate
from chris._validation.validate import validate_posts
from chris._validation.validate import validate_projects

SUBPARSER_NAME_APP = 'app'
SUBPARSER_NAME_GUID = 'guid'
SUBPARSER_NAME_VALIDATE = 'validate'


def start_app():
    """Start a webserver and run the app."""
    App().run()


def parse_args():
    """Parse script args."""
    parser = argparse.ArgumentParser()

    subparsers = parser.add_subparsers(required=True, dest='command',
                                       help="Chris package commands.")

    subparsers.add_parser(SUBPARSER_NAME_APP)

    guid_parser = subparsers.add_parser(SUBPARSER_NAME_GUID)
    guid_parser.add_argument('-n', '--n_guids', type=int, default=1,
                             help="Number of guids to generate")

    validate_parser = subparsers.add_parser(SUBPARSER_NAME_VALIDATE)
    validate_parser.add_argument('--type', choices=['posts', 'projects'],
                                 help="Type of entity to validate")

    args = parser.parse_args()
    return args


def run_cli():
    """Run the package CLI."""
    args = parse_args()

    if args.command == SUBPARSER_NAME_APP:
        start_app()
    elif args.command == SUBPARSER_NAME_VALIDATE:
        if args.type is None or args.type == 'posts':
            validate_posts()
        if args.type is None or args.type == 'projects':
            validate_projects()
    elif args.command == SUBPARSER_NAME_GUID:
        generate(n=args.n_guids)
    else:
        raise ValueError("Invalid command")
