from .models import Item, Vendor
from .serializers import ItemSerializer, VendorSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class ProductView(APIView):
    def post(self, request):
        print(request.data)
        print(request.FILES)
        print(request.data.get('item_name'))
        serializer = ItemSerializer(
            data={'email': request.data.get('email'), 'item_name': request.data.get('item_name'), 'total_quantity': 0,
                  'category': request.data.get('category'), 'price': int(request.data.get('price')),
                  'image': request.FILES.get('image')})

        print(serializer.is_valid())
        if serializer.is_valid():
            try:
                serializer.save()  # Save to the specific user's database

                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ViewStockView(APIView):
    def get(self, request):
        """
        Fetch all products from the specific user's database.
        """
        user_email = request.query_params.get('email')  # Get user email from query parameters
        if not user_email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch all products from the specific user's database
            item = Item.objects.filter(email=user_email)
            serializer = ItemSerializer(item, many=True)
            print(serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VendorView(APIView):
    def post(self, request):
        print(request.data)
        print(request.data.get('contact'))
        print(request.data.get('email'))
        serializer = VendorSerializer(
            data={'email': request.data.get('email'), 'shop_name': request.data.get('shop_name'),
                  'owner_name': request.data.get('owner_name'),
                  'contact': request.data.get('contact'),
                  'GST': request.data.get('GST'), 'address': request.data.get('address')})
        # print(settings.DATABASES)
        # print(serializer.data)
        print(serializer.is_valid())
        print(serializer.errors)
        if serializer.is_valid():
            try:

                serializer.save()

                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ViewVendorView(APIView):
    def get(self, request):
        """
        Fetch all products from the specific user's database.
        """
        user_email = request.query_params.get('email')  # Get user email from query parameters
        if not user_email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            vendors = Vendor.objects.filter(email=user_email)
            print(vendors)
            serializer = VendorSerializer(vendors, many=True)
            print(serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



