from dataclasses import dataclass

from chris.datasets.dataset_format import DatasetFormat


@dataclass
class DatasetInfo:
    name: str
    filepath: str
    dataset_format: DatasetFormat = DatasetFormat.JSON

    def __str__(self) -> str:
        return f'Dataset(name="{self.name}")'
