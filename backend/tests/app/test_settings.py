import pytest
from pytest import MonkeyPatch

from chris.app.env_setting import EnvSetting


class TestSettings:
    def test_basic(self, monkeypatch: MonkeyPatch) -> None:
        setting = EnvSetting("TEST_VARIABLE")
        monkeypatch.setenv("TEST_VARIABLE", "value")
        assert setting.value == "value"

    def test_default(self, monkeypatch: MonkeyPatch) -> None:
        setting = EnvSetting("TEST_VARIABLE", default="value")
        monkeypatch.delenv("TEST_VARIABLE", raising=False)
        assert setting.value == "value"

    def test_required(self, monkeypatch: MonkeyPatch) -> None:
        setting = EnvSetting("TEST_VARIABLE", required=True)
        monkeypatch.delenv("TEST_VARIABLE", raising=False)
        with pytest.raises(OSError, match="Environment variable TEST_VARIABLE is not set"):
            # pylint: disable=pointless-statement
            setting.value
