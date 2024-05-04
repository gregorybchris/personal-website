import json
from pathlib import Path

import pandas as pd
from pandas import DataFrame

from chris.datasets.dataset_format import DatasetFormat
from chris.datasets.dataset_info import DatasetInfo
from chris.datasets.datasets import Datasets

DATA_DIR = Path(__file__).parent.absolute() / "data"


def fetch_dataset(dataset_info: DatasetInfo) -> DataFrame:
    dataset_path = DATA_DIR / dataset_info.filepath

    if dataset_info.dataset_format == DatasetFormat.JSON:
        with open(dataset_path, "r", encoding="utf-8") as f:
            return json.load(f)

    if dataset_info.dataset_format == DatasetFormat.CSV:
        return pd.read_csv(dataset_path)

    raise ValueError(f"Unsupported dataset format: {dataset_info.dataset_format}")


def fetch_projects() -> DataFrame:
    return fetch_dataset(Datasets.PROJECTS)
