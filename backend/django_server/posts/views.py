from rest_framework.exceptions import NotFound
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, generics
from django.db.models import Q
from .models import Like, Post
from .serializers import (
    PostSerializer, LikeSerializer, AllPostSerializer
)

# Create your views here.
class CreatePostAPIView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = PostSerializer
    def create(self, request):
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

class CreateLikeAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = LikeSerializer

    def post(self, request):
        id_post = request.data.get('id_post', None)

        try:
            post = Post.objects.get(pk=id_post)
        except Post.DoesNotExist:
            raise NotFound('No se ha encontrado el post')


        if Like.objects.filter(Q(id_user=request.user) & Q(id_post=post)).exists():
            raise NotFound('El like ya existe')
            

        serializer_context = {
            'user': request.user,
            'post': post
        }

        serializer = self.serializer_class(data={}, context=serializer_context)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({'message': 'Like guardado'})
    
    def delete(self, request):
        id_post = request.data.get('id_post', None)

        try:
            post = Post.objects.get(pk=id_post)
        except Post.DoesNotExist:
            raise NotFound('No se ha encontrado el post')

        try:
            like = Like.objects.get(Q(id_user=request.user) & Q(id_post=post))
        except Like.DoesNotExist:
            raise NotFound('El like no existe')

        like.delete()

        return Response({'message': 'Like borrado'})
    
class PostAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = AllPostSerializer

    def get(self, request):

        serializer = self.serializer_class(context=request.user)

        return Response(serializer.get_all_posts())