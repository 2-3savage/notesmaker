from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import *
from .serializers import *
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from datetime import datetime, timedelta
from django.utils import timezone
import requests
from django.core.files.base import ContentFile
from urllib.parse import urlparse
import os
from django.conf import settings
import validators


@api_view(['GET'])
def getRoutes(request):
    routes = [
        {
            'Endpoint': '/pages/',
            'method': 'GET',
            'body': None,
            'description': 'Возвращает страницу со всеми связями'
        },
        {
            'Endpoint': '/notes/id',
            'method': 'GET',
            'body': None,
            'description': 'Returns a single note object'
        },
        {
            'Endpoint': '/page/create/',
            'method': 'POST',
            'body': {"title": "", "type": "board", "icon": "", "cover": ""},
            'description': 'Создает страницу board'
        },
        {
            'Endpoint': '/table/create/',
            'method': 'POST',
            'body': {"title": "", "board": ""},
            'description': 'Создает таблицу с привязкой к странице'
        },
        {
            'Endpoint': '/item/create/',
            'method': 'POST',
            'body': {"title": "", "comment": "", "table": ""},
            'description': 'Создает элемент с привязкой к таблице'
        },
        {
            'Endpoint': '/date/create/',
            'method': 'POST',
            'body': {"date": "2024-01-20 12:08:32+00:00", "complete": False, "item": ""},
            'description': 'Создает дату с привязкой к элементу таблицы'
        },
        {
            'Endpoint': '/tag/create/',
            'method': 'POST',
            'body': {"text": "", "color": "", "item": "", "board": ""},
            'description': 'Создает тег на странице и на элемент с привязкой к элементу таблицы и самой страничке'
        },     
        {
            'Endpoint': '/tag/item/remove/',
            'method': 'POST',
            'body': {"item": "", "tag": ""},
            'description': 'Удаляет тег на элемент с привязкой к элементу таблицы'
        },     
        {
            'Endpoint': '/tag/item/create/',
            'method': 'POST',
            'body': {"item": "", "tag": ""},
            'description': 'Создает тег на элемент с привязкой к элементу таблицы'
        },    
        {
            'Endpoint': '/page/{id}/update/',
            'method': 'PUT',
            'body': {"title": "", "icon": "", "cover": ""},
            'description': 'Обновляет страницу'
        },  
        {
            'Endpoint': '/table/{id}/update/',
            'method': 'PUT',
            'body': {"title": ""},
            'description': 'Обновляет таблицу'
        },  
        {
            'Endpoint': '/item/{id}/update/',
            'method': 'PUT',
            'body': {"title": "",  "comment": "", "table": ""},
            'description': 'Обновляет элемент'
        },  
        {
            'Endpoint': '/date/{id}/update/',
            'method': 'PUT',
            'body': {"date": "2023-01-27T11:55:06Z", "complete": False},
            'description': 'Обновляет время'
        },  
        {
            'Endpoint': 'page/{id}/tables/update/',
            'method': 'PUT',
            'body': [
            {
                "id": 3,
                "title": "123",
                "table": [
                    {
                        "id": 4,
                        "title": "123",
                        "comment": "123",
                        "datepicker": {
                            "id": 2,
                            "date": "2024-01-27T13:22:13Z",
                            "complete": True
                        },
                        "tag": [
                            {
                                "id": 3,
                                "text": "Тык",
                                "color": "yellow"
                            }
                        ]
                    }
                ]
            }
        ],
            'description': 'Обновляет все таблицы'
        },  
        {
            'Endpoint': '/tag/{id}/delete/',
            'method': 'PUT',
            'body': None,
            'description': 'Обновляет тэг'
        }, 
        {
            'Endpoint': '/table/{id}/delete/',
            'method': 'DELETE',
            'body': None,
            'description': 'Удаляет таблицу'
        },  
        {
            'Endpoint': '/item/{id}/delete/',
            'method': 'DELETE',
            'body': None,
            'description': 'Удаляет элемент'
        },  
        {
            'Endpoint': '/date/{id}/delete/',
            'method': 'DELETE',
            'body': None,
            'description': 'Удаляет время'
        },  
        {
            'Endpoint': '/tag/{id}/delete/',
            'method': 'DELETE',
            'body': None,
            'description': 'Удаляет тэг'
        },  


    ]
    return Response(routes)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserInfo(request):
    user = request.user
    invitations_as_invitee = Invitation.objects.filter(invitee=user).order_by('-timestamp')
    # invitations_as_inviter = Invitation.objects.filter(inviter=user)

    serializer = UserSerializer(user, many=False)
    user_data = serializer.data
    user_data['invitations'] = InvitationSerializer(invitations_as_invitee, many=True).data  # Включаем объединенные приглашения в данные пользователя
    invitations_unread = Invitation.objects.filter(invitee=user, is_read=False).count()  # Получаем количество непрочитанных приглашений для пользователя
    user_data['invitations_unread'] = invitations_unread  # Добавляем количество непрочитанных приглашений в данные пользователя
    # user_data['invitations_send'] = InvitationSerializer(invitations_as_inviter, many=True).data  # Включаем объединенные приглашения в данные пользователя
    return Response(user_data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getPages(request):
    user = request.user
    board = Board.objects.filter(users=user)
    
    serializer = BoardSerializer(board, many=True)
    
    # Модифицируем данные перед отправкой в Response
    for data in serializer.data:
        current_board_id = data['id']
        for user_data in data['users']:
            board_like_ids = [board['id'] for board in user_data['user']['board_like']]
            user_data['user']['like_board'] = current_board_id in board_like_ids
            user_data['user'].pop('board_like', None)  
            for right in user_data['user']['rights']:
                if right['board']['id'] == current_board_id:
                    user_data['user']['rights'] = right['right']
            

    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getPagesFavorite(request):
    user = request.user
    user_profile = UserProfile.objects.get(user=user)
    serializer_user_profile = UserProfileSerializer(user_profile, many=False)
    
    board_ids = [item['id'] for item in serializer_user_profile.data['board_like']]
    board = Board.objects.filter(users=user)
    boards = Board.objects.filter(id__in=board_ids, users=user)
    
    serializer = BoardSerializer(boards, many=True)  
    remaining_boards = board.difference(boards)
    serializer_2 = BoardSerializer(remaining_boards, many=True)
    for data in serializer.data:
        data.pop('tags', None)
        data.pop('items', None)
        data['users'] = len(data['users'])
    for data in serializer_2.data:
        data.pop('tags', None)
        data.pop('items', None)
        data['users'] = len(data['users']) 

    serilizer = {
        "boards_like": serializer.data,
        "boards_not_like": serializer_2.data,
    }
    return Response(serilizer)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserInBoard(request, board_id):
    user = request.user
    board = Board.objects.get(id=board_id)
    user_profile = UserProfile.objects.get(user=user)
    rights_to_change = user_profile.rights.get(board=board)
    
    user_data = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "right": rights_to_change.right,
    }
    
    return Response(user_data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteBoard(request, board_id):
    user = request.user
    board = Board.objects.get(id=board_id)
    user_profile = UserProfile.objects.get(user=user)
    rights_to_change = user_profile.rights.get(board=board)
    if rights_to_change.right == "creator":
        board.delete()
        board = Board.objects.filter(users=user)
        serializer = BoardSerializer(board, many=True)
        for data in serializer.data:
            current_board_id = data['id']
            for user_data in data['users']:
                board_like_ids = [board['id'] for board in user_data['user']['board_like']]
                user_data['user']['like_board'] = current_board_id in board_like_ids
                user_data['user'].pop('board_like', None)  
                for right in user_data['user']['rights']:
                    if right['board']['id'] == current_board_id:
                        user_data['user']['rights'] = right['right']
        return Response(serializer.data)
    else:
        return Response("Недостаточно прав")

@api_view(['POST'])
def createBoard(request):
    data = request.data
    user_id = data['user_id']
    user = User.objects.get(pk=user_id)
    board = Board.objects.create(title=data['title'],type=data['type'], icon=data['icon'], cover=data['cover'])
    right = Rights.objects.create(board=board, right="creator")
    user_profile = UserProfile.objects.get(user=user)
    user_profile.rights.add(right)
    board.users.set([user])
    serializer = BoardSerializer(board, many=False)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createInvitations(request, user_id, board_id):
    user_inviter = request.user  # от кого приглашение
    user_invitee = User.objects.get(id=user_id)  # тот, кому прислали приглашение
    if user_invitee == user_inviter:
        return Response("Нельзя посылать приглашения самому себе")
    board = Board.objects.get(id=board_id)
    if board.users.filter(id=user_invitee.id).exists():
        return Response("Такой пользователь уже есть на доске")
    try:
        existing_invitation = Invitation.objects.get(inviter=user_inviter, invitee=user_invitee, board=board, status="pending")
        serializer = InvitationSerializer(existing_invitation, many=False)
        return Response("Приглашение уже было отправлено ранее")
    except Invitation.DoesNotExist:
        invite = Invitation.objects.create(inviter=user_inviter, invitee=user_invitee, board=board)
        serializer = InvitationSerializer(invite, many=False)
        invitations = Invitation.objects.filter(board=board).order_by('-timestamp')
        serializer = InvitationSerializer(invitations, many=True)
        return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateInvitations(request, user_id, board_id):
    user_invitee = request.user  # кто принял приглашение
    data = request.data
    user_inviter = User.objects.get(id=user_id)  # кто отправил приглашение
    board = Board.objects.get(id=board_id)
    invitation = Invitation.objects.get(inviter=user_inviter, invitee=user_invitee, board=board, is_read=False, status="pending")
    serializer = InvitationSerializer(instance=invitation, data=data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        invitations_as_invitee = Invitation.objects.filter(invitee=user_invitee).order_by('-timestamp')
        serializer = UserSerializer(user_invitee, many=False)
        user_data = serializer.data
        user_data['invitations'] = InvitationSerializer(invitations_as_invitee, many=True).data 
        return Response(user_data)
    else:
        return Response(serializer.errors)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def responseInvitations(request, user_id, board_id):
    user_invitee = request.user  # кто принял приглашение
    data = request.data
    user_inviter = User.objects.get(id=user_id)  # кто отправил приглашение
    board = Board.objects.get(id=board_id)
    invitation = Invitation.objects.get(inviter=user_inviter, invitee=user_invitee, board=board, status="pending")
    serializer = InvitationSerializer(instance=invitation, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
    else:
        return Response(serializer.errors)
    if data['status'] == 'accepted':
        user_profile = UserProfile.objects.get(user=user_invitee)
        if user_invitee.id in board.users.values_list('id', flat=True):
            return Response("User already in the board")
        
        right = Rights.objects.create(board=board)

        user_profile.rights.add(right)
        board.users.add(user_invitee)
        
        serializer = BoardSerializer(instance=board, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors)

        invitations_as_invitee = Invitation.objects.filter(invitee=user_invitee).order_by('-timestamp')
        serializer = UserSerializer(user_invitee, many=False)
        user_data = serializer.data
        user_data['invitations'] = InvitationSerializer(invitations_as_invitee, many=True).data 
        invitations_as_invitee = Invitation.objects.filter(invitee=user_invitee).order_by('-timestamp')
        invitations_as_invitee.delete()

        return Response(user_data)
    else:
        invitations_as_invitee = Invitation.objects.filter(invitee=user_invitee).order_by('-timestamp')
        serializer = UserSerializer(user_invitee, many=False)
        user_data = serializer.data
        user_data['invitations'] = InvitationSerializer(invitations_as_invitee, many=True).data 
        invitations_as_invitee = Invitation.objects.filter(invitee=user_invitee).order_by('-timestamp')
        invitations_as_invitee.delete()
        return Response(user_data)
    
@api_view(['POST'])
def createTable(request):
    data = request.data
    board_id = data['board']
    board = Board.objects.get(pk=board_id)
    
    table_count = Table.objects.filter(board=board).count()
    
    table = Table.objects.create(
        title=data['title'],
        position=table_count + 1,
        board=board
    )
    serializer = TableSerializer(table, many=False)
    return Response(serializer.data)


@api_view(['POST'])
def createItem(request):
    data = request.data
    table_id = data['table'] 
    table = Table.objects.get(pk=table_id)
    item_count = Item.objects.filter(table=table).count()

    note = Item.objects.create(
        title=data['title'], 
        comment=data['comment'], 
        position=item_count + 1, 
        table=table
    )
    serializer = ItemSerializer(note, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def createDate(request):
    data = request.data
    item_id = data['item']
    item = Item.objects.get(pk=item_id)
    date = Date.objects.create(date=data['date'], complete=data["complete"], item=item)
    serializer = DateSerializer(date, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def createTag(request):
    data = request.data
    board_id = data['board']
    item_id = data['item']
    board = Board.objects.get(pk=board_id)
    item = Item.objects.get(pk=item_id)
    tag = Tag.objects.create(text=data['text'], color=data['color'], board=board)

    item.tag.add(tag)  # Используем метод add() для добавления тега к элементу

    serializer_tag = TagSerializer(tag, many=False)
    serializer_item = ItemSerializer(item)
    response_data = {
        'tag_page': serializer_tag.data,
        'tag_item': serializer_item.data
    }
    return Response(response_data)


@api_view(['POST'])
def addUserInfo(request, user_id):
    data = request.data
    avatar = data['avatar']
    user = User.objects.get(pk=user_id)
    user_profile = UserProfile.objects.create(avatar=avatar, user=user)
    serializer = UserProfileSerializer(user_profile, many=False)
    return Response(serializer.data)


@api_view(['POST'])
def addTagInItem(request):
    data = request.data
    item_id = data['item']
    tag_id = data['tag']  # Получаем ID существующего тега, который нужно добавить к элементу
    item = Item.objects.get(pk=item_id)
    tag = Tag.objects.get(pk=tag_id)  # Получаем объект существующего тега
    item.tag.add(tag)  # Добавляем существующий тег к элементу

    serializer = ItemSerializer(item)
    return Response(serializer.data)

@api_view(['POST'])
def removeTagInItem(request):
    data = request.data
    item_id = data['item']
    tag_id = data['tag']  # Получаем ID тега, который нужно удалить из элемента
    item = Item.objects.get(pk=item_id)
    tag = Tag.objects.get(pk=tag_id)  # Получаем объект тега
    item.tag.remove(tag)  # Удаляем тег из элемента

    serializer = ItemSerializer(item)
    return Response(serializer.data)

@api_view(['PUT'])
def addBoardUser(request, board_id, user_id):
    data = request.data
    board = Board.objects.get(id=board_id)
    user = User.objects.get(id=user_id)
    user_profile = UserProfile.objects.get(user=user)
    if user.id in board.users.values_list('id', flat=True):
        return Response("User already in the board")
    
    right = Rights.objects.create(board=board)
    user_profile = UserProfile.objects.get(user=user)
    user_profile.rights.add(right)
    board.users.add(user)
    
    serializer = BoardSerializer(instance=board, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
    else:
        return Response(serializer.errors)

    
    for data in serializer.data["users"]:
        board_like_ids = [board['id'] for board in data['user']['board_like']]
        data['user']['like_board'] = board_id in board_like_ids
        data['user'].pop('board_like', None)  
        for right in data['user']['rights']:
            if right['board']['id'] == board_id:
                data['user']['rights'] = right['right']
    
    return Response(serializer.data["users"])


@api_view(['GET'])
def getBoardInvations(request, board_id):
    board = Board.objects.get(id=board_id)
    invitations = Invitation.objects.filter(board=board).order_by('-timestamp')
    serializer = InvitationSerializer(invitations, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def searchUser(request, email):
    users = User.objects.filter(email__icontains=email)
    serializer = UserSerializerEmail(users, many=True)
    return Response(serializer.data) 

@api_view(['DELETE'])
def removeBoardUser(request, board_id, user_id):
    data = request.data
    board = Board.objects.get(id=board_id)
    user = User.objects.get(id=user_id)
    user_profile = UserProfile.objects.get(user=user)
    rights_to_delete = user_profile.rights.filter(board=board)
    rights_to_delete.delete()
    board.users.remove(user)
    board.save()
    serializer_board = BoardSerializer(board, many=False)
    for data in serializer_board.data["users"]:
        board_like_ids = [board['id'] for board in data['user']['board_like']]
        data['user']['like_board'] = board_id in board_like_ids
        data['user'].pop('board_like', None)  
        for right in data['user']['rights']:
            if right['board']['id'] == board_id:
                data['user']['rights'] = right['right']

    return Response(serializer_board.data["users"])

@api_view(["PUT"])
def updateBoardUser(request, board_id, user_id):
    data = request.data
    board = Board.objects.get(id=board_id)
    user = User.objects.get(id=user_id)
    user_profile = UserProfile.objects.get(user=user)
    rights_to_change = user_profile.rights.get(board=board)
    serializer = RightsSerializer(instance=rights_to_change, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    serializer_board = BoardSerializer(board, many=False)
    for data in serializer_board.data["users"]:
        board_like_ids = [board['id'] for board in data['user']['board_like']]
        data['user']['like_board'] = board_id in board_like_ids
        data['user'].pop('board_like', None)  
        for right in data['user']['rights']:
            if right['board']['id'] == board_id:
                data['user']['rights'] = right['right']
            
    return Response(serializer_board.data["users"])


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateBoard(request, pk):
    data = request.data
    user = request.user
    board = Board.objects.get(id=pk)
    serializer = BoardSerializer(instance=board, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        user_profile = UserProfile.objects.get(user=user)
        serializer_user_profile = UserProfileSerializer(user_profile, many=False)
        
        board_ids = [item['id'] for item in serializer_user_profile.data['board_like']]
        board = Board.objects.filter(users=user)
        boards = Board.objects.filter(id__in=board_ids, users=user)
        
        serializer = BoardSerializer(boards, many=True)  
        remaining_boards = board.difference(boards)
        serializer_2 = BoardSerializer(remaining_boards, many=True)
        for data in serializer.data:
            data.pop('tags', None)
            data.pop('items', None)
            data['users'] = len(data['users'])
        for data in serializer_2.data:
            data.pop('tags', None)
            data.pop('items', None)
            data['users'] = len(data['users']) 

        serilizer = {
            "boards_like": serializer.data,
            "boards_not_like": serializer_2.data,
        }
        return Response(serilizer)
    else:
        return Response(serializer.errors)

@api_view(['PUT'])
def updateTable(request, pk):
    data = request.data
    table = Table.objects.get(id=pk)
    serializer = TableSerializer(instance=table, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors)

@api_view(['PUT'])
def updateItem(request, pk):
    data = request.data
    item = Item.objects.get(id=pk)
    serializer = ItemSerializer(instance=item, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors)
    
import urllib.request
from urllib.parse import urlparse

@api_view(['POST'])
def createInvestment(request):
    data = request.data
    item_id = data['item']
    item = Item.objects.get(pk=item_id)
    item_serializer = ItemSerializer(item, many=False)
    if data['investment'] != "null":
        filename = urlparse(data['investment']).path.split('/')[-1]
        file_extension = os.path.splitext(filename)[1]
        if file_extension == '':
            is_valid = validators.url(data['investment'])
            if not is_valid:
                return Response("Invalid url")
            investment = Investment.objects.create(site=data["investment"], document="site", extension="site", item=item, active=False)
            serializer = InvestmentSerializer(investment, many=False)
            return Response(serializer.data)
        try:
            response = urllib.request.urlopen(data['investment'])
            active = False
            count_of_specific_extensions = sum(1 for item in item_serializer.data['investment'] if os.path.splitext(item['document'])[1] in [".png", ".gif", ".jpg"])
            if count_of_specific_extensions == 0 and (file_extension == ".png" or file_extension == ".jpg" or file_extension == ".gif"):
                active = True
            investment = Investment.objects.create(item=item, extension=file_extension, active=active)
            investment.document.save(filename, ContentFile(response.read()), save=True)
            serializer = InvestmentSerializer(investment, many=False)
        except urllib.error.HTTPError as e: 
            return Response("Error request")
    else:
        active = False
        file_extension = os.path.splitext(data["document"].name)[1]
        count_of_specific_extensions = sum(1 for item in item_serializer.data['investment'] if os.path.splitext(item['document'])[1] in [".png", ".gif", ".jpg"])
        if count_of_specific_extensions == 0 and (file_extension == ".png" or file_extension == ".jpg" or file_extension == ".gif"):
            active = True
        investment = Investment.objects.create(document=data["document"], item=item, extension=file_extension, active=active)
        serializer = InvestmentSerializer(investment, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
def updateInvestment(request, pk):
    data = request.data
    investment = Investment.objects.get(id=pk)
    item = Item.objects.get(investment=investment)
    item_serializer = ItemSerializer(item, many=False)
    if data['active'] is True:
        for item in item_serializer.data['investment']:
            if item['active'] is True:
                investment_active = Investment.objects.get(id=item['id'])
                serializer_active = InvestmentSerializer(instance=investment_active, data={"active": False}, partial=True)
                if serializer_active.is_valid():
                    serializer_active.save()
    
    serializer = InvestmentSerializer(instance=investment, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        investment = Investment.objects.get(id=pk)
        item = Item.objects.get(investment=investment)
        item_serializer_new = ItemSerializer(item, many=False)
        return Response(item_serializer_new.data)
    else:
        return Response(serializer.errors)


@api_view(['DELETE'])
def deleteInvestment(request, board_id, pk):
    investment = Investment.objects.get(id=pk)
    if investment.document:
        file_path = os.path.join(settings.MEDIA_ROOT, str(investment.document))
        if os.path.exists(file_path):
            os.remove(file_path)
    
    investment.delete()
    board = Board.objects.get(id=board_id)
    serializer_board = BoardSerializer(board, many=False)
    return Response(serializer_board.data)

@api_view(['PUT'])
def updateDate(request, pk):
    data = request.data
    date = Date.objects.get(id=pk)
    serializer = DateSerializer(instance=date, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors)

@api_view(['PUT'])
def updateTag(request, pk):
    data = request.data
    tag = Tag.objects.get(id=pk)
    serializer = TagSerializer(instance=tag, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors)

@api_view(['POST'])
def addBoardToFavorite(request, user_id, board_id):
    try:
        user = User.objects.get(id=user_id)
        user_profile = UserProfile.objects.get(user=user)
        
        board = Board.objects.get(id=board_id)

        # Добавление доски в избранное пользователя
        user_profile.board_like.add(board)
        user_profile.save()
        user_profile = UserProfile.objects.get(user=user)
        serializer_user_profile = UserProfileSerializer(user_profile, many=False)
        
        board_ids = [item['id'] for item in serializer_user_profile.data['board_like']]
        board = Board.objects.filter(users=user)
        boards = Board.objects.filter(id__in=board_ids, users=user)
        
        serializer = BoardSerializer(boards, many=True)  
        remaining_boards = board.difference(boards)
        serializer_2 = BoardSerializer(remaining_boards, many=True)
        for data in serializer.data:
            data.pop('tags', None)
            data.pop('items', None)
            data['users'] = len(data['users'])
        for data in serializer_2.data:
            data.pop('tags', None)
            data.pop('items', None)
            data['users'] = len(data['users']) 

        serilizer = {
            "boards_like": serializer.data,
            "boards_not_like": serializer_2.data,
        }
        return Response(serilizer)
    except (UserProfile.DoesNotExist, Board.DoesNotExist):
        return Response("User or Board not found", status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
def updateBoardChange(request, board_id, table_id, table_id_2):
    # Функция для смены позиции таблиц
    table = Table.objects.get(id=table_id)
    table_2 = Table.objects.get(id=table_id_2)
    position_to_insert = table_2.position 
    table_2.position = table.position
    table_2.save()
    table.position = position_to_insert
    table.save()

    board = Board.objects.get(id=board_id)
    serializer_board = BoardSerializer(board, many=False)
    return Response(serializer_board.data)


@api_view(['POST'])
def updateItemDragOnDropItem(request, board_id, tables_id, tables_id_2, item_id, item_id_2):
    # Функция для перемещения элемента в другую таблицу через выкидывание на элемент
    # board_id - страница, tables_id - таблица из которой берут, tables_id_2 - таблица в которую берут,
    # item_id - элемент который перемещается, item_id_2 - элемент на чье место перемещают
    table = Table.objects.get(id=tables_id) 
    table_2 = Table.objects.get(id=tables_id_2) 

    # Получение элемента для перемещения
    item = Item.objects.get(id=item_id)
    # Перемещение элемента из tables_id
    position_to_insert = item.position 
    items_to_update = Item.objects.filter(table=table, position__gt=position_to_insert)
    for item_to_update in items_to_update:
        item_to_update.position -= 1
        item_to_update.save()


    # Перемещение элемента в tables_id_2
    position_to_insert = Item.objects.get(id=item_id_2).position 
    items_to_update = Item.objects.filter(table=table_2, position__gt=position_to_insert - 1)


    for item_to_update in items_to_update:
        item_to_update.position += 1
        item_to_update.save()

    item.position = position_to_insert
    item.table = table_2
    item.save()

    board = Board.objects.get(id=board_id)
    serializer_board = BoardSerializer(board, many=False)
    return Response(serializer_board.data)

@api_view(['POST'])
def updateItemDragOnDropItemInBoard(request, board_id, item_id, item_id_2):
    # Функция для перемещения элемента в одной таблице
    item = Item.objects.get(id=item_id)
    item_2 = Item.objects.get(id=item_id_2)
    position_to_insert = item_2.position 
    item_2.position = item.position
    item_2.save()
    item.position = position_to_insert
    item.save()

    board = Board.objects.get(id=board_id)
    serializer_board = BoardSerializer(board, many=False)
    return Response(serializer_board.data)

@api_view(['POST'])
def updateItemDropInBoard(request, board_id, table_id, table_id_2, item_id):
    # Функция для перемещения элемента в другую таблицу через выкидывание на таблицу table_id_2 - куда, table_id - откуда
    table = Table.objects.get(id=table_id) 
    table_2 = Table.objects.get(id=table_id_2) 
    # Смотрим количество записей в определенном столбце куда перекидываем
    item_count = Item.objects.filter(table=table_2).count()

    # Достаем item и смотрим его позицию в таблице. Все элементы в таблице выше чем сам item уменьшаем на -1
    item = Item.objects.get(id=item_id)
    position_in_board = item.position
    items_to_update = Item.objects.filter(table=table, position__gt=position_in_board)

    for item_to_update in items_to_update:
        item_to_update.position -= 1
        item_to_update.save()

    # Ставим на +1 position, т.к. кидаем и меняем таблицу
    item.table = table_2
    item.position = item_count + 1
    item.save()

    board = Board.objects.get(id=board_id)
    serializer_board = BoardSerializer(board, many=False)
    return Response(serializer_board.data)

@api_view(['POST'])
def updateItemDropInYourBoardItem(request, board_id, table_id, item_id):
    # Функция для перемещения элемента в одной таблице через выкидывание на таблицу
    table = Table.objects.get(id=table_id) 

    # Смотрим количество записей в определенном столбце куда перекидываем
    item_count = Item.objects.filter(table=table).count()

    # Достаем item и смотрим его позицию в таблице. Все элементы в таблице выше чем сам item уменьшаем на -1
    item = Item.objects.get(id=item_id)
    position_in_board = item.position
    items_to_update = Item.objects.filter(table=table, position__gt=position_in_board)

    for item_to_update in items_to_update:
        item_to_update.position -= 1
        item_to_update.save()

    # Ставим на +1 position, т.к. кидаем и меняем таблицу
    item.position = item_count
    item.save()

    board = Board.objects.get(id=board_id)
    serializer_board = BoardSerializer(board, many=False)
    return Response(serializer_board.data)

@api_view(["DELETE"])
def deleteTable(request, board_id, table_id):
    board = Board.objects.get(id=board_id)
    table = Table.objects.get(id=table_id)

    position_in_board = table.position
    table_to_update = Table.objects.filter(board=board, position__gt=position_in_board)
    for table_to_update in table_to_update:
        table_to_update.position -= 1
        table_to_update.save()

    table.delete()
    serializer_board = BoardSerializer(board, many=False)
    return Response(serializer_board.data)


@api_view(["DELETE"])
def deleteItem(request, board_id, table_id, item_id):
    board = Board.objects.get(id=board_id)
    table = Table.objects.get(id=table_id)
    item = Item.objects.get(id=item_id)

    position_in_board = item.position
    items_to_update = Item.objects.filter(table=table, position__gt=position_in_board)
    for item_to_update in items_to_update:
        item_to_update.position -= 1
        item_to_update.save()

    item.delete()
    serializer_board = BoardSerializer(board, many=False)
    return Response(serializer_board.data)

@api_view(["DELETE"])
def deleteDate(request, pk):
    date = Date.objects.get(id=pk)
    date.delete()
    return Response("Table was deleted successfully")

@api_view(["DELETE"])
def deleteTag(request, pk):
    tag = Tag.objects.get(id=pk)
    tag.delete()
    return Response("Table was deleted successfully")

@api_view(['DELETE'])
def removeBoardLike(request, user_id, board_like_id):
    try:
        user = User.objects.get(id=user_id)
        user_profile = UserProfile.objects.get(user=user)
        user_profile.board_like.remove(board_like_id)
        user.save()
        user_profile = UserProfile.objects.get(user=user)
        serializer_user_profile = UserProfileSerializer(user_profile, many=False)
        
        board_ids = [item['id'] for item in serializer_user_profile.data['board_like']]
        board = Board.objects.filter(users=user)
        boards = Board.objects.filter(id__in=board_ids, users=user)
        
        serializer = BoardSerializer(boards, many=True)  
        remaining_boards = board.difference(boards)
        serializer_2 = BoardSerializer(remaining_boards, many=True)
        for data in serializer.data:
            data.pop('tags', None)
            data.pop('items', None)
            data['users'] = len(data['users'])
        for data in serializer_2.data:
            data.pop('tags', None)
            data.pop('items', None)
            data['users'] = len(data['users']) 

        serilizer = {
            "boards_like": serializer.data,
            "boards_not_like": serializer_2.data,
        }
        return Response(serilizer)
    except UserProfile.DoesNotExist:
        return Response("User not found", status=status.HTTP_404_NOT_FOUND)
 
@api_view(['POST'])
def addMemberInItem(request, user_id, item_id):
    user = User.objects.get(id=user_id)
    item = Item.objects.get(id=item_id)
    item.members.add(user)
    item.save()
    serializer = ItemSerializer(item, many=False)
    return Response(serializer.data)

@api_view(['DELETE'])
def removeMemberFromItem(request, user_id, item_id):
    try:
        user = User.objects.get(id=user_id)
        item = Item.objects.get(id=item_id)
        item.members.remove(user)
        item.save()
        return Response("User removed from item successfully", status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response("User not found", status=status.HTTP_404_NOT_FOUND)
    except Item.DoesNotExist:
        return Response("Item not found", status=status.HTTP_404_NOT_FOUND)
