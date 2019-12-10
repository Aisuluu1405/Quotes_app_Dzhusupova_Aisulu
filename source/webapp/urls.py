from django.urls import path
from webapp.views import IndexView

app_name = 'webapp'

url_patterns = [
    path('', IndexView.as_view(), name='index')
]