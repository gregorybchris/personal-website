from jsonvl import Constraint


class MonotoneIncreaseConstraint(Constraint):
    def constrain(self, constraint_name, data, query_paths, path):
        if len(data) < 2:
            return

        if isinstance(query_paths, list):
            pass
        elif isinstance(query_paths, str):
            query_paths = [query_paths]
        else:
            raise TypeError("Invalid consraint argument")

        for query_path in query_paths:
            xs = self.query(data, query_path)

            for i in range(1, len(xs)):
                if xs[i] < xs[i - 1]:
                    raise ValueError(f"Constraint {constraint_name} failed on elements {xs[i]}, {xs[i - 1]}")
