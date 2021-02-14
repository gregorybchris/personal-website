import os
import pytest

from chris.app import settings


def get_settings():
    # Contains (setting variable name, environment variable name, variable default value)
    return [
        ('FLASK_RUN_PORT', settings.VAR_FLASK_RUN_PORT, settings.DEFAULT_FLASK_RUN_PORT),
        ('FLASK_DEBUG', settings.VAR_FLASK_DEBUG, settings.DEFAULT_FLASK_DEBUG),
        ('FLASK_HOST', settings.VAR_FLASK_HOST, settings.DEFAULT_FLASK_HOST),
        ('LOG_FILE_NAME', settings.VAR_LOG_FILE_NAME, settings.DEFAULT_LOG_FILE_NAME),
        ('INSTRUMENTATION_KEY', settings.VAR_INSTRUMENTATION_KEY, settings.DEFAULT_INSTRUMENTATION_KEY),
    ]


class TestSettings:

    def test_basic(self, monkeypatch):
        setting = settings.EnvSetting('TEST_VARIABLE')
        monkeypatch.setenv('TEST_VARIABLE', 'value')
        assert setting.value == 'value'

    def test_default(self, monkeypatch):
        setting = settings.EnvSetting('TEST_VARIABLE', default='value')
        monkeypatch.delenv('TEST_VARIABLE', raising=False)
        assert setting.value == 'value'

    def test_required(self, monkeypatch):
        setting = settings.EnvSetting('TEST_VARIABLE', required=True)
        monkeypatch.delenv('TEST_VARIABLE', raising=False)
        with pytest.raises(OSError, match="Environment variable TEST_VARIABLE is not set"):
            setting.value

    @pytest.mark.parametrize('setting_name_pair', [
        (settings.FLASK_RUN_PORT, 'FLASK_RUN_PORT'),
        (settings.FLASK_DEBUG, 'FLASK_DEBUG'),
        (settings.FLASK_HOST, 'FLASK_HOST'),
        (settings.LOG_FILE_NAME, 'CGME_LOG_FILE'),
        (settings.INSTRUMENTATION_KEY, 'CGME_TELEMETRY_KEY'),
        (settings.DATABASE_CONN_STRING, 'CGME_DATABASE_CONN'),
        (settings.DATABASE_NAME, 'CGME_DATABASE_NAME'),
    ])
    def test_vars(self, setting_name_pair):
        setting, setting_name = setting_name_pair
        assert setting.var == setting_name
