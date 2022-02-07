from asyncore import write
from urllib import response
from rest_framework.exceptions import NotFound
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import Follow, User
from django.contrib.auth.password_validation import validate_password
from uuid import UUID

class RegistrationSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        required=True,
        max_length=128,
        min_length=8,
        write_only=True
    )
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    username = serializers.CharField( 
        required=True,
        max_length=15,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    first_name = serializers.CharField(
        required=True,
        max_length=50,
    )

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'first_name']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255, read_only=True)
    descr = serializers.CharField(max_length=255, read_only=True)
    photo = serializers.CharField(max_length=255, read_only=True)
    username = serializers.CharField(max_length=255)
    password = serializers.CharField(max_length=128, write_only=True)
    token = serializers.CharField(max_length=255, read_only=True)

    def validate(self, data):
        username = data.get('username', None)
        password = data.get('password', None)

        if username is None:
            raise serializers.ValidationError(
                'An username or email address is required to log in.'
            )

        if password is None:
            raise serializers.ValidationError(
                'A password is required to log in.'
            )

        user = authenticate(username=username, password=password)
        
        if user is None:
            user = authenticate(email=username, password=password)
            if user is None:
                raise serializers.ValidationError(
                    'A user with this username and password was not found.'
                )

        if not user.is_active:
            raise serializers.ValidationError(
                'This user has been deactivated.'
            )

        return {
            'username': user.username,
            'name': user.first_name,
            'descr': user.descr,
            'photo': user.avatar,
            'token': user.token
        }

class UserSerializer(serializers.ModelSerializer):

    first_name = serializers.CharField()
    username = serializers.CharField()
    descr = serializers.CharField()
    avatar = serializers.CharField()
    
    class Meta:
        model = User
        fields = (
            'first_name', 'username', 'descr', 'avatar',
        )

    def getUser(self): 
        return {
            "name": self.data['first_name'],
            "username": self.data['username'],
            "descr": self.data['descr'],
            "photo": self.data['avatar'] 
        }
class AllUsersSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['user']

    def getSuggestedUsers(self, data):

        try:
            users = User.objects.raw('''
            SELECT *
            FROM users_user 
            WHERE id NOT IN ( 
                SELECT user_followed_id 
                FROM users_follow 
                WHERE user_follow_id = '{arg}' 
            ) AND id != '{arg}' AND is_superuser = 0 
            ORDER BY RAND () 
            LIMIT 5  
            '''.format(arg=data.id.hex))
        except User.DoesNotExist:
            raise NotFound("No hay sugeridos")

        res = []
        for u in users:
            res.append({
                'name': u.first_name,
                'username': u.username,
                'photo': u.avatar
            })

        return res
class FollowSerializer(serializers.ModelSerializer):

    user_followed = UserSerializer(read_only=True)
    user_follow = UserSerializer(read_only=True)

    class Meta:
        model = Follow
        fields = ['user_followed', 'user_follow']

    def create(self, validated_data):
        user_followed=self.context.get("user_followed", None)
        user_follow=self.context.get("user_follow", None)
        
        follow = Follow.objects.create(user_followed=user_followed, user_follow=user_follow)

        return True