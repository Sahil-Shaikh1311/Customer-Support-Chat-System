from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import json
from .models import ChatSession, Message


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_id = int(self.scope["url_route"]["kwargs"]["room_id"])
        self.room_group_name = f"chat_{self.room_id}"

        self.user = self.scope["user"]

        if not self.user.is_authenticated:
            await self.close()
            return
        
        if not await self.is_chat_active():
            await self.close()
            return

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
        print(f"Connected {self.user.username} to room {self.room_id}")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        print(f"Disconnected from room {self.room_id}")

    async def receive(self, text_data):
        data = json.loads(text_data)

        
        if data.get("type") == "typing":
            await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "typing_event",
                "is_typing": data.get("is_typing"),
                "sender": self.user.username,
                "role": self.user.role,
            }
           

            )
            print("TYPING EVENT:", data)

            return

        message = data.get("message")

      
        if not message:
            return
        
        if not await self.is_chat_active():
            return

   
        await self.save_message(message)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "sender": self.user.username,
                "role": self.user.role,
            }
        )

    async def typing_event(self, event):
        await self.send(text_data=json.dumps({
        "type": "typing",
        "is_typing": event["is_typing"],
        "sender": event["sender"],
        "role": event["role"],
    }))

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "sender": event["sender"],
            "role": event["role"],
        }))


    @database_sync_to_async
    def is_chat_active(self):
        return ChatSession.objects.filter(id=self.room_id, is_active=True).exists()


    @database_sync_to_async
    def save_message(self, content):
        chat = ChatSession.objects.get(id=self.room_id)

        Message.objects.create(
            chat=chat,   
            sender=self.user,
            content=content
        )
    