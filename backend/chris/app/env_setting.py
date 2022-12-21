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
