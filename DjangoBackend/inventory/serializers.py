from rest_framework import serializers
from .models import Item,Vendor

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'
    


class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model=Vendor
        fields = ['shop_name', 'owner_name', 'contact', 'GST', 'address']
