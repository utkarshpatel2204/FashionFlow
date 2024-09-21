from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated
from .models import User
import jwt,datetime
from django.http import HttpResponse
# from clothing_inventory import settings
from django.contrib.auth.models import User
from django.conf import settings
from django.core.management import call_command
import pymongo
import re
from django.contrib.auth import get_user_model
User = get_user_model()
class RegisterView(APIView):
    def post(self, request):
        # Deserialize the incoming user data
        serializer = UserSerializer(data=request.data)

        # Validate the serializer
        serializer.is_valid(raise_exception=True)

        # Save the user to the default database
        user = serializer.save()
        # Create a separate MongoDB database for this user
        create_user_database(serializer.data['email'])

        # Migrate all models to the new database
        migrate_to_user_database(serializer.data['email'])

        # Return the user data
        return Response(serializer.data, status=status.HTTP_201_CREATED)


def create_user_database(username):
    """
    Function to create a new MongoDB database for the user.
    """
    # Sanitize the username to create a valid MongoDB database name
    sanitized_username = sanitize_for_mongo(username)

    # Connect to MongoDB using the connection details from settings.py
    client = pymongo.MongoClient(
        host=settings.DATABASES['default']['CLIENT']['host'],
        
    )

    # Create a new database for the user
    user_db_name = f"{sanitized_username}_db"
    client[user_db_name]  # This line will create the database if it does not exist
    print(f"Database {user_db_name} created for user {username}.")


def sanitize_for_mongo(name):
    """
    Function to sanitize a string to be a valid MongoDB database name.
    """
    # Replace all invalid characters with an underscore
    sanitized_name = re.sub(r'[^\w]', '_', name)
    return sanitized_name


def migrate_to_user_database(username):
    """
    Function to run migrations on the newly created database.
    """
    sanitized_username = sanitize_for_mongo(username)
    user_db_name = f"{sanitized_username}_db"

    # Dynamically add the new database to Django settings
    settings.DATABASES[user_db_name] = {
        'ENGINE': 'djongo',
        'NAME': user_db_name,
        
        'TIME_ZONE': settings.DATABASES['default'].get('TIME_ZONE', 'UTC'),
        'OPTIONS': settings.DATABASES['default'].get('OPTIONS', {}),
        'CONN_HEALTH_CHECKS': settings.DATABASES['default'].get('CONN_HEALTH_CHECKS', False),
        'CONN_MAX_AGE': settings.DATABASES['default'].get('CONN_MAX_AGE', 0),
        'AUTOCOMMIT': settings.DATABASES['default'].get('AUTOCOMMIT', True),
        'ATOMIC_REQUESTS': settings.DATABASES['default'].get('ATOMIC_REQUESTS', False),
    }

    # Apply migrations to the new database
    call_command('migrate', 'stock',  database=user_db_name)
    print(f"All models migrated to database {user_db_name}.")


class LoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']

        user = User.objects.filter(email=email).first()

        if user is None:
            raise AuthenticationFailed('User not found')

        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password')

        payload ={
            'id':user.id,
            'exp': datetime.datetime.utcnow()+ datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow(),
        }
        token = jwt.encode(payload,settings.SECRET_KEY, algorithm='HS256')

        response=Response()
        # response = HttpResponse('blah')
        print(token)
        response.set_cookie('jwt', token,httponly=True, samesite='None', secure=True)
        response.data = {
            "token": token,
        }
        print(response.data)
        return response



class UserView(APIView):

    def get(self, request):
        # print(request.headers)
        # print(request.COOKIES)
        token =request.COOKIES.get('jwt')
        # print(token)
        if not token:
            raise AuthenticationFailed('Token not found')

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            # print(payload)
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token not valid')
        # print(payload)
        user = User.objects.filter(id=payload['id']).first()
        # print(User.objects.all())
        # print(user)
        serializer = UserSerializer(user)
        # print(serializer.data)
        # print(serializer)
        return Response(serializer.data)


class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')

        response.data={
            'massage': 'Logout successful'
        }
        return response
