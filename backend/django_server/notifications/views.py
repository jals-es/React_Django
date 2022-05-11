from rest_framework.exceptions import NotFound
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, generics
from .models import Notification
from users.models import User
from .serializers import (
    NotificationSerializer
)

# Create your views here.
class NotifyAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = NotificationSerializer
    def post(self, request):
    
        serializer_data = request.data.get('notification', {})

        serializer_context = {
            'user_send': request.user
        }

        serializer = self.serializer_class(data=serializer_data, context=serializer_context)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request):
        id_noti = request.data.get('id_notification', None)

        try:
            notify = Notification.objects.get(pk=id_noti)
        except Notification.DoesNotExist:
            raise NotFound('No se ha encontrado la notificacion')


        notify.delete()

        return Response({'message': 'Notificacion borrada'})
