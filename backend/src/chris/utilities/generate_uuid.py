import uuid


def generate(n: int = 1) -> None:
    for _ in range(n):
        print(str(uuid.uuid4()))
