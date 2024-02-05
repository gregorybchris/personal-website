import re

import pytest

from chris.datasets.dataset_format import DatasetFormat


class TestDatasetFormat:
    @pytest.mark.parametrize("dataset_format", list(DatasetFormat))
    def test_dataset_format_formats(self, dataset_format: DatasetFormat) -> None:
        message = f'Invalid dataset format "{dataset_format}"'
        assert re.match(r"[a-z]{1,10}", dataset_format), message
