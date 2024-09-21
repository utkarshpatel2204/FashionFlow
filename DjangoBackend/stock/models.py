from django.db import models

# Create your models here.


class Product(models.Model):
    design_no = models.CharField(max_length=100,unique=True)
    total_set = models.IntegerField()
    color = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='product_images')
    

class Order(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    status = models.CharField(max_length=50, default='Pending')
    date_ordered = models.DateTimeField(auto_now_add=True)

class Vendor(models.Model):
    shop_name=models.CharField(max_length=150)
    owner_name=models.CharField(max_length=150)
    contact=models.CharField(max_length=100)
    GST=models.CharField(max_length=150,unique=True)
    address=models.TextField()