"""Generator or unique IDs."""
import uuid


def generate(n: int = 1) -> None:
    """
    Generate a number of random GUIDs and print them to stdout.

    :param n: The number of GUIDs to generate.
    """
    for _ in range(n):
        print(str(uuid.uuid4()))
