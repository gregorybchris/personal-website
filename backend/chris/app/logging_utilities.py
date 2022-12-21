"""Logging utilities."""
import functools
import time

from fastapi.logger import logger

DEFAULT_LOG_SIZE = 5000000
DEFAULT_N_BACKUPS = 5


def log_context(name: str, tag: str = "="):
    """
    Decorate a function for logging activity.

    :param name: Name of the activity.
    :param tag: Tag for the kind of activity.
    """

    def decorator(function):

        @functools.wraps(function)
        def func_wrapper(*args, **kwargs):
            start_time = time.time()
            logger.info(f"[{tag}] Start:{name}")
            result = function(*args, **kwargs)
            total_time = round(time.time() - start_time, 5)
            logger.info(f"[{tag}] End:{name}, Time:{total_time}")
            return result

        return func_wrapper

    return decorator
