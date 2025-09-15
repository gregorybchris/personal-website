import os
from dataclasses import dataclass
from typing import Optional


@dataclass
class EnvSetting:
    var: str
    default: Optional[str] = None
    required: bool = False

    @property
    def value(self) -> Optional[str]:
        variable_value = os.getenv(str(self.var), self.default)
        if variable_value is None and self.required:
            raise EnvironmentError(f"Environment variable {self.var} is not set")
        return variable_value
