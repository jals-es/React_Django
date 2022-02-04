from django.conf.urls import include, url
from django.urls import path
from .views import (
    LoginAPIView, RegistrationAPIView, CheckSessionAPIView, UserFollowAPIView, UserSuggestAPIView
)

app_name = 'users'

urlpatterns = [
    path('', RegistrationAPIView.as_view()),
    path('login/', LoginAPIView.as_view()),
    path('check/', CheckSessionAPIView.as_view()),
    path('follow/', UserFollowAPIView.as_view()),
    path('suggest/', UserSuggestAPIView.as_view())
]