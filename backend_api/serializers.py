from rest_framework.serializers import ModelSerializer, SerializerMethodField
from .models import *
from django.contrib.auth.models import User

class BoardSerializerInfo(ModelSerializer):
    class Meta:
        model = Board
        fields = ['id']

class RightsSerializer(ModelSerializer):
    board = BoardSerializerInfo(many=False)
    class Meta:
        model = Rights
        fields = ['right', 'board']

class UserProfileSerializer(ModelSerializer):
    board_like = BoardSerializerInfo(many=True)
    rights = RightsSerializer(many=True)
    class Meta:
        model = UserProfile
        fields = ['avatar', 'board_like', 'rights']



class TagSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'text', 'color']


class DateSerializer(ModelSerializer):
    class Meta:
        model = Date
        fields = ['id', 'date', 'complete']

class InvestmentSerializer(ModelSerializer):
    class Meta:
        model = Investment
        fields = ['id', 'document', 'extension', 'site', 'active', 'timestamp']

class UserSerializerEmail(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class UserSerializer(ModelSerializer):
    user = UserProfileSerializer(many=False)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'user']

class ItemSerializer(ModelSerializer):
    datepicker = DateSerializer(many=False)
    tag = TagSerializer(many=True)
    investment = InvestmentSerializer(many=True)  # укажите источник связи
    members = UserSerializer(many=True)
    class Meta:
        model = Item
        fields = ['id', 'title', 'position', "members", 'comment', 'investment', 'datepicker', 'tag']



class TableSerializer(ModelSerializer):
    table = ItemSerializer(many=True)
    class Meta:
        model = Table
        fields = ['id', 'title', 'position', 'table']






class BoardSerializerInvite(ModelSerializer):
    class Meta:
        model = Board
        fields = ['id', 'title']

class InvitationSerializer(ModelSerializer):
    inviter = UserSerializerEmail(many=False)  # Сериализатор для приглашателя
    invitee = UserSerializerEmail(many=False)  # Сериализатор для приглашенного
    board = BoardSerializerInvite(many=False)
    class Meta:
        model = Invitation
        fields = ('id', 'status', 'timestamp', 'is_read', 'inviter', 'invitee', 'board')  # Укажите поля модели Invitation, которые необходимо сериализовать


class BoardSerializer(ModelSerializer):
    items = TableSerializer(many=True)
    tags = TagSerializer(many=True)
    users = UserSerializer(many=True)
    
    class Meta:
        model = Board
        fields = ['id', 'title', 'users', 'type', 'icon', 'cover', 'tags', 'items']
