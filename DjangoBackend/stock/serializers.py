from rest_framework import serializers
from .models import Product, Order,Vendor

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['design_no', 'total_set', 'color', 'price', 'image']
    

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'


class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model=Vendor
        fields = ['shop_name', 'owner_name', 'contact', 'GST', 'address']
