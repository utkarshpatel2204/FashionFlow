from .models import Item, Vendor,Purchase,Sells
from .serializers import ItemSerializer, VendorSerializer,SellSerializer,PurchaseSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class ItemView(APIView):
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


class ViewItems(APIView):
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


class UpdateItemView(APIView):
    def post(self, request):
        print(request.data)
        item_name = request.data.get('item_name')
        try:
            item = Item.objects.filter(item_name=item_name)
            serializer = ItemSerializer(item, data=request.data)
            total_quantity = int(request.data.get('total_quantity', 0))
            serializer.data[0]['total_quantity'] += total_quantity
            Item.objects.filter(item_name=item_name).update(total_quantity=serializer.data[0]['total_quantity'])
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Design No. not exist'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AddSellView(APIView):
    def post(self, request):
        serializer = SellSerializer(data={'email': request.data.get('email'),'shop_name': request.data.get('shop_name'),
                                             'vendor_details': request.data.get('vendor_details'),
                                             'date': request.data.get('date'),
                                             'sellsList': request.data.get('sellsList'),
                                            'total_price': request.data.get('total_price'),
                                             })
        if serializer.is_valid():
            try:
                serializer.save()  # Save to the specific user's database
                return removeOrderListItemsFromStock(request.data.get('sellsList'), request.data.get('email'))
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def removeSellItemsFromStock(Sell,user_db_name):
    for item in Sell:
        try:
            print(item)
            print(item['item_name'])
            product = Product.objects.using(user_db_name).filter(item_name=item['item_name'])
            print(product)
            serializer = ItemSerializer(product, many=True)
            print(serializer.data)
            # Calculate the new total_pieces value
            total_quantity = int(item['quantity'])
            print(total_quantity)
            serializer.data[0]['total_quantity'] -= total_quantity  # Add the new total set to the existing total_pieces

            Item.objects.filter(item_name=item['item_name']).update(total_quantity=serializer.data[0]['total_quantity'])

        except Exception :
            return Response({'error': 'Design No. not exist'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response('item updated..', status=status.HTTP_200_OK)



class AddPurchaseView(APIView):
    def post(self, request):
        serializer =PurchaseSerializer(data={'email': request.data.get('email'),'shop_name': request.data.get('shop_name'),
                                             'vendor_details': request.data.get('vendor_details'),
                                             'date': request.data.get('date'),
                                             'purchaseList': request.data.get('purchaseList'),
                                            'total_price': request.data.get('total_price'),
                                             })

        if serializer.is_valid():

            try:
                serializer.save()  # Save to the specific user's database
                return Response('Purchase updated..', status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetPurchaseView(APIView):
    def get(self, request):
        user_email = request.query_params.get('email')  # Get user email from query parameters
        if not user_email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            data = Purchase.objects.filter(email=user_email)
            print(data)

            serializer = PurchaseSerializer(data, many=True)
            print(serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetSellsView(APIView):
    def get(self, request):
        user_email = request.query_params.get('email')  # Get user email from query parameters
        if not user_email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            data = Sells.objects.filter(email=user_email)
            print(data)
            serializer = SellSerializer(data, many=True)
            print(serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

