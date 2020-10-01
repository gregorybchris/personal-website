import os

# App Settings

FLASK_RUN_PORT = os.getenv('FLASK_RUN_PORT', 8000)
FLASK_DEBUG = os.getenv('FLASK_DEBUG', 1)
FLASK_HOST = os.getenv('FLASK_HOST', None)

# Logging Settings

LOG_FILE_NAME = os.getenv('CGME_LOG_FILE', 'cgme.log')