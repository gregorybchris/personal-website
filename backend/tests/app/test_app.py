import pytest
from chris.app.app import app
from fastapi.testclient import TestClient


@pytest.fixture(name="test_client")
def test_client_fixture() -> TestClient:
    return TestClient(app)


class TestApp:
    def test_get_projects(self, test_client: TestClient) -> None:
        response = test_client.get("/projects")
        assert response.status_code == 200
        response_body = response.json()
        assert len(response_body) > 20
        assert "project_id" in response_body[0]
