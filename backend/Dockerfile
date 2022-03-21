FROM python:3.8.10
WORKDIR /backend
COPY django_server/ django_server/
WORKDIR /backend/django_server
RUN ls -l
RUN pip3 install -r requirements.txt
EXPOSE 8000