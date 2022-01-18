import uuid
import jwt
from django.conf import settings
from datetime import datetime, timedelta
from django.contrib.auth.models import (AbstractUser, BaseUserManager)
from django.db import models

class UserManager(BaseUserManager):

    def create_user(self, username, email, password, first_name):
        if username is None:
            raise TypeError('Users must have a username.')

        if email is None:
            raise TypeError('Users must have an email address.')

        if password is None:
            raise TypeError('Users must have a password.')

        if first_name is None:
            raise TypeError('Users must have a first name.')

        user = self.model(username=username, email=self.normalize_email(email), first_name=first_name)
        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, username, email, password):
        if username is None:
            raise TypeError('Users must have a username.')

        if email is None:
            raise TypeError('Users must have an email address.')

        if password is None:
            raise TypeError('Superusers must have a password.')

        user = self.create_user(username, email, password)
        user.is_superuser = True
        user.is_staff = True
        user.save()

        return user

# Create your models here.
class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=15, unique=True)
    email = models.EmailField(unique=True)
    descr = models.TextField()
    avatar = models.TextField()
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    # USERNAME_FIELD = 'username'

    objects = UserManager()

    def __str__(self):
        return self.username

    @property
    def token(self):
        return self._generate_jwt_token()

    def _generate_jwt_token(self):
        dt = datetime.now() + timedelta(days=7)
        
        token = jwt.encode({
            'id': str(self.pk),
            'exp': int(dt.strftime('%s'))
        }, settings.SECRET_KEY, algorithm='HS256')
        
        return token.decode('utf-8')