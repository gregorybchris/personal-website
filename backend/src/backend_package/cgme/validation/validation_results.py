from tabulate import tabulate
from cgme.validation.color_printing import print_rgb, Color


class ValidationResults:
    def __init__(self, n_items, item_type):
        self._n_items = n_items
        self._item_type = item_type
        self._errors = []
        self._completed = {}

    def add_error(self, message):
        self._errors.append(message)

    def add_completed(self, field, count=1):
        if field not in self._completed:
            self._completed[field] = 0
        self._completed[field] += count

    def print(self):
        print(f"Validated items of type: {self._item_type}")
        n_errors = len(self._errors)
        if n_errors == 0:
            print_rgb(f"Successfully validated {self._n_items} items", rgb=Color.GREEN)
            completed_counts = self._completed.values()
            completed_percents = [v / self._n_items for v in completed_counts]
            completed_table = {
                'Field': self._completed.keys(),
                'Percent Completed': completed_percents,
                'Number Completed': completed_counts,
            }
            print()
            print(tabulate(completed_table, headers='keys', tablefmt='github'))
        else:
            print_rgb(f"Found {n_errors} errors while validating:", rgb=Color.RED)
            for error in self._errors:
                print(f"- {error}")
        print()

    def has_errors(self):
        return len(self.errors) > 0

    def get_errors(self):
        return self.errors
