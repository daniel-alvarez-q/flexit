"""
URL configuration for FlexIt project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import path, include
from knox import views as knox_views
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from FlexItAPI import views

urlpatterns = [
    path('api/', include('FlexItAPI.urls')),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("swagger", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path(r'login', views.LoginView.as_view(), name='knox_login'),
    path(r'logout', knox_views.LogoutView.as_view(), name='knox_logout'),
    path(r'logoutall', knox_views.LogoutAllView.as_view(), name='knox_logoutall')
]
