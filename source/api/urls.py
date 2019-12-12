from django.urls import path, include
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token

from api.views import LogoutView, QuoteViewSet

router = routers.DefaultRouter()
router.register(r'quotes', QuoteViewSet, basename='quotes')

app_name = 'api'

urlpatterns = [
    path('', include(router.urls)),
    path('login/', obtain_auth_token, name='index'),
    path('logout/', LogoutView.as_view(), name='logout'),
]