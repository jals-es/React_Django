from django.urls import path
from .views import (
    NotifyAPIView
)

app_name = 'notifications'

urlpatterns = [
    path('', NotifyAPIView.as_view()),
]