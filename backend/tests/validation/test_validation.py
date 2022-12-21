from chris.validation.validate import validate_posts
from chris.validation.validate import validate_projects


class TestValidation:

    def test_validation(self):
        validate_posts()
        validate_projects()
