from django.db import models
from core.models import TimestampedModel
import uuid

# Create your models here.
class Notification(TimestampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    id_user = models.ForeignKey(
        'users.User', on_delete=models.CASCADE, related_name='notifications'
    )
    title = models.TextField()
    message = models.TextField()

    def __str__(self):
        return self.id