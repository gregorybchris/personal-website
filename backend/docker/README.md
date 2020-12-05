# Backend Docker steps

```zsh
docker build -t backend -f backend/docker/backend.Dockerfile backend/src/chris_package
docker run -it -p 8000:8000 backend:latest

# Build with args
docker build -t backend -f backend/docker/backend.Dockerfile backend/src/chris_package --build-arg TELEMETRY_KEY=<key> --build-arg DATABASE_CONN=<connection_string>
```
