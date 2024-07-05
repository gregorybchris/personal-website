import json
from pathlib import Path
from typing import Any

import pandas as pd
from pandas import DataFrame

from chris.datasets.dataset_format import DatasetFormat
from chris.datasets.dataset_info import DatasetInfo

DATA_DIR = Path(__file__).parent.absolute() / "data"


def fetch_dataset_json(dataset_info: DatasetInfo) -> Any:
    if dataset_info.dataset_format != DatasetFormat.JSON:
        raise ValueError(f"Unsupported dataset format: {dataset_info.dataset_format}")

    dataset_path = DATA_DIR / dataset_info.filepath
    with open(dataset_path, "r", encoding="utf-8") as f:
        return json.load(f)


def fetch_dataset_dataframe(dataset_info: DatasetInfo) -> DataFrame:
    if dataset_info.dataset_format != DatasetFormat.CSV:
        raise ValueError(f"Unsupported dataset format: {dataset_info.dataset_format}")

    dataset_path = DATA_DIR / dataset_info.filepath
    return pd.read_csv(dataset_path)
