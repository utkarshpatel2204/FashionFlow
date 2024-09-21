from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemView, ViewItems,VendorView,ViewVendorView,AddSellView,UpdateItemView

urlpatterns = [
    path('additems/',ItemView.as_view() ),
    path('viewstock',ViewItems.as_view() ),
    path('addvendors',VendorView.as_view() ),
    path('viewvendors',ViewVendorView.as_view() ),
    path('addsells/',AddSellView.as_view() ),
    path('additemsstock/',UpdateItemView.as_view() ),
]
