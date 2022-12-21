import pytest
from fastapi.testclient import TestClient

from chris.app.app import app


class TestApp:

    @pytest.fixture
    def test_client(self):
        return TestClient(app)

    def test_get_projects(self, test_client: TestClient):
        response = test_client.get("/projects")
        assert response.status_code == 200
        response_body = response.json()
        assert len(response_body) > 20
        assert "project_id" in response_body[0]
