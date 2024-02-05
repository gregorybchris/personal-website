from chris.datasets.dataset_format import DatasetFormat
from chris.datasets.dataset_info import DatasetInfo


class TestDatasetInfo:
    def test_get_dataset_info_attributes(self) -> None:
        name = "Dataset Name"
        filepath = "folder/dataset-path.csv"
        dataset_format = DatasetFormat.CSV

        info = DatasetInfo(name, filepath, dataset_format)

        assert info.name == name
        assert info.filepath == filepath
        assert info.dataset_format == dataset_format
