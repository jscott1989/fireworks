from django.shortcuts import render
import json
from . import models
from django.db.models import Count
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import random
from django.conf import settings
from django.core.files import File
from django.core.files.temp import NamedTemporaryFile
from urllib.request import urlopen

def index(request):
    sofar = models.Character.objects.filter(complete=True).count()
    data = {
        "text": {
            "sofar": sofar
        },
        "image": {},
        "sound": {}
        }
    lowest_children = [l for l in models.Character.objects.filter(complete=True).annotate(num_children=Count('children')).order_by("num_children")]

    def default(category, key, value):
        if key not in data[category]:
            data[category][key] = value

    # The lowest will be come our parent
    
    if len(lowest_children) > 0:
        parent = lowest_children.pop(0)
        data["parent"] = parent.pk

        default("text", "parent_skin_color", parent.texts.get(key="my_skin_color").value)
        default("text", "parent_eye_color", parent.texts.get(key="my_eye_color").value)
        default("text", "parent_clothes_color", parent.texts.get(key="my_clothes_color").value)
        default("text", "parent_eye_number", parent.texts.get(key="my_eye_number").value)
        default("text", "parent_ear_number", parent.texts.get(key="my_ear_number").value)
        default("text", "parent_nose_number", parent.texts.get(key="my_nose_number").value)
        default("text", "parent_mouth_number", parent.texts.get(key="my_mouth_number").value)
        default("text", "parent_accessories_number", parent.texts.get(key="my_accessories_number").value)
        default("image", "parent_hair", parent.images.get(key="hair").image.url)

        default("text", "partner_skin_color", parent.texts.get(key="partner_skin_color").value)
        default("text", "partner_eye_color", parent.texts.get(key="partner_eye_color").value)
        default("text", "partner_clothes_color", parent.texts.get(key="partner_clothes_color").value)
        default("text", "partner_eye_number", parent.texts.get(key="partner_eye_number").value)
        default("text", "partner_ear_number", parent.texts.get(key="partner_ear_number").value)
        default("text", "partner_nose_number", parent.texts.get(key="partner_nose_number").value)
        default("text", "partner_mouth_number", parent.texts.get(key="partner_mouth_number").value)
        default("text", "partner_accessories_number", parent.texts.get(key="partner_accessories_number").value)
        default("image", "partner_hair", parent.images.get(key="partner_hair").image.url)

        default("text", "skin_color", parent.texts.get(key="partner_skin_color").value)
        default("text", "eye_color", parent.texts.get(key="partner_eye_color").value)
        default("text", "clothes_color", parent.texts.get(key="clothes_color").value)
        default("text", "eye_number", parent.texts.get(key="child_eye_number").value)
        default("text", "ear_number", parent.texts.get(key="child_ear_number").value)
        default("text", "nose_number", parent.texts.get(key="child_nose_number").value)
        default("text", "mouth_number", parent.texts.get(key="child_mouth_number").value)
        default("text", "accessories_number", parent.texts.get(key="child_accessories_number").value)

        default("image", "wallpaper", parent.images.get(key="wallpaper").image.url)
        default("text", "parent_name", parent.texts.get(key="my_name").value)
        default("text", "partner_name", parent.texts.get(key="partner_name").value)
        default("text", "name", parent.texts.get(key="name").value)

        default("sound", "parent_name", parent.sounds.get(key="my_name").sound.url)
        default("sound", "parent_greeting", parent.sounds.get(key="greeting").sound.url)
        default("sound", "parent_cry", parent.sounds.get(key="cry").sound.url)
        default("sound", "partner_name", parent.sounds.get(key="partner_name").sound.url)
        default("sound", "partner_greeting", parent.sounds.get(key="partner_greeting").sound.url)
        default("sound", "partner_cry", parent.sounds.get(key="partner_cry").sound.url)
        default("sound", "name", parent.sounds.get(key="name").sound.url)

        default("image", "blackboard", parent.images.get(key="blackboard").image.url)
        default("sound", "music", parent.sounds.get(key="song").sound.url)

    roles_to_fill = ["friend3", "friend4", "friend1", "friend2", "friend5", "friend6", "friend7", "friend8", "teacher"]

    while (len(roles_to_fill) > 0 and len(lowest_children) > 0):
        next_role = roles_to_fill.pop(0)
        person = lowest_children.pop(0)
        default("text", "%s_name" % (next_role), person.texts.get(key="my_name").value)
        default("sound", "%s_name" % (next_role), person.sounds.get(key="my_name").sound.url)
        default("text", "%s_skin_color" % (next_role), person.texts.get(key="my_skin_color").value)
        default("text", "%s_eye_color" % (next_role), person.texts.get(key="my_eye_color").value)
        default("text", "%s_clothes_color" % (next_role), person.texts.get(key="my_clothes_color").value)
        default("text", "%s_eye_number" % (next_role), person.texts.get(key="my_eye_number").value)
        default("text", "%s_ear_number" % (next_role), person.texts.get(key="my_ear_number").value)
        default("text", "%s_nose_number" % (next_role), person.texts.get(key="my_nose_number").value)
        default("text", "%s_mouth_number" % (next_role), person.texts.get(key="my_mouth_number").value)
        default("text", "%s_accessories_number" % (next_role), person.texts.get(key="my_accessories_number").value)
        default("image", "%s_hair" % (next_role), person.images.get(key="hair").image.url)
        default("sound", "%s_kiss" % (next_role), person.sounds.get(key="kiss").sound.url)
        default("sound", "%s_cry" % (next_role), person.sounds.get(key="cry").sound.url)
        default("sound", "%s_bump" % (next_role), person.sounds.get(key="bump").sound.url)
        default("sound", "%s_greeting" % (next_role), person.sounds.get(key="greeting").sound.url)


    #     lowest_children_count = lowest_children.children.count()

    #     all_lowest_children = [x for x in models.Character.objects.filter(complete=True).annotate(num_children=Count('children')).filter(num_children=lowest_children_count).all()]
    #     c = random.choice(all_lowest_children)
    #     data["parent"] = c.pk
    #     # "parent": c.pk,
    #     # "text": {i.key: i.value for i in c.texts.all()},
    #     # "image": {i.key: settings.MEDIA_URL + str(i.image) for i in c.images.all()},
    #     # "sound": {i.key: settings.MEDIA_URL + str(i.sound) for i in c.sounds.all()}

    #     # Now we push extra information into the data for use by the story
    #     data["text"]["sofar"] = sofar

    # Now we must fill in blank information


    SKIN_COLORS = ["#8d5524", "#c68642", "#e0ac69", "#f1c27d", "#ffdbac"]
    EYE_COLORS = ["#1907ba", "#776536", "#76c4ae", "#6ca580"]
    CLOTHES_COLORS = ["#2BACBB", "#E4266F", "#151928", "#E2BC03", "#89B8FF"]
    EYE_NUMBERS = range(0, 5)
    EAR_NUMBERS = range(0, 5)
    NOSE_NUMBERS = range(0, 5)
    MOUTH_NUMBERS = range(0, 5)
    ACCESSORIES_NUMBERS = range(0, 5)
    HAIRS = ["/s/assets/demo/hair/boy1.png", "/s/assets/demo/hair/boy2.png", "/s/assets/demo/hair/boy3.png",
             "/s/assets/demo/hair/girlponytail1.png", "/s/assets/demo/hair/girlponytail2.png", "/s/assets/demo/hair/girlponytail3.png",
             "/s/assets/demo/hair/shorthair1.png", "/s/assets/demo/hair/shorthair2.png", "/s/assets/demo/hair/shorthair3.png",
             "/s/assets/demo/hair/spikyhair1.png", "/s/assets/demo/hair/spikyhair2.png"]
    BLACKBOARDS = ["/s/assets/demo/blackboard/scribble1.png", "/s/assets/demo/blackboard/scribble2.png"]
    GRAVESTONES = ["/s/assets/demo/gravestones/gravestone1.png", "/s/assets/demo/gravestones/gravestone2.png", "/s/assets/demo/gravestones/gravestone3.png", "/s/assets/demo/gravestones/gravestone4.png"]

    # Baby
    default("text", "skin_color", "#8d5524")
    default("text", "eye_color", "#1907ba")
    default("text", "clothes_color", "#2BACBB")
    default("text", "eye_number", 0)
    default("text", "ear_number", 0)
    default("text", "nose_number", 0)
    default("text", "mouth_number", 0)
    default("text", "accessories_number", 0)

    # Parents

    default("text", "parent_skin_color", "#8d5524")
    default("text", "parent_eye_color", "#1907ba")
    default("text", "parent_clothes_color", "#151928")
    default("text", "parent_eye_number", 2)
    default("text", "parent_ear_number", 2)
    default("text", "parent_nose_number", 2)
    default("text", "parent_mouth_number", 2)
    default("text", "parent_accessories_number", 2)
    default("image", "parent_hair", "/s/assets/demo/hair/boy1.png")

    default("text", "partner_skin_color", "#c68642")
    default("text", "partner_eye_color", "#776536")
    default("text", "partner_clothes_color", "#E4266F")
    default("text", "partner_eye_number", 1)
    default("text", "partner_ear_number", 1)
    default("text", "partner_nose_number", 1)
    default("text", "partner_mouth_number", 1)
    default("text", "partner_accessories_number", 1)
    default("image", "partner_hair", "/s/assets/demo/hair/boy2.png")

    # Done to here

    # Friends
    friend_names = ["Chris", "Charlie", "Jamie", "Skyler", "Justice", "Dakota", "Lennon", "Rowan", "Hunter", "Harper", "Dylan", "Jordyn", "Blake"]
    random.shuffle(friend_names)
    for i in range(1, 9):
        name = friend_names.pop()
        default("text", "friend%s_name" % i, name)
        default("sound", "friend%s_name" % i, "/s/assets/demo/%s.mp3" % name)
        default("text", "friend%s_skin_color" % i, random.choice(SKIN_COLORS))
        default("text", "friend%s_eye_color" % i, random.choice(EYE_COLORS))
        default("text", "friend%s_clothes_color" % i, random.choice(CLOTHES_COLORS))
        default("text", "friend%s_eye_number" % i, random.choice(EYE_NUMBERS))
        default("text", "friend%s_ear_number" % i, random.choice(EAR_NUMBERS))
        default("text", "friend%s_nose_number" % i, random.choice(NOSE_NUMBERS))
        default("text", "friend%s_mouth_number" % i, random.choice(MOUTH_NUMBERS))
        default("text", "friend%s_accessories_number" % i, random.choice(ACCESSORIES_NUMBERS))
        default("image", "friend%s_hair" % i, random.choice(HAIRS))
        default("sound", "friend%s_kiss" % i, "/s/assets/demo/kiss.mp3")
        default("sound", "friend%s_cry" % i, "/s/assets/demo/cry.mp3")
        default("sound", "friend%s_bump" % i, "/s/assets/demo/bump.mp3")
        default("sound", "friend%s_greeting" % i, "/s/assets/demo/greeting.mp3")

    # Teacher
    default("text", "teacher_skin_color", random.choice(SKIN_COLORS))
    default("text", "teacher_eye_color", random.choice(EYE_COLORS))
    default("text", "teacher_clothes_color", random.choice(CLOTHES_COLORS))
    default("text", "teacher_eye_number", random.choice(EYE_NUMBERS))
    default("text", "teacher_ear_number", random.choice(EAR_NUMBERS))
    default("text", "teacher_nose_number", random.choice(NOSE_NUMBERS))
    default("text", "teacher_mouth_number", random.choice(MOUTH_NUMBERS))
    default("text", "teacher_accessories_number", random.choice(ACCESSORIES_NUMBERS))
    default("image", "teacher_hair", random.choice(HAIRS))

    # Bedroom

    default("image", "wallpaper", "/s/assets/demo/wallpaper.png")
    default("text", "parent_name", "Jonny")
    default("text", "partner_name", "Xiyun")
    default("text", "name", "Jamie")

    default("sound", "parent_name", "/s/assets/narration/jonny.mp3")
    default("sound", "parent_greeting", "/s/assets/narration/jonny_greeting.mp3")
    default("sound", "parent_cry", "/s/assets/narration/jonny_cry.mp3")
    default("sound", "partner_name", "/s/assets/narration/xiyun.mp3")
    default("sound", "partner_greeting", "/s/assets/narration/xiyun_greeting.mp3")
    default("sound", "partner_cry", "/s/assets/narration/xiyun_cry.mp3")
    default("sound", "name", "/s/assets/narration/jamie.mp3")

    # Children's room

    default("image", "friends_toy1", "/s/assets/demo/toys/toy_1.png")
    default("image", "friends_toy2", "/s/assets/demo/toys/toy_1.png")

    # School

    default("image", "blackboard", random.choice(BLACKBOARDS))
    default("sound", "music", "/s/assets/narration/jonny_music.mp3")

    # Graveyard
    default("image", "friends_gravestone1", random.choice(GRAVESTONES))
    default("image", "friends_gravestone2", random.choice(GRAVESTONES))
    default("image", "partner_gravestone", random.choice(GRAVESTONES))

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
def setimage(request, uploadid):
    c = models.Character.objects.get(pk=uploadid)

    im = models.Image(character=c, key=request.POST['key'])

    url = request.POST['value']
    if not url.startswith("http"):
        url = settings.ROOT_URL + url

    img_temp = NamedTemporaryFile(delete=True)
    img_temp.write(urlopen(url).read())
    img_temp.flush()

    im.save()
    im.image.save("tmp.png", img_temp)
    return JsonResponse({})

@csrf_exempt
def setsound(request, uploadid):
    c = models.Character.objects.get(pk=uploadid)

    im = models.Sound(character=c, key=request.POST['key'])

    url = request.POST['value']
    print(url)
    if not url.startswith("http"):
        url = settings.ROOT_URL + url
        print("Add",url)

    img_temp = NamedTemporaryFile(delete=True)
    img_temp.write(urlopen(url).read())
    img_temp.flush()

    im.save()
    im.sound.save("tmp.webm", img_temp)
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
