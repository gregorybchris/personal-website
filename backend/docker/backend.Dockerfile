FROM continuumio/miniconda3


COPY requirements.txt /app/requirements.txt
COPY . /app

WORKDIR /app
RUN pip install -e .

CMD [ "cgme" ]

# ENTRYPOINT [ "python" ]
# CMD [ "app.py" ]

# RUN conda env create -f environment.yml
