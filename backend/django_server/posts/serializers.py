from email import message
from paramiko import Agent
from rest_framework import serializers
from user_agents import parse

from users.serializers import UserSerializer
from .models import Post

class PostSerializer(serializers.ModelSerializer):

    id = serializers.UUIDField(read_only=True)
    message = serializers.CharField(max_length=280)
    id_user = UserSerializer(read_only=True)
    agent = serializers.CharField(read_only=True)
    id_post_reply = serializers.UUIDField(required=False)

    class Meta:
        model = Post
        fields = ['id', 'id_user', 'message', 'agent', 'id_post_reply']

    def create(self, validated_data):
        message = validated_data.get('message', None)
        id_user = validated_data.get('id_user', None)
        agent = parse(validated_data.get('agent', None))
        id_post_reply = validated_data.get('id_post_reply', None)

        post = Post.objects.create(id_user=id_user, message=message, agent=agent.os.family, id_post_reply=id_post_reply)

        return post

    def validate(self, data):
        message = data.get("message", None)
        id_user = self.context.get("id_user", None)
        agent = self.context.get("agent", None)
        id_post_reply = data.get("id_post_reply", None)
        
        return {
            'message': message,
            'id_user': id_user,
            'agent': agent,
            'id_post_reply': id_post_reply 
        }