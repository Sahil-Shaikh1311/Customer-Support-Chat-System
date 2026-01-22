from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User


class RegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["username", "email" ,"password", "role"]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    
    def create(self, validated_data):
        
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            role=validated_data["role"],
        )
    
        return user

class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        request = self.context["request"]

        username = request.data.get("username") #username = attrs.get("username")
        password = request.data.get("password")
        role = request.data.get("role")

        print("Login data:", request.data)

        if not username or not password or not role:
            raise serializers.ValidationError(
                "Username, password and role are required"
            )

        user = authenticate(username=username, password=password)

        if not user:
            raise serializers.ValidationError("Invalid credentials")

        if user.role != role:
            raise serializers.ValidationError("Invalid role selected")

        
        data = super().validate({
            "username": username,
            "password": password
        })

        data["role"] = user.role
        data["username"] = user.username
        data["user_id"] = user.id

        return data
