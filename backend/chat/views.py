from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from django.db.models import Count, Q


from .models import ChatSession,Message

User = get_user_model()


class StartChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        if user.role != "customer":
            return Response(
                {"error": "Only customers can start chats"},
                status=403
            )

        
        existing_chat = ChatSession.objects.filter(
            customer=user,
            is_active=True
        ).first()

        if existing_chat:
            return Response({
                "chat_id": existing_chat.id,
                "agent_id": existing_chat.agent.id if existing_chat.agent else None
            })

        agent = (
            User.objects.filter(role ="agent")
            .annotate(
                active_chat_count=Count(
                    "agent_chats",
                    filter=Q(agent_chats__is_active=True)
                )
            )
            .order_by("active_chat_count").first()
        )

        if not agent:
            return Response(
                {"error": "No agents available"},
                status=503
            )

        chat = ChatSession.objects.create(
            customer=user,
            agent=agent
        )

        return Response({
            "chat_id": chat.id,
            "agent_id": agent.id
        })



class ChatHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, chat_id):
        messages = Message.objects.filter(chat_id=chat_id).order_by("created_at")

        data = [
            {
                "id": msg.id,
                "content": msg.content,
                "sender": msg.sender.username,
                "role": msg.sender.role,
                "created_at": msg.created_at,
            }
            for msg in messages
        ]

        return Response(data)


class AgentChatListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role != "agent":
            return Response({"detail": "Not allowed"}, status=403)

        chats = ChatSession.objects.filter(agent=user).order_by("-created_at")

        data = []
        for chat in chats:
            last_msg = chat.messages.order_by("-created_at").first()

            data.append({
                "chat_id": chat.id,
                "customer_id": chat.customer.id,
                "customer_name": chat.customer.username,
                "customer_email": chat.customer.email,
                "last_message": last_msg.content if last_msg else "",
                "last_message_time": (
                    last_msg.created_at.isoformat()
                    if last_msg
                    else chat.created_at.isoformat()
                ),
            })

        return Response(data)


class ResolveChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, chat_id):
        user = request.user

        if user.role != "agent":
            return Response(
                {"error": "Only agents can resolve chats"},
                status=403
            )

        try:
            chat = ChatSession.objects.get(id=chat_id, agent=user)
        except ChatSession.DoesNotExist:
            return Response(
                {"error": "Chat not found"},
                status=404
            )

        chat.is_active = False
        chat.save()

        return Response({
            "message": "Chat resolved successfully",
            "chat_id": chat.id
        })


class CustomerChatListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        chats = ChatSession.objects.filter(customer=user).order_by("-created_at")

        data = []
        for chat in chats:
            data.append({
                "chat_id": chat.id,
                "agent_name": chat.agent.username if chat.agent else None,
                "is_active": chat.is_active,
                "created_at": chat.created_at,
            })

        return Response(data)
