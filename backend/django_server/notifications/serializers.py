from rest_framework.exceptions import NotFound
from rest_framework import serializers
from user_agents import parse
from django.db.models import Q
from users.serializers import UserSerializer
from .models import Notification
from users.models import User

class NotificationSerializer(serializers.ModelSerializer):

    id = serializers.UUIDField(read_only=True)
    id_user = serializers.CharField()
    title = serializers.CharField()
    message = serializers.CharField()

    class Meta:
        model = Notification
        fields = ['id', 'id_user', 'title', 'message']

    def create(self, validated_data):
        message = validated_data.get('message', None)
        title = validated_data.get('title', None)

        try:
            id_user = User.objects.get(username=validated_data.get('id_user', None))
        except User.DoesNotExist:
            raise NotFound("No se encuentra el usuario")

        notify = Notification.objects.create(id_user=id_user, message=message, title=title)

        return notify