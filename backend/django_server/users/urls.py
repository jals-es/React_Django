from django.conf.urls import include, url
from django.urls import path
from .views import (
    LoginAPIView, RegistrationAPIView
)

app_name = 'users'

urlpatterns = [
    path('', RegistrationAPIView.as_view()),
    path('login/', LoginAPIView.as_view())
]