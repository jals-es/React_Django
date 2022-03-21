from django.conf.urls import include, url
from django.urls import path
from .views import (
    CreateLikeAPIView, CreatePostAPIView, PostAPIView, CreateRepeatAPIView, UserPostAPIView
)

app_name = 'posts'

urlpatterns = [
    path('', CreatePostAPIView.as_view()),
    path('all/', PostAPIView.as_view()),
    path('like/', CreateLikeAPIView.as_view()),
    path('repeat/', CreateRepeatAPIView.as_view()),
    path('user/', UserPostAPIView.as_view())
]