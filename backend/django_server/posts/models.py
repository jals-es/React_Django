from email import message
import uuid
from django.db import models
from core.models import TimestampedModel

# Create your models here.
class Post(TimestampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    id_user = models.ForeignKey(
        'users.User', on_delete=models.CASCADE, related_name='posts'
    )
    message = models.TextField(max_length=280)
    agent = models.CharField(max_length=100)
    id_post_reply = models.ForeignKey(
        'Post', related_name='posts', on_delete=models.SET_NULL, null=True
    )

    def __str__(self):
        return self.id

class Like(TimestampedModel):
    id_post = models.ForeignKey(
        'posts.Post', on_delete=models.CASCADE, related_name='likes'
    )
    id_user = models.ForeignKey(
        'users.User', on_delete=models.CASCADE, related_name='likes'
    )

    class Meta:
        unique_together = (("id_post", "id_user"),)

class Repeat(TimestampedModel):
    id_post = models.ForeignKey(
        'posts.Post', on_delete=models.CASCADE, related_name='repeat'
    )
    id_user = models.ForeignKey(
        'users.User', on_delete=models.CASCADE, related_name='repeat'
    )

    class Meta:
        unique_together = (("id_post", "id_user"),)
