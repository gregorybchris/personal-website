import argparse

from cgme.web.app import App
from cgme.validation.validate_posts import run_validation


SUBPARSER_NAME_APP = 'app'
SUBPARSER_NAME_VALIDATE = 'validate'


def start_app():
    App().run()


def parse_args():
    parser = argparse.ArgumentParser()

    subparsers = parser.add_subparsers(required=True, dest='command',
                                       help="CGme commands.")

    subparsers.add_parser(SUBPARSER_NAME_APP)
    subparsers.add_parser(SUBPARSER_NAME_VALIDATE)

    args = parser.parse_args()
    return args


def run_cli():
    args = parse_args()

    if args.command == SUBPARSER_NAME_APP:
        start_app()
    elif args.command == SUBPARSER_NAME_VALIDATE:
        run_validation()
    else:
        raise ValueError("Invalid command")
