import json

import pandas as pd

from pathlib import Path

from chris.datasets.datasets import Datasets
from chris.datasets.dataset_format import DatasetFormat
from chris.datasets.dataset_info import DatasetInfo

DATA_DIR = Path(__file__).parent.absolute() / "data"


def fetch_dataset(dataset_info: DatasetInfo) -> pd.DataFrame:
    dataset_path = DATA_DIR / dataset_info.filepath
    if dataset_info.dataset_format == DatasetFormat.JSON:
        with open(dataset_path, "r", encoding="utf-8") as f:
            data = json.load(f)
    elif dataset_info.dataset_format == DatasetFormat.CSV:
        data = pd.read_csv(dataset_path)
    return data


def fetch_projects() -> pd.DataFrame:
    return fetch_dataset(Datasets.PROJECTS)
