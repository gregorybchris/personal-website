FROM python:3.11-slim

COPY . /app
WORKDIR /app

RUN pip install poetry
RUN poetry install --no-dev

EXPOSE 8000
CMD poetry run fastapi run chris/app/app.py