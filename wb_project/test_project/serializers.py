from rest_framework import serializers
from test_project.models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'sale_price', 'rating', 'reviews_count']
        