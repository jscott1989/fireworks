from django.shortcuts import render
import json
from . import models
from django.db.models import Count
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import random


def index(request):
    # TODO: Select the character that has the fewest children
    # (or if there's more than one, one at random from those)
    if (models.Character.objects.filter(complete=True).count() > 0):
        # Find the lowest number of children
        lowest_children = models.Character.objects.filter(complete=True).annotate(num_children=Count('children')).order_by("num_children").first()
        lowest_children_count = lowest_children.children.count()

        all_lowest_children = [x for x in models.Character.objects.filter(complete=True).annotate(num_children=Count('children')).filter(num_children=lowest_children_count).all()]
        c = random.choice(all_lowest_children)
        data = {
            "parent": c.pk,
            "text": {i.key: i.value for i in c.texts.all()},
            "image": {i.key: "/m/" + str(i.image) for i in c.images.all()},
            "sound": {i.key: "/m/" + str(i.sound) for i in c.sounds.all()}
        }
    else:
        data = {
            "text": {},
            "image": {},
            "sound": {}
        }
    return render(request, "index.html", {"data": json.dumps(data)})


@csrf_exempt
def startupload(request):
    """Store the text, and return an upload ID."""
    if "parent" in request.POST:
        parent = models.Character.objects.get(pk=request.POST["parent"])
    else:
        parent = None
    c = models.Character(parent=parent)
    c.save()
    for k, v in json.loads(request.POST["text"]).items():
        models.Text(character=c, key=k, value=v).save()
    return JsonResponse({"id": c.pk})


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
