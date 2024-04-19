from django.urls import path
from . import views
from django.urls import re_path
from django.http import HttpResponse
urlpatterns = [
    path('', views.getRoutes, name='routes'),
    # path("", views.index, name="index"),
    # path("<str:room_name>/", views.room, name="room"),

    path('pages', views.getPages, name='pages'),
    path('user/info/', views.getUserInfo, name='user-info'),
    path('user/info/<int:board_id>', views.getUserInBoard, name='user-info-board'),
    path('user/info/favorites/', views.getPagesFavorite, name='user-favorites'),

    path('invite/<int:user_id>/create/<int:board_id>/', views.createInvitations, name='create-invite'),
    path('page/create/', views.createBoard, name='create-board'),
    path('item/create/', views.createItem, name='create-item'),
    path('table/create/', views.createTable, name='create-tables'),
    path('date/create/', views.createDate, name='create-date'),
    path('tag/create/', views.createTag, name='create-tag'),
    path('tag/item/create/', views.addTagInItem, name='create-tag-item'),
    path('investment/item/create/', views.createInvestment, name="create-tag-investment"),
    path('user/<int:user_id>/create/', views.addUserInfo, name='add-user-info'),

    path('investment/<int:pk>/update/', views.updateInvestment, name='update-investment'),
    path('invite/<int:user_id>/update/<int:board_id>/read/', views.updateInvitations, name='update-invite-read'),
    path('invite/<int:user_id>/update/<int:board_id>/', views.responseInvitations, name='update-invite'),
    path('page/<int:pk>/update/', views.updateBoard, name='update-board'),
    path('table/<int:pk>/update/', views.updateTable, name='update-table'),
    path('item/<int:pk>/update/', views.updateItem, name='update-item'),
    path('date/<int:pk>/update/', views.updateDate, name='update-date'),
    path('tag/<int:pk>/update/', views.updateTag, name='update-tag'),
    path('user/<int:user_id>/board_like/<int:board_id>/add/', views.addBoardToFavorite, name='add_board_to_favorite'),
    path('page/<int:user_id>/board/<int:board_id>/add/', views.addBoardUser, name='add-board-user'),
    path('page/<int:user_id>/board/<int:board_id>/remove/', views.removeBoardUser, name='remove-board-user'),
    path('page/<int:user_id>/board/<int:board_id>/update/', views.updateBoardUser, name='update-board-user'),
    path('search/user/<str:email>/', views.searchUser, name='search-user'),

    path('update/<int:board_id>/<int:table_id>/<int:table_id_2>/tables', views.updateBoardChange, name='update-board-change'),
    path('update/<int:board_id>/<int:tables_id>/<int:tables_id_2>/<int:item_id>/<int:item_id_2>/item', views.updateItemDragOnDropItem, name="update-item-drag-on-drop"),
    path('update/<int:board_id>/<int:item_id>/<int:item_id_2>/item', views.updateItemDragOnDropItemInBoard, name="update-item-drag-on-drop-board"),
    path('update/<int:board_id>/<int:table_id>/<int:table_id_2>/<int:item_id>/item/drop', views.updateItemDropInBoard, name='update-item-drop-board'),
    path('update/<int:board_id>/<int:table_id>/<int:item_id>/item/drop/board', views.updateItemDropInYourBoardItem, name='update-ite-drop-in-your-board'),

    path('investment/<int:board_id>/<int:pk>/delete', views.deleteInvestment, name='delete-invest'),
    path('table/<int:board_id>/<int:table_id>/delete', views.deleteTable, name='delete-table'),
    path('item/<int:board_id>/<int:table_id>/<int:item_id>/delete', views.deleteItem, name='delete-item'),
    path('date/<int:pk>/delete', views.deleteDate, name="delete-date"),
    path('tag/<int:pk>/delete', views.deleteTag, name="delete-tag"),
    path('user/<int:user_id>/board_like/<int:board_like_id>/remove/', views.removeBoardLike, name='remove_board_like'),
    path('tag/item/remove/', views.removeTagInItem, name='remove-tag'),

    path('item/<int:user_id>/add/<int:item_id>/', views.addMemberInItem, name='add-members'),
    path('item/<int:user_id>/remove/<int:item_id>/', views.removeMemberFromItem, name='remove-members'),
]