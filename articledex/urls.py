"""articledex URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
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
from django.contrib import admin
from django.conf import settings
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('accounts.urls')),
    path('api/articles/', include('articles.urls')),
    path('api/token/', TokenRefreshView.as_view(), name='token_refresh_view'),
    path('service-worker.js', TemplateView.as_view(template_name='service-worker.js', 
    content_type='application/javascript'), name='service-worker.js'),
    path('manifest.json', TemplateView.as_view(template_name='manifest.json', 
    content_type='application/json'), name='manifest.json'),
    re_path('(^(?!(api|admin)).*$)',
            TemplateView.as_view(template_name='index.html'))
] 
