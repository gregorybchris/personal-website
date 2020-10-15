# Running Backend in a Docker Container

```zsh
docker build -t backend -f backend/docker/backend.Dockerfile backend/src/backend_package
docker run -it -p 8000:8000 backend:latest
```