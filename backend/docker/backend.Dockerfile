FROM continuumio/miniconda3


COPY requirements.txt /app/requirements.txt
COPY . /app

WORKDIR /app
RUN pip install -e .

ENV FLASK_HOST="0.0.0.0"
EXPOSE 8000

ENTRYPOINT [ "cgme", "app" ]
