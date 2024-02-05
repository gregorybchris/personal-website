from typing import Optional, Union, List
import pytest

from pandas import DataFrame

from tests.utilities import get_public_class_members

from chris.datasets import fetch_projects
from chris.datasets.datasets import Datasets
from chris.datasets.dataset_info import DatasetInfo
from chris.datasets.dataset_format import DatasetFormat
from chris.datasets.fetch import fetch_dataset


class TestFetch:
    @pytest.mark.parametrize("dataset_info", get_public_class_members(Datasets))
    def test_fetch_all(self, dataset_info: DatasetInfo) -> None:
        dataset = fetch_dataset(dataset_info)
        self.validate_data(dataset, dataset_info)

    def validate_data(
        self,
        dataset: Union[List[DatasetInfo], DataFrame],
        dataset_info: Optional[DatasetInfo],
    ) -> None:
        if dataset_info is None:
            assert dataset is not None
        else:
            if dataset_info.dataset_format == DatasetFormat.JSON:
                assert isinstance(dataset, list)
            elif dataset_info.dataset_format == DatasetFormat.CSV:
                assert isinstance(dataset, DataFrame)

    def test_fetch_projects(self) -> None:
        data = fetch_projects()
        self.validate_data(data, None)
