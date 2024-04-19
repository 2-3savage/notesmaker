from django.urls import path, re_path, include
from . import views
from .views import MyTokenObtainPairView

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('', views.getRoutes),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/', include('djoser.urls')),
    re_path(r'^auth/', include('djoser.urls.authtoken')),
    path('activate/<str:uid>/<str:token>/', views.getActivated),
    path('active/username/', views.getUserInfo),
    path('active/email/', views.getEmailInfo),
]