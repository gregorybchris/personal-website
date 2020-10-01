import flask
import json
import os
import pkg_resources

from cgme.web import settings
from cgme.web import logging_utilities
from cgme.web.codes import HTTPCodes


class App:
    def __init__(self, logger=None):
        self._logger = logger if logger is not None else logging_utilities.get_logger()

        self._app = flask.Flask(__name__)
        self._register_api_endpoints()

    def _register_api_endpoints(self):
        self._app.route('/api/info', methods=['GET'])(self.api_get_info)
        self._app.route('/api/data', methods=['GET'])(self.api_get_data)

    @logging_utilities.log_context('get_info', context_tag='api')
    def api_get_info(self):
        info = {
            'author': 'Chris Gregory',
            'index': 'https://pypi.org/project/cgme/',
            'license': 'Apache Software License',
            'package': 'cgme',
            'source': 'https://github.com/gregorybchris/cgme',
            'version': pkg_resources.get_distribution("cgme").version
        }
        return flask.jsonify(info)

    @logging_utilities.log_context('get_data', context_tag='api')
    def api_get_data(self):
        data = {
            'my_data': ':)'
        }
        return flask.jsonify(data)

    @staticmethod
    def error(message, code):
        return (flask.jsonify(message=str(message)), code)

    def run(self):
        port = settings.FLASK_RUN_PORT
        debug = 1 if bool(settings.FLASK_DEBUG) else 0
        host = settings.FLASK_HOST
        self._app.run(port=port, debug=debug, host=host)
