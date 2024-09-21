from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated
from .models import User
import jwt,datetime
from django.http import HttpResponse
# from DjangoBackend import settings
from django.contrib.auth.models import User
from django.conf import settings
from django.core.management import call_command
import pymongo
import re
from django.contrib.auth import get_user_model
User = get_user_model()
class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']

        user = User.objects.filter(email=email).first()

        if user is None:
            raise AuthenticationFailed('User not found')

        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password')

        pd ={
            'id':user.id,
            'exp': datetime.datetime.utcnow()+ datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow(),
        }
        token = jwt.encode(pd,'secret', algorithm='HS256')

        response=Response()
        response.set_cookie('UserToken', token,httponly=True, samesite='None', secure=True)
        response.data = {
            "token": token,
        }
        return response



class UserView(APIView):
    def get(self, request):
        token =request.COOKIES.get('UserToken')
        if not token:
            raise AuthenticationFailed('Token not found')

        try:
            pd = jwt.decode(token,'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token not valid')

        user = User.objects.filter(id=pd['id']).first()
        serializer = UserSerializer(user)
        return Response(serializer.data)


class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('UserToken')
        response.data={
            'massage': 'Logout successful'
        }
        return response
