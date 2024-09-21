from django.db import models


# Create your models here.


class Item(models.Model):
    email = models.CharField(max_length=100)
    item_name = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=100)
    total_quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='product_images')


class Vendor(models.Model):
    email = models.CharField(max_length=100)
    shop_name = models.CharField(max_length=150)
    owner_name = models.CharField(max_length=150)
    contact = models.CharField(max_length=100)
    GST = models.CharField(max_length=150, unique=True)
    address = models.TextField()


class Sells(models.Model):
    email = models.CharField(max_length=100)
    shop_name = models.CharField(max_length=150)
    vendor_details = models.JSONField(default=dict)
    date = models.DateField(auto_now=True)
    sellsList = models.JSONField(default=dict)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)


class Purchase(models.Model):
    email = models.CharField(max_length=100)
    shop_name = models.CharField(max_length=150)
    vendor_details = models.JSONField(default=dict)
    date = models.DateField(auto_now=True)
    purchaseList = models.JSONField(default=dict)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)