from chris.datasets.dataset_info import DatasetInfo
from chris.datasets.dataset_format import DatasetFormat


class TestDatasetInfo:

    def test_get_dataset_info_attributes(self) -> None:
        name = "Dataset Name"
        data_path = "folder/dataset-path.csv"
        data_format = DatasetFormat.CSV
        description = "Test dataset."

        info = DatasetInfo(name, data_path, data_format, description)

        assert info.name == name
        assert info.data_path == data_path
        assert info.data_format == data_format
        assert info.description == description
