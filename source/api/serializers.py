from rest_framework import serializers

from webapp.models import Quote


class QuoteSerializer(serializers.ModelSerializer):
    create = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Quote
        fields = ['id', 'text', 'author', 'status', 'create', 'email', 'raiting']

