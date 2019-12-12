from django.shortcuts import get_object_or_404
from rest_framework import viewsets, response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from api.serializers import QuoteSerializer
from webapp.models import Quote, QUETE_VERIFIED


class QuoteViewSet(ModelViewSet):
    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Quote.objects.all()
        return Quote.objects.filter(status=QUETE_VERIFIED)


class LogoutView(APIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        user = self.request.user
        if user.is_authenticated:
            user.auth_token.delete()
        return Response({'status': 'ok'})

