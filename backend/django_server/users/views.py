from html5lib import serialize
from rest_framework.exceptions import NotFound
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, generics
from django.db.models import Q
from .models import User, Follow
from .serializers import (
    LoginSerializer, RegistrationSerializer, UserSerializer, FollowSerializer
)

# Create your views here.


class RegistrationAPIView(APIView):
    # queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegistrationSerializer
    def post(self, request):
        user = request.data.get('user', {})
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({"message": "Usuario registrado correctamente"}, status=status.HTTP_201_CREATED)

class LoginAPIView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request):
        user = request.data.get('user', {})
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

class CheckSessionAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get(self, request):
        serializer = self.serializer_class(request.user)
        serializer.getUser()
        
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserFollowAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = FollowSerializer

    def post(self, request):
        user_follow = request.user
        name_user_followed = request.data.get("username", None)

        try:
            user_followed = User.objects.get(username=name_user_followed)
        except User.DoesNotExist:
            raise NotFound("El usuario no existe")

        if Follow.objects.filter(Q(user_follow=user_follow) & Q(user_followed=user_followed)).exists():
            raise NotFound('Ya sigues a este usuario')

        serialize_data = {
            'user_follow': user_follow,
            'user_followed': user_followed
        }

        serializer = self.serializer_class(data={}, context=serialize_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({"message": "Usuario seguido"})

    def delete(self, request):
        user_follow = request.user
        name_user_followed = request.data.get("username", None)

        try:
            user_followed = User.objects.get(username=name_user_followed)
        except User.DoesNotExist:
            raise NotFound("El usuario no existe")

        try:
            follow = Follow.objects.get(Q(user_follow=user_follow) & Q(user_followed=user_followed))
        except Follow.DoesNotExist:
            raise NotFound("No sigues a este usuario")

        follow.delete()

        return Response({"message": "Has dejado de seguir al usuario"})