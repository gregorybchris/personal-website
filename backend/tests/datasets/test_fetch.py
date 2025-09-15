from typing import List, Optional, Union

import pytest
from pandas import DataFrame

from chris.datasets.dataset_format import DatasetFormat
from chris.datasets.dataset_info import DatasetInfo
from chris.datasets.datasets import Datasets
from chris.datasets.fetch import fetch_dataset_json
from tests.utilities import get_public_class_members


class TestFetch:
    @pytest.mark.parametrize("dataset_info", get_public_class_members(Datasets))
    def test_fetch_all(self, dataset_info: DatasetInfo) -> None:
        dataset = fetch_dataset_json(dataset_info)
        self.validate_data(dataset, dataset_info)

    def validate_data(
        self,
        dataset: Union[List[DatasetInfo], DataFrame],
        dataset_info: Optional[DatasetInfo],
    ) -> None:
        if dataset_info is None:
            assert dataset is not None
        elif dataset_info.dataset_format == DatasetFormat.JSON:
            assert isinstance(dataset, list)
        elif dataset_info.dataset_format == DatasetFormat.CSV:
            assert isinstance(dataset, DataFrame)
