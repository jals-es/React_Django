from django.conf.urls import include, url
from django.urls import path
from .views import (
    CreatePostAPIView
)

app_name = 'posts'

urlpatterns = [
    path('', CreatePostAPIView.as_view())
]