import semver

from chris import __version__


class TestVersion:
    def test_version(self) -> None:
        version = semver.VersionInfo.parse(__version__)
        assert version.major == 1
