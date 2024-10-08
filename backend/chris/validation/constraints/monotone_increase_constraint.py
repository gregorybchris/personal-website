from typing import Any

from jsonvl import Constraint


class MonotoneIncreaseConstraint(Constraint):
    def constrain(self, constraint_name: str, data: Any, constraint_param: Any, path: Any) -> None:  # noqa: ARG002
        if len(data) < 2:  # noqa: PLR2004
            return

        if isinstance(constraint_param, list):
            pass
        elif isinstance(constraint_param, str):
            constraint_param = [constraint_param]
        else:
            raise TypeError("Invalid constraint argument")

        for query_path in constraint_param:
            xs = self.query(data, query_path)

            for i in range(1, len(xs)):
                if xs[i] < xs[i - 1]:
                    raise ValueError(f"Constraint {constraint_name} failed on elements {xs[i]}, {xs[i - 1]}")
