from django.db import models

QUOTE_NEW = 'new'
QUETE_VERIFIED = 'verified'
QUETE_STATUS_CHOICES = (
    (QUOTE_NEW, 'Новая'),
    (QUETE_VERIFIED, 'Проверена')
)

class Quote(models.Model):
    text = models.TextField(max_length=1000, verbose_name='Цитата')
    author = models.CharField(max_length=100, verbose_name='Автор цитаты')
    create = models.DateTimeField(auto_now_add=True, verbose_name='Дата добавления')
    status = models. CharField(max_length=20, choices=QUETE_STATUS_CHOICES, default=QUOTE_NEW, verbose_name='Статус')
    email = models.EmailField(verbose_name='Email')
    raiting =models.IntegerField(default=0, verbose_name='Рейтинг цитаты')

    def __str__(self):
        return self.text[:20] + '...'

    class Meta:
        verbose_name = 'Цитата'
        verbose_name_plural = 'Цитаты'