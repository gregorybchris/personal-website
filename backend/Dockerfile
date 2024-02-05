FROM python:3.11-slim

COPY . /app
WORKDIR /app

RUN pip install poetry
RUN poetry install --no-dev

EXPOSE 8000
CMD poetry run uvicorn chris.app.app:app --host 0.0.0.0 --port 8000