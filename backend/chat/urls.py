from django.urls import path
from .views import StartChatView,ChatHistoryView,AgentChatListView,ResolveChatView,CustomerChatListView

urlpatterns = [
    path("start/", StartChatView.as_view()),
    path("history/<int:chat_id>/", ChatHistoryView.as_view()),
    path("agent/chats/", AgentChatListView.as_view()),
    path("resolve/<int:chat_id>/", ResolveChatView.as_view()),
    path("customer/chats/",CustomerChatListView.as_view()),

]
