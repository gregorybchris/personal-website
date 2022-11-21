"""Generator or unique IDs."""
import argparse
import uuid


def generate(n=1):
    """
    Generate a number of random GUIDs and print them to stdout.

    :param n: The number of GUIDs to generate.
    """
    for _ in range(n):
        print(str(uuid.uuid4()))


def parse_args():
    """Parse script args."""
    parser = argparse.ArgumentParser()
    parser.add_argument('-n', default=1, type=int)
    args = parser.parse_args()
    return args


if __name__ == '__main__':
    args = parse_args()
    generate(args.n)
