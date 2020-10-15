import json
import pathlib

from cgme.validation.item import Item


class Validator:
    DATA_DIR_PATH = pathlib.Path(__file__).parent.absolute() / '..' / 'data'

    def load_items(cls, data_filename):
        data_filepath = cls.DATA_DIR_PATH / data_filename
        with open(data_filepath, 'r') as f:
            item_records = json.load(f)
        return [Item.from_record(record) for record in item_records]
