"""App settings."""
import os


class EnvSetting:
    def __init__(self, variable, default=None):
        self._variable = variable
        self._default = default

    @property
    def var(self):
        return self._variable

    @property
    def default(self):
        return self._default

    @property
    def value(self):
        return os.getenv(self._variable, self._default)


# region app

FLASK_RUN_PORT = EnvSetting('FLASK_RUN_PORT', default=8000)
FLASK_DEBUG = EnvSetting('FLASK_DEBUG', 1)
FLASK_HOST = EnvSetting('FLASK_HOST', None)

# endregion app
# region telemetry

LOG_FILE_NAME = EnvSetting('CGME_LOG_FILE', 'cgme.log')
INSTRUMENTATION_KEY = EnvSetting('INSTRUMENTATION_KEY', None)

# endregion telemetry
# region database

DATABASE_CONN_STRING = EnvSetting('CGME_DATABASE_CONN', None)
DATABASE_NAME = EnvSetting('CGME_DATABASE_NAME', 'website')

# endregion database
