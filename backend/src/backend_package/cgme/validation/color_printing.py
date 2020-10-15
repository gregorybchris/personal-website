from sty import fg


class Color:
    GREEN = (110, 220, 100)
    RED = (200, 80, 90)


def print_rgb(s, *args, rgb=None, **kwargs):
    print(f"{fg(*rgb)}{s}{fg.rs}", *args, **kwargs)
