from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token

from api.views import LogoutView

app_name = 'api'

url_patterns = [
    path('login/', obtain_auth_token, name='index'),
    path('logout/', LogoutView.as_view(), name='logout')
]