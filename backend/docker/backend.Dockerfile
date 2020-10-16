FROM continuumio/miniconda3

ARG TELEMETRY_KEY
ENV INSTRUMENTATION_KEY $TELEMETRY_KEY

RUN apt-get update && \
    apt-get -y install gcc

COPY requirements.txt /app/requirements.txt
COPY . /app

WORKDIR /app
RUN pip install -e .

ENV FLASK_HOST="0.0.0.0"
EXPOSE 8000

ENTRYPOINT [ "cgme", "app" ]
