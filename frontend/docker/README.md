# Frontend Docker steps

```zsh
docker build -t frontend -f frontend/docker/frontend.Dockerfile frontend/app
docker run -it -p 3001:3000 frontend:latest
```
