FROM continuumio/miniconda3

ARG TELEMETRY_KEY
ENV CGME_TELEMETRY_KEY $TELEMETRY_KEY
ARG DATABASE_CONN
ENV CGME_DATABASE_CONN $DATABASE_CONN

# gcc is required for psutil via opencensus
RUN apt-get update && \
  apt-get -y install gcc

COPY requirements.txt /app/requirements.txt
COPY . /app

WORKDIR /app
RUN pip install -e .

ENV FLASK_HOST="0.0.0.0"
EXPOSE 8000

ENTRYPOINT [ "cgme", "app" ]
