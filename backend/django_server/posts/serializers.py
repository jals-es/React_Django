from django.db.models import F
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from user_agents import parse

from users.serializers import UserSerializer
from .models import Post, Like
from users.models import User

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

class AllPostSerializer(serializers.ModelSerializer):
    posts = PostSerializer()
    
    class Meta:
        model = Post
        fields = ['posts']

    def get_all_posts(self):

        user = self.context

        try:
            posts = list(Post.objects.filter(id_user=user)
            .order_by('-created_at')
            .values('id', 'message', 'agent', id_reply=F('id_post_reply_id'), user=F('id_user_id'), date=F('created_at')))
        except Post.DoesNotExist:
            posts = list(Post.objects.all().order_by('-created_at'))

        return posts

class LikeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    post = PostSerializer(read_only=True)
    class Meta:
        model = Like
        fields = ['user', 'post']

    def create(self, validate_data):
        user = self.context.get('user', None)
        post = self.context.get('post', None)

        print(post.message)

        like = Like.objects.create(id_post=post, id_user=user)
        
        return like