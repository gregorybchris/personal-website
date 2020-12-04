from pymongo import MongoClient

from chris.app import settings


class CollectionNames:
    SURVEYS = 'surveys'


class DatabaseCollection:
    def __init__(self, collection_name: str):
        self._collection_name = collection_name

        connection_string = settings.DATABASE_CONN_STRING.value
        self._client = MongoClient(connection_string)
        self._db = self._client[settings.DATABASE_NAME.value]
        self._dbc = self._db[collection_name]

    def find(self, document={}):
        return self._dbc.find(document)

    def find_one(self, document):
        return self._dbc.find_one(document)

    def insert_one(self, document):
        return self._dbc.insert_one(document)
