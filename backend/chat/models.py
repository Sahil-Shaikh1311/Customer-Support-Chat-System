from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class ChatSession(models.Model):
    customer = models.ForeignKey( User, on_delete=models.CASCADE, related_name="customer_chats")
    agent = models.ForeignKey( User, on_delete=models.SET_NULL, null=True, blank=True, related_name="agent_chats")

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"ChatSession {self.id}"


class Message(models.Model):
    chat = models.ForeignKey( ChatSession, on_delete=models.CASCADE, related_name="messages")

    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message {self.id} (Chat {self.chat.id})"
