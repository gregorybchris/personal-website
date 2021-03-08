"""Utilities for MongoDB operations."""
from pymongo import MongoClient

from chris.app import settings


class CollectionNames:
    """Names of MongoDB collections."""

    SURVEYS = 'surveys'


class DatabaseCollection:
    """Wrapper for MongoDB collection operations."""

    def __init__(self, collection_name: str):
        """Construct a DatabaseCollection."""
        self._collection_name = collection_name

        connection_string = settings.DATABASE_CONN_STRING.value
        self._client = MongoClient(connection_string)
        self._db = self._client[settings.DATABASE_NAME.value]
        self._dbc = self._db[collection_name]

    def find(self, document={}):
        """Find documents in the MongoDB collection."""
        return self._dbc.find(document)

    def find_one(self, document):
        """Find one document in the MongoDB collection."""
        return self._dbc.find_one(document)

    def insert_one(self, document):
        """Insert one document into the MongoDB collection."""
        return self._dbc.insert_one(document)
