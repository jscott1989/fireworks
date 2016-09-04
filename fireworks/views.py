from django.shortcuts import render
import json
from . import models
from django.db.models import Count
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import random
from django.conf import settings


def index(request):
    sofar = models.Character.objects.filter(complete=True).count()
    if (sofar > 0):
        # Find the lowest number of children
        lowest_children = models.Character.objects.filter(complete=True).annotate(num_children=Count('children')).order_by("num_children").first()
        lowest_children_count = lowest_children.children.count()

        all_lowest_children = [x for x in models.Character.objects.filter(complete=True).annotate(num_children=Count('children')).filter(num_children=lowest_children_count).all()]
        c = random.choice(all_lowest_children)
        data = {
            "parent": c.pk,
            "text": {i.key: i.value for i in c.texts.all()},
            "image": {i.key: settings.MEDIA_URL + str(i.image) for i in c.images.all()},
            "sound": {i.key: settings.MEDIA_URL + str(i.sound) for i in c.sounds.all()}
        }

        # Now we push extra information into the data for use by the story
        data["text"]["sofar"] = sofar
    else:
        data = {
            "text": {},
            "image": {},
            "sound": {}
        }
    return render(request, "index.html", {"data": json.dumps(data)})


@csrf_exempt
def startupload(request):
    """Return an upload ID."""
    if "parent" in request.POST:
        parent = models.Character.objects.get(pk=request.POST["parent"])
    else:
        parent = None
    c = models.Character(parent=parent)
    c.save()
    return JsonResponse({"id": c.pk})


@csrf_exempt
def uploadtext(request, uploadid):
    """Store text."""
    c = models.Character.objects.get(pk=uploadid)
    models.Text(character=c, key=request.POST['key'], value=request.POST['value']).save()
    return JsonResponse({})


@csrf_exempt
def uploadimage(request, uploadid):
    c = models.Character.objects.get(pk=uploadid)

    models.Image(character=c,
                 key=request.POST['key'],
                 image=request.FILES['data']).save()
    return JsonResponse({})


@csrf_exempt
def uploadsound(request, uploadid):
    c = models.Character.objects.get(pk=uploadid)

    models.Sound(character=c,
                 key=request.POST['key'],
                 sound=request.FILES['data']).save()
    return JsonResponse({})


@csrf_exempt
def markcomplete(request, uploadid):
    c = models.Character.objects.get(pk=uploadid)

    c.complete = True
    c.save()
    return JsonResponse({})
