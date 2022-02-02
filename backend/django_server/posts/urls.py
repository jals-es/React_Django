from django.conf.urls import include, url
from django.urls import path
from .views import (
    CreatePostAPIView, CreateLikeAPIView
)

app_name = 'posts'

urlpatterns = [
    path('', CreatePostAPIView.as_view()),
    path('like/', CreateLikeAPIView.as_view())
]