import django
from django.db.models import F
from rest_framework.exceptions import NotFound
from email import message
from pyexpat import model
from paramiko import Agent
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
    # posts = PostSerializer(read_only=True)
    
    # class Meta:
    #     model = Post
    #     fields = ['posts']

    def get_all_posts(self):

        user = self.context

        try:
            posts = Post.objects.raw('''
            SELECT p1.id, p1.message, p1.agent, p1.id_post_reply_id, p1.first_name, p1.username, p1.avatar as photo, p1.created_at, p1.likes as nlikes, p1.repeats as nrepeats, (l1.id_like IS NOT NULL) AS you_like, (l1.id_repeat IS NOT NULL) AS you_repeat, p1.user_repeat
            FROM (
                SELECT p.id, p.message, p.agent, p.id_post_reply_id, u.first_name, u.username, u.avatar, p.created_at, l.likes, r.repeats, NULL as user_repeat
                FROM posts_post p, (
                    SELECT p.id as id, COUNT(l.id) as likes
                    FROM posts_post p LEFT JOIN posts_like l
                    ON l.id_post_id = p.id
                    GROUP BY p.id
                ) l, (
                    SELECT p.id as id, COUNT(r.id) as repeats
                    FROM posts_post p LEFT JOIN posts_repeat r
                    ON r.id_post_id = p.id
                    GROUP BY p.id
                ) r, users_user u
                WHERE p.id = l.id AND p.id = r.id AND p.id IN (
                    SELECT p2.id
                    FROM posts_post p2, users_follow f2
                    WHERE p2.id_user_id = f2.user_followed_id AND f2.user_follow_id = "{arg}"
                ) AND p.id_user_id = u.id
                UNION ALL
                SELECT p.id, p.message, p.agent, p.id_post_reply_id, u.first_name, u.username, u.avatar, u2.created_at, l.likes, r.repeats, u2.user_repeat as user_repeat
                FROM posts_post p, (
                    SELECT p.id as id, COUNT(l.id) as likes
                    FROM posts_post p LEFT JOIN posts_like l
                    ON l.id_post_id = p.id
                    GROUP BY p.id
                ) l, (
                    SELECT p.id as id, COUNT(r.id) as repeats
                    FROM posts_post p LEFT JOIN posts_repeat r
                    ON r.id_post_id = p.id
                    GROUP BY p.id
                ) r, (
                    SELECT r3.id_post_id, u.username as user_repeat, r3.created_at
                    FROM posts_repeat r3, users_follow f3, users_user u
                    WHERE r3.id_user_id = f3.user_followed_id AND f3.user_follow_id = "{arg}" AND r3.id_user_id = u.id
                ) u2, users_user u
                WHERE p.id = l.id AND p.id = r.id AND p.id = u2.id_post_id AND p.id_user_id = u.id
            ) p1 LEFT JOIN (
                SELECT l.id_post_id as id_post, l.id as id_like, r.id as id_repeat
                FROM posts_like l LEFT JOIN posts_repeat r
                ON l.id_post_id = r.id_post_id
                WHERE l.id_user_id = "{arg}"
                UNION
                SELECT r.id_post_id as id_post, l.id as id_like, r.id as id_repeat
                FROM posts_like l RIGHT JOIN posts_repeat r
                ON l.id_post_id = r.id_post_id
                WHERE r.id_user_id = "{arg}"
            ) l1
            ON p1.id = l1.id_post
            ORDER BY p1.created_at DESC
            LIMIT 30
            '''.format(arg=user.id.hex))
        except Post.DoesNotExist:
            raise NotFound("error posts")

        res = []
        for p in posts:
            res.append({
                'id': p.id,
                'message': p.message,
                'agent': p.agent,
                'id_post_reply': p.id_post_reply_id,
                'date': p.created_at,
                'user': {
                    'name': p.first_name,
                    'username': p.username,
                    'photo': p.photo
                },
                'data': {
                    'nlikes': p.nlikes,
                    'nrepeats': p.nrepeats,
                    'you_like': p.you_like,
                    'you_repeat': p.you_repeat,
                    'user_repeat': p.user_repeat
                }
            })

        return res

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