from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/realty/', include('realty.urls')),
    path('api/gallery/', include('gallery.urls')),
    path('api/admin/', include('adminpanel.urls')),
    path('api/', include('contact.urls')),


]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
