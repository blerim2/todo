FROM python:3.10

WORKDIR /flask-app

COPY . /flask-app

RUN pip install -r requirements.txt

EXPOSE 5000

CMD ["python", "run.py"]