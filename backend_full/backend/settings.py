import os
from pathlib import Path
from datetime import timedelta
import pymysql

pymysql.install_as_MySQLdb()

# ---------------------------------------------------
# BASE SETTINGS
# ---------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-please-change-this-in-production'
DEBUG = True

ALLOWED_HOSTS = [
    '127.0.0.1',
    'localhost',
    '192.168.1.125',  # your local LAN IP
    'www.lioncage.ng',
    'lioncage.ng',
]

# ---------------------------------------------------
# INSTALLED APPS
# ---------------------------------------------------
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # third-party
    'rest_framework',
    'rest_framework.authtoken',
    'rest_framework_simplejwt',
    'corsheaders',

    # local apps
    'realty',
    'gallery',
    'adminpanel',
    'contact',
]

# ---------------------------------------------------
# MIDDLEWARE
# ---------------------------------------------------
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # must be before CommonMiddleware
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# ---------------------------------------------------
# CORS & CSRF SETTINGS
# ---------------------------------------------------
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "https://www.lioncage.ng",
    "https://lioncage.ng",
]

CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "https://www.lioncage.ng",
    "https://lioncage.ng",
]

CORS_ALLOW_HEADERS = [
    "authorization",
    "content-type",
    "x-csrftoken",
]

# ---------------------------------------------------
# URLS / WSGI
# ---------------------------------------------------
ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# ---------------------------------------------------
# DATABASE
# ---------------------------------------------------
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'brickly_blog',
        'USER': 'root',
        'PASSWORD': '@Mysql001',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}

# ---------------------------------------------------
# PASSWORD VALIDATION
# ---------------------------------------------------
AUTH_PASSWORD_VALIDATORS = []

# ---------------------------------------------------
# INTERNATIONALIZATION
# ---------------------------------------------------
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ---------------------------------------------------
# STATIC & MEDIA FILES
# ---------------------------------------------------
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ---------------------------------------------------
# REST FRAMEWORK CONFIG
# ---------------------------------------------------
REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ),
    'DEFAULT_PARSER_CLASSES': (
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.FormParser',
        'rest_framework.parsers.MultiPartParser',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

# ---------------------------------------------------
# CUSTOM USER MODEL
# ---------------------------------------------------
AUTH_USER_MODEL = "adminpanel.Admin"

# ---------------------------------------------------
# JWT SETTINGS
# ---------------------------------------------------
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
}

# ---------------------------------------------------
# EMAIL SETTINGS (Gmail SMTP)
# ---------------------------------------------------
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = "danmasani12@gmail.com"
EMAIL_HOST_PASSWORD = "llmywmjurgxtymun"  # Gmail App Password
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
