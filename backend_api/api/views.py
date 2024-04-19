from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_decode
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    
@api_view(['GET'])
def getRoutes(request):
    routes = [
        {
            'Endpoint': 'api/token/',
            'method': 'GET',
            'body': None,
            'description': 'Возвращает страницу со всеми связями'
        },
        {
            'Endpoint': 'api/token/refresh',
            'method': 'GET',
            'body': None,
            'description': 'Возвращает страницу со всеми связями'
        },
    ]
    return Response(routes)


@api_view(['GET'])
def getActivated(request, uid, token):
    uid = urlsafe_base64_decode(uid).decode()
    user = User.objects.get(pk=uid)
    routes = {
        "email": user.email
    }
    return Response(routes)


@api_view(['POST'])
def getUserInfo(request):
    data = request.data
    username = data['username']
    try:
        user = User.objects.get(username=username)
        return Response(user.is_active)
    except User.DoesNotExist:
        return Response("Пользователь не зарегистрирован")


@api_view(['POST'])
def getEmailInfo(request):
    data = request.data
    email = data['email']
    try:
        user = User.objects.get(email=email)
        routes = {
            "email": user.email,
            'username': user.username,
            'active': user.is_active,
        }
        return Response(routes)
    except User.DoesNotExist:
        return Response("Пользователь не зарегистрирован")

