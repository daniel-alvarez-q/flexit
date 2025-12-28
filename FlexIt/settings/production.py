from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

ALLOWED_HOSTS = ["*"]

DATABASES = {
    'default': {
        'ENGINE': os.getenv('DB_ENGINE'),
        'HOST':os.getenv('DB_HOST_DOCKER'),
        'PORT':os.getenv('DB_PORT'),
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD':os.getenv('DB_PASSWORD'),
        'OPTIONS': {
            'driver': 'ODBC Driver 17 for SQL Server'
        } 
    }
}