from rest_framework import serializers
from .models import Item, Vendor, Sells, Purchase


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'
    


class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model=Vendor
        fields = ['shop_name', 'owner_name', 'contact', 'GST', 'address']

class SellSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sells
        fields = '__all__'
class PurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase
        fields = '__all__'