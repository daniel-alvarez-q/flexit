from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

DATABASES = {
    'default': {
        'ENGINE': os.getenv('DB_ENGINE'),
        'HOST':os.getenv('DB_HOST'),
        'PORT':os.getenv('DB_PORT'),
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD':os.getenv('DB_PASSWORD'),
        'OPTIONS': {
            'driver': 'ODBC Driver 17 for SQL Server'
        } 
    }
}
