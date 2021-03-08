"""App settings."""
import os


class EnvSetting:
    """App setting backed by an environment variable."""

    def __init__(self, variable, default=None, required=False):
        """Construct an EnvSetting."""
        self._variable = variable
        self._default = default
        self._required = required

    @property
    def var(self):
        """Get the variable name property."""
        return self._variable

    @property
    def default(self):
        """Get the default variable value property."""
        return self._default

    @property
    def value(self):
        """Get the variable value property."""
        variable_value = os.getenv(self._variable, self._default)
        if variable_value is None and self._required:
            raise EnvironmentError(f"Environment variable {self.var} is not set")
        return variable_value


# region app

FLASK_RUN_PORT = EnvSetting('FLASK_RUN_PORT', default=8000)
FLASK_DEBUG = EnvSetting('FLASK_DEBUG', 1)
FLASK_HOST = EnvSetting('FLASK_HOST', None)

# endregion app
# region telemetry

LOG_FILE_NAME = EnvSetting('CGME_LOG_FILE', 'cgme.log')
INSTRUMENTATION_KEY = EnvSetting('CGME_TELEMETRY_KEY', None)

# endregion telemetry
# region database

DATABASE_CONN_STRING = EnvSetting('CGME_DATABASE_CONN', None, required=True)
DATABASE_NAME = EnvSetting('CGME_DATABASE_NAME', 'website')

# endregion database
