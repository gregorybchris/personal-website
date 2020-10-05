import flask
import json
import pathlib
import pkg_resources

from flask_cors import CORS

from cgme.web import settings
from cgme.web import logging_utilities


class App:
    DATA_DIR_PATH = pathlib.Path(__file__).parent.absolute() / '..' / 'data'
    POSTS_FILEPATH = DATA_DIR_PATH / 'posts.json'
    EVENTS_FILEPATH = DATA_DIR_PATH / 'events.json'

    def __init__(self, logger=None):
        self._logger = logger if logger is not None else logging_utilities.get_logger()

        self._app = flask.Flask(__name__)
        self._register_api_endpoints()
        CORS(self._app)
        # self._app.config['CORS_HEADERS'] = 'Content-Type'

    def _register_api_endpoints(self):
        self._app.route('/api/info', methods=['GET'])(self.api_get_info)
        self._app.route('/api/posts', methods=['GET'])(self.api_get_posts)
        self._app.route('/api/events', methods=['GET'])(self.api_get_events)

    @logging_utilities.log_context('get_info', context_tag='api')
    def api_get_info(self):
        response = {
            'author': 'Chris Gregory',
            'index': 'https://pypi.org/project/cgme/',
            'license': 'Apache Software License',
            'package': 'cgme',
            'source': 'https://github.com/gregorybchris/cgme',
            'version': pkg_resources.get_distribution("cgme").version
        }
        return flask.jsonify(response)

    @logging_utilities.log_context('get_posts', context_tag='api')
    def api_get_posts(self):
        with open(App.POSTS_FILEPATH, 'r') as f:
            posts = json.load(f)
        response = {
            'posts': posts
        }
        return flask.jsonify(response)

    @logging_utilities.log_context('get_events', context_tag='api')
    def api_get_events(self):
        with open(App.EVENTS_FILEPATH, 'r') as f:
            events = json.load(f)
        response = {
            'events': events
        }
        return flask.jsonify(response)

    @staticmethod
    def error(message, code):
        return (flask.jsonify(message=str(message)), code)

    def run(self):
        port = settings.FLASK_RUN_PORT
        debug = 1 if bool(settings.FLASK_DEBUG) else 0
        host = settings.FLASK_HOST
        self._app.run(port=port, debug=debug, host=host)
