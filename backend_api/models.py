from django.db import models
from django.contrib.auth.models import User, Group, Permission
# Create your models here.
User._meta.get_field('email')._unique = True
User._meta.get_field('email').blank = False
User._meta.get_field('email').null = False



class Board(models.Model):
    class Meta:
        verbose_name_plural = 'Страницы'

    id = models.AutoField(primary_key=True)
    users = models.ManyToManyField(User, related_name="board", blank=True) # много бордов могут ссылаться на 1 юзера
    title = models.CharField(max_length=50)
    type = models.CharField(max_length=50)
    icon = models.CharField(max_length=50, null=True, blank=True)
    cover = models.URLField(null=True, blank=True)
    
    def __str__(self) -> str:
        return self.title[0:50]


class Rights(models.Model):
    class Meta:
        verbose_name_plural = 'Разрешения'
    id = models.AutoField(primary_key=True)
    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name='rights')
    right = models.CharField(max_length=50, default='participant', null=False, blank=False)
    def __str__(self) -> str:
        return self.board.title[0:50]   

class UserProfile(models.Model):
    class Meta:
        verbose_name_plural = 'Информация о пользователе'
    id = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, related_name="user", on_delete=models.CASCADE)
    avatar = models.CharField(max_length=150, null=False, blank=False)
    board_like = models.ManyToManyField(Board, related_name="board", blank=True)
    rights = models.ManyToManyField(Rights, related_name="rights", blank=True)
    def __str__(self) -> str:
        return self.user.email[0:50]   


class Invitation(models.Model):
    class Meta:
        verbose_name_plural = 'Приглашения'
    inviter = models.ForeignKey(User, related_name='inviter', on_delete=models.CASCADE)
    invitee = models.ForeignKey(User, related_name='invitee', on_delete=models.CASCADE)
    board = models.ForeignKey(Board, related_name='board_invite', on_delete=models.CASCADE)
    status = models.CharField(max_length=20, default='pending')  # Может быть 'pending', 'accepted' или 'rejected'
    is_read = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)  # Поле для хранения времени отправки приглашения

    def __str__(self) -> str:
        return self.inviter.email[0:50] + " -> " + self.invitee.email[0:50]

class Table(models.Model):
    class Meta:
        verbose_name_plural = 'Таблицы'
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=50)
    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name='items')
    position = models.PositiveIntegerField()
    def __str__(self) -> str:
        return self.title[0:50]
    
class Item(models.Model):
    class Meta:
        verbose_name_plural = 'Элементы таблицы'
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=1000)
    members = models.ManyToManyField(User, related_name='users', blank=True)
    comment = models.TextField(null=True, blank=True)
    position = models.PositiveIntegerField()
    table = models.ForeignKey(Table, on_delete=models.CASCADE, related_name='table')
    def __str__(self) -> str:
        return self.title[0:50]



class Investment(models.Model):
    class Meta:
        verbose_name_plural = 'Вложения'
    id = models.AutoField(primary_key=True)
    document = models.FileField(upload_to='frontend_notes/src/assets', null=True, blank=True)
    site = models.CharField(max_length=1000, default=None, null=True, blank=True)
    item = models.ForeignKey(Item, related_name="investment", on_delete=models.CASCADE) # обновленная связь
    timestamp = models.DateTimeField(auto_now_add=True)  # Поле для хранения времени отправки приглашения
    extension = models.CharField(max_length=100)
    active = models.BooleanField(default=False)
    def __str__(self) -> str:
        return self.item.title[0:50]

    
class Tag(models.Model):
    class Meta:
        verbose_name_plural = 'Тэги на элементе'
    id = models.AutoField(primary_key=True)
    text = models.CharField(max_length=100)
    color = models.CharField(max_length=100)
    item = models.ManyToManyField(Item, related_name="tag", blank=True) # много тэгов могут ссылаться на много элементов
    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name="tags")
    def __str__(self) -> str:
        return self.text[0:50]
    

class Date(models.Model):
    class Meta:
        verbose_name_plural = 'Дата на элементе'
    id = models.AutoField(primary_key=True)
    date = models.DateTimeField(auto_now_add=False, auto_now=False)
    complete = models.BooleanField(default=False)
    item = models.OneToOneField(Item, on_delete=models.CASCADE, related_name="datepicker") # 1 дата может ссылаться на 1 элемент
    def __str__(self) -> str:
        return str(self.date)