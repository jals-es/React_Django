from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, generics
from .models import User
from .serializers import (
    LoginSerializer, RegistrationSerializer, UserSerializer
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
        # user = {
        #     "name": request.user.first_name,
        #     "username": request.user.username,
        #     "descr": request.user.descr,
        #     "photo": request.user.avatar 
        # }
        return Response(serializer.data, status=status.HTTP_200_OK)