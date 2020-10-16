import flask
import json
import pathlib
import pkg_resources

import pandas as pd

from flask_cors import CORS

from cgme.web import settings
from cgme.web import logging_utilities


class App:
    DATA_DIR_PATH = pathlib.Path(__file__).parent.absolute() / '..' / 'data'
    POST_DATA_FILEPATH = DATA_DIR_PATH / 'posts.json'
    PROJECT_DATA_FILEPATH = DATA_DIR_PATH / 'projects.json'
    ENTERTAINMENT_MEDIA_DATA_FILEPATH = DATA_DIR_PATH / 'entertainment-media.csv'
    INFORMATIONAL_MEDIA_DATA_FILEPATH = DATA_DIR_PATH / 'informational-media.csv'
    HIKE_DATA_FILEPATH = DATA_DIR_PATH / 'hikes.json'

    def __init__(self, logger=None):
        self._logger = logger if logger is not None else logging_utilities.get_logger()

        self._app = flask.Flask(__name__)
        self._register_api_endpoints()
        CORS(self._app)
        # self._app.config['CORS_HEADERS'] = 'Content-Type'

    def _register_api_endpoints(self):
        self._app.route('/api/v1/info', methods=['GET'])(self.api_get_info_v1)
        self._app.route('/api/v1/posts', methods=['GET'])(self.api_get_posts_v1)
        self._app.route('/api/v1/projects', methods=['GET'])(self.api_get_projects_v1)
        self._app.route('/api/v1/media', methods=['GET'])(self.api_get_media_v1)
        self._app.route('/api/v1/hikes', methods=['GET'])(self.api_get_hikes_v1)

    def _list_endpoints(self):
        links = []
        for rule in self._app.url_map.iter_rules():
            arguments = {argument: f"ARGL{argument}ARGR" for argument in rule.arguments}
            raw_url = flask.url_for(rule.endpoint, **arguments)
            formatted_url = raw_url.replace('ARGL', '<').replace('ARGR', '>')
            links.append(formatted_url)
        return links

    @logging_utilities.log_context('get_info', context_tag='api')
    def api_get_info_v1(self):
        return flask.jsonify({
            'source': 'https://github.com/gregorybchris/personal-website',
            'routes': self._list_endpoints(),
            'version': pkg_resources.get_distribution('cgme').version,
        })

    @logging_utilities.log_context('get_posts', context_tag='api')
    def api_get_posts_v1(self):
        with open(App.POST_DATA_FILEPATH, 'r') as f:
            posts = json.load(f)
        return flask.jsonify({
            'posts': posts
        })

    @logging_utilities.log_context('get_projects', context_tag='api')
    def api_get_projects_v1(self):
        with open(App.PROJECT_DATA_FILEPATH, 'r') as f:
            projects = json.load(f)
        return flask.jsonify({
            'projects': projects
        })

    @logging_utilities.log_context('get_media', context_tag='api')
    def api_get_media_v1(self):
        entertainment_df = pd.read_csv(App.ENTERTAINMENT_MEDIA_DATA_FILEPATH)
        informational_df = pd.read_csv(App.INFORMATIONAL_MEDIA_DATA_FILEPATH)
        return flask.jsonify({
            'entertainment': list(entertainment_df.T.to_dict().values()),
            'informational': list(informational_df.T.to_dict().values()),
        })

    @logging_utilities.log_context('get_hikes', context_tag='api')
    def api_get_hikes_v1(self):
        with open(App.HIKE_DATA_FILEPATH, 'r') as f:
            hikes = json.load(f)
        return flask.jsonify({
            'hikes': hikes
        })

    @staticmethod
    def error(message, code):
        return (flask.jsonify(message=str(message)), code)

    def run(self):
        port = settings.FLASK_RUN_PORT
        debug = 1 if bool(settings.FLASK_DEBUG) else 0
        host = settings.FLASK_HOST
        self._app.run(port=port, debug=debug, host=host)
