# Running Backend in a Docker Container

```zsh
docker build -t backend -f backend/docker/backend.Dockerfile backend/src/chris_package
docker run -it -p 8000:8000 backend:latest

# Build with telemetry key
docker build -t backend -f backend/docker/backend.Dockerfile backend/src/chris_package --build-arg TELEMETRY_KEY=<key>
```
