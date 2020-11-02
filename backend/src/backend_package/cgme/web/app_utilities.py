import flask
import json


def create_response(message, code):
    return (flask.jsonify(message=message), code)


def read_json(filepath):
    with open(filepath, 'r') as f:
        data = json.load(f)
    return data
