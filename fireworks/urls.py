"""fireworks URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from . import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^info$', views.info, name='info'),
    url(r'^detail/(?P<pk>.+)$', views.detail, name='detail'),
    url(r'^block/(?P<pk>.+)$', views.block, name='block'),
    url(r'^newplayer$', views.startupload, name='startupload'),
    url(r'^image/(?P<uploadid>.+)$', views.uploadimage,
        name='uploadimage'),
    url(r'^setImage/(?P<uploadid>.+)$', views.setimage,
        name='setimage'),
    url(r'^sound/(?P<uploadid>.+)$', views.uploadsound,
        name='uploadsound'),
    url(r'^setSound/(?P<uploadid>.+)$', views.setsound,
        name='setsound'),
    url(r'^text/(?P<uploadid>.+)$', views.uploadtext,
        name='uploadtext'),
    url(r'^complete/(?P<uploadid>.+)$', views.markcomplete,
        name='markcomplete')
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
