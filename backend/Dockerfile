FROM python:3.12-slim

COPY . /app
WORKDIR /app

RUN pip install poetry
RUN poetry install --only main

EXPOSE 8000
CMD poetry run fastapi run chris/app/app.py