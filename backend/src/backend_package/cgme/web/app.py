import flask
import json
import pathlib
import pkg_resources

import pandas as pd

from flask_cors import CORS

from cgme.web import settings
from cgme.web import logging_utilities


logging_utilities.initialize_logger()
logger = logging_utilities.logger


class App:
    DATA_PATH = pathlib.Path(__file__).parent.absolute() / '..' / 'data'

    # Postings
    POSTS_DATA = DATA_PATH / 'posts.json'
    PROJECTS_DATA = DATA_PATH / 'projects.json'
    PODCAST_EPISODES_DATA = DATA_PATH / 'podcast-episodes.json'

    # Outdoor
    OUTDOOR_DIR = DATA_PATH / 'outdoor'
    CYCLING_ROUTES_DATA = OUTDOOR_DIR / 'cycling-routes.json'
    HIKING_ROUTES_DATA = OUTDOOR_DIR / 'hiking-routes.json'
    RUNNING_ROUTES_DATA = OUTDOOR_DIR / 'running-routes.json'

    # Media
    MEDIA_DIR = DATA_PATH / 'media'
    MOVIES_DATA = MEDIA_DIR / 'movies.csv'
    PODCASTS_DATA = MEDIA_DIR / 'podcasts.csv'
    TV_SHOWS_DATA = MEDIA_DIR / 'tv-shows.csv'
    YOUTUBE_CHANNELS_DATA = MEDIA_DIR / 'youtube-channels.csv'

    # Professional
    PROFESSIONAL_DIR = DATA_PATH / 'professional'

    def __init__(self):
        self._app = flask.Flask(__name__)
        self._register_api_endpoints()
        CORS(self._app)

    def _register_api_endpoints(self):
        self._app.route('/', methods=['GET'])(self.api_get_info)

        self._app.route('/api/v1/media', methods=['GET'])(self.api_get_media_v1)
        self._app.route('/api/v1/media/movies', methods=['GET'])(self.api_get_media_movies_v1)
        self._app.route('/api/v1/media/tv', methods=['GET'])(self.api_get_media_tv_v1)
        self._app.route('/api/v1/media/podcasts', methods=['GET'])(self.api_get_media_podcasts_v1)
        self._app.route('/api/v1/media/youtube', methods=['GET'])(self.api_get_media_youtube_v1)

        self._app.route('/api/v1/outdoor', methods=['GET'])(self.api_get_outdoor_v1)
        self._app.route('/api/v1/outdoor/cycling', methods=['GET'])(self.api_get_outdoor_cycling_v1)
        self._app.route('/api/v1/outdoor/hiking', methods=['GET'])(self.api_get_outdoor_hiking_v1)
        self._app.route('/api/v1/outdoor/running', methods=['GET'])(self.api_get_outdoor_running_v1)

        self._app.route('/api/v1/posts', methods=['GET'])(self.api_get_posts_v1)

        self._app.route('/api/v1/projects', methods=['GET'])(self.api_get_projects_v1)
        self._app.route('/api/v1/projects/download/<project_id>', methods=['POST'])(self.api_post_projects_download_v1)

    def _list_endpoints(self):
        links = set()
        for rule in self._app.url_map.iter_rules():
            arguments = {argument: f"ARGL{argument}ARGR" for argument in rule.arguments}
            raw_url = flask.url_for(rule.endpoint, **arguments)
            formatted_url = raw_url.replace('ARGL', '<').replace('ARGR', '>')
            links.add(formatted_url)
        return list(links)

    @logging_utilities.log_context('get_info', tag='api')
    def api_get_info(self):
        return flask.jsonify({
            'source': 'https://github.com/gregorybchris/personal-website',
            'routes': sorted(self._list_endpoints()),
            'version': pkg_resources.get_distribution('cgme').version,
        })

    @logging_utilities.log_context('get_posts', tag='api')
    def api_get_posts_v1(self):
        return flask.jsonify({
            'posts': App.read_json(App.POSTS_DATA)
        })

    @logging_utilities.log_context('get_projects', tag='api')
    def api_get_projects_v1(self):
        return flask.jsonify({
            'projects': App.read_json(App.PROJECTS_DATA)
        })

    @logging_utilities.log_context('post_projects_download', tag='api')
    def api_post_projects_download_v1(self, project_id):
        projects = App.read_json(App.PROJECTS_DATA)
        for project in projects:
            if project['project_id'] == project_id:
                project_name = project['name']
                logger.info(f"Project \"{project_name}\" ({project_id}) downloaded")

                return flask.jsonify({
                    'success': True,
                    'message': f"Successfully downloaded project {project_name}"
                })
        return flask.jsonify({
            'success': False,
            'message': f"Project with ID {project_id} not found"
        })

    @logging_utilities.log_context('get_media', tag='api')
    def api_get_media_v1(self):
        movies_df = pd.read_csv(App.MOVIES_DATA)
        podcasts_df = pd.read_csv(App.PODCASTS_DATA)
        tv_shows_df = pd.read_csv(App.TV_SHOWS_DATA)
        youtube_channels_df = pd.read_csv(App.YOUTUBE_CHANNELS_DATA)
        return flask.jsonify({
            'movies': list(movies_df.T.to_dict().values()),
            'podcasts': list(podcasts_df.T.to_dict().values()),
            'tv': list(tv_shows_df.T.to_dict().values()),
            'youtube': list(youtube_channels_df.T.to_dict().values()),
        })

    @logging_utilities.log_context('get_media_movies', tag='api')
    def api_get_media_movies_v1(self):
        movies_df = pd.read_csv(App.MOVIES_DATA)
        return flask.jsonify(list(movies_df.T.to_dict().values()))

    @logging_utilities.log_context('get_media_podcasts', tag='api')
    def api_get_media_podcasts_v1(self):
        podcasts_df = pd.read_csv(App.PODCASTS_DATA)
        return flask.jsonify(list(podcasts_df.T.to_dict().values()))

    @logging_utilities.log_context('get_media_tv', tag='api')
    def api_get_media_tv_v1(self):
        tv_df = pd.read_csv(App.TV_SHOWS_DATA)
        return flask.jsonify(list(tv_df.T.to_dict().values()))

    @logging_utilities.log_context('get_media_youtube', tag='api')
    def api_get_media_youtube_v1(self):
        youtube_df = pd.read_csv(App.YOUTUBE_CHANNELS_DATA)
        return flask.jsonify(list(youtube_df.T.to_dict().values()))

    @logging_utilities.log_context('get_outdoor', tag='api')
    def api_get_outdoor_v1(self):
        return flask.jsonify({
            'cycling': App.read_json(App.CYCLING_ROUTES_DATA),
            'hiking': App.read_json(App.HIKING_ROUTES_DATA),
            'running': App.read_json(App.RUNNING_ROUTES_DATA),
        })

    @logging_utilities.log_context('get_outdoor_cycling', tag='api')
    def api_get_outdoor_cycling_v1(self):
        return flask.jsonify(App.read_json(App.CYCLING_ROUTES_DATA))

    @logging_utilities.log_context('get_outdoor_hiking', tag='api')
    def api_get_outdoor_hiking_v1(self):
        return flask.jsonify(App.read_json(App.HIKING_ROUTES_DATA))

    @logging_utilities.log_context('get_outdoor_running', tag='api')
    def api_get_outdoor_running_v1(self):
        return flask.jsonify(App.read_json(App.RUNNING_ROUTES_DATA))

    @staticmethod
    def read_json(filepath):
        with open(filepath, 'r') as f:
            data = json.load(f)
        return data

    @staticmethod
    def error(message, code):
        return (flask.jsonify(message=str(message)), code)

    def run(self):
        port = settings.FLASK_RUN_PORT
        debug = 1 if bool(settings.FLASK_DEBUG) else 0
        host = settings.FLASK_HOST
        self._app.run(port=port, debug=debug, host=host)
