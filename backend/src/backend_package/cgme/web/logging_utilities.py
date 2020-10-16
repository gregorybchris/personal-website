import functools
import logging
import logging.handlers
import os
import time

from opencensus.ext.azure.log_exporter import AzureLogHandler

from cgme.web import settings


DEFAULT_LOG_SIZE = 5000000
DEFAULT_N_BACKUPS = 5


logger = logging.getLogger(__name__)


def initialize_logger():
    logger.setLevel(logging.DEBUG)

    file_handler = logging.handlers.RotatingFileHandler(
        settings.LOG_FILE_NAME, maxBytes=DEFAULT_LOG_SIZE, backupCount=DEFAULT_N_BACKUPS)
    file_formatter = logging.Formatter(
        '%(asctime)s.%(msecs)03d (%(levelname)s) %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
    file_handler.setFormatter(file_formatter)
    logger.addHandler(file_handler)

    connection_string = f'InstrumentationKey={settings.INSTRUMENTATION_KEY}'
    azure_handler = AzureLogHandler(connection_string=connection_string)
    azure_formatter = logging.Formatter('%(message)s')
    azure_handler.setFormatter(azure_formatter)
    logger.addHandler(azure_handler)


def log_context(name, tag='='):
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
