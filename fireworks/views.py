from django.shortcuts import render
import json


def index(request):
    data = {
        "text": {
            "name": "Jonny"
        },
        "image": {},
        "sound": {
            "name": "/s/assets/narration/jonny.wav"
        }
    }
    return render(request, "index.html", {"data": json.dumps(data)})
