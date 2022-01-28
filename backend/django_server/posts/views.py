from multiprocessing import context
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, generics
from .models import Post
from .serializers import (
    PostSerializer
)

# Create your views here.
class CreatePostAPIView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = PostSerializer
    def create(self, request):
        print(request.user.id)
        serializer_context = {
            'id_user': request.user,
            'request': request,
            'agent': request.META['HTTP_USER_AGENT']
        }

        serializer_data = request.data.get('post', {})
        serializer = self.serializer_class(data=serializer_data, context=serializer_context)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)