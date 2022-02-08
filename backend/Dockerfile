FROM python:3.8.10
WORKDIR /backend
COPY django_server/* ./
RUN pip3 install -r requirements.txt
RUN python3 manage.py migrate
EXPOSE 8000
CMD [ "python3 manage.py runserver" ]