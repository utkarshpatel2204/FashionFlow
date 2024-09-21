from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductView, OrderViewSet, ViewStockView,VendorView,ViewVendorView

urlpatterns = [
    path('additems/',ProductView.as_view() ),
    path('viewstock',ViewStockView.as_view() ),
    path('addvendors',VendorView.as_view() ),
    path('viewvendors',ViewVendorView.as_view() ),
   
    
]
