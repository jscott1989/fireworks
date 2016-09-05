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
        if key not in data[category] or data[category][key] is None:
            data[category][key] = value

    def get_text(person, key, default=None):
        k = person.texts.get(key=key)
        if not k:
            return default
        return k.value

    def get_image(person, key, default=None):
        k = person.images.filter(key=key).first()
        if not k:
            return default
        return k.image.url

    def get_sound(person, key, default=None):
        k = person.sounds.filter(key=key).first()
        if not k:
            return default
        return k.sound.url

    # The lowest will become our parent

    used_pks = []
    parent = None
    
    if len(lowest_children) > 0:
        parent = lowest_children.pop(0)
        used_pks.append(parent.pk)
        partner_pk = get_text(parent, "partner_pk")
        if partner_pk:
            used_pks.append(int(partner_pk))
        data["parent"] = parent.pk

        default("text", "parent_skin_color", get_text(parent, "my_skin_color"))
        default("text", "parent_eye_color", get_text(parent, "my_eye_color"))
        default("text", "parent_clothes_color", get_text(parent, "my_clothes_color"))
        default("text", "parent_eye_number", get_text(parent, "my_eye_number"))
        default("text", "parent_ear_number", get_text(parent, "my_ear_number"))
        default("text", "parent_nose_number", get_text(parent, "my_nose_number"))
        default("text", "parent_mouth_number", get_text(parent, "my_mouth_number"))
        default("text", "parent_accessories_number", get_text(parent, "my_accessories_number"))
        default("image", "parent_hair", get_image(parent, "hair"))

        default("text", "partner_skin_color", get_text(parent, "partner_skin_color"))
        default("text", "partner_eye_color", get_text(parent, "partner_eye_color"))
        default("text", "partner_clothes_color", get_text(parent, "partner_clothes_color"))
        default("text", "partner_eye_number", get_text(parent, "partner_eye_number"))
        default("text", "partner_ear_number", get_text(parent, "partner_ear_number"))
        default("text", "partner_nose_number", get_text(parent, "partner_nose_number"))
        default("text", "partner_mouth_number", get_text(parent, "partner_mouth_number"))
        default("text", "partner_accessories_number", get_text(parent, "partner_accessories_number"))
        default("image", "partner_hair", get_image(parent, "partner_hair"))

        default("text", "skin_color", get_text(parent, "partner_skin_color"))
        default("text", "eye_color", get_text(parent, "partner_eye_color"))
        default("text", "clothes_color", get_text(parent, "clothes_color"))
        default("text", "eye_number", get_text(parent, "child_eye_number"))
        default("text", "ear_number", get_text(parent, "child_ear_number"))
        default("text", "nose_number", get_text(parent, "child_nose_number"))
        default("text", "mouth_number", get_text(parent, "child_mouth_number"))
        default("text", "accessories_number", get_text(parent, "child_accessories_number"))

        default("image", "wallpaper", get_image(parent, "wallpaper"))
        default("text", "parent_name", get_text(parent, "my_name"))
        default("text", "partner_name", get_text(parent, "partner_name"))
        default("text", "name", get_text(parent, "name"))

        default("sound", "parent_name", get_sound(parent, "my_name"))
        default("sound", "parent_greeting", get_sound(parent, "greeting"))
        default("sound", "parent_cry", get_sound(parent, "cry"))
        default("sound", "partner_name", get_sound(parent, "partner_name"))
        default("sound", "partner_greeting", get_sound(parent, "partner_greeting"))
        default("sound", "partner_cry", get_sound(parent, "partner_cry"))
        default("sound", "name", get_sound(parent, "name"))

        default("image", "blackboard", get_image(parent, "blackboard"))
        default("sound", "music", get_sound(parent, "song"))

    roles_to_fill = ["friend3", "friend4", "friend5", "friend6", "friend7", "friend8", "friend1", "friend2", "teacher"]

    while (len(roles_to_fill) > 0 and len(lowest_children) > 0):
        person = lowest_children.pop(0)
        if person.pk not in used_pks:
            used_pks.append(person.pk)
            next_role = roles_to_fill.pop(0)
            default("text", "%s_pk" % (next_role), person.pk)

            default("text", "%s_name" % (next_role), get_text(person, "my_name"))
            if data["text"]["%s_name" % (next_role)] is not None:
                default("sound", "%s_name" % (next_role), get_sound(person, "my_name"))

            if data["sound"]["%s_name" % (next_role)] is None:
                data["text"]["%s_name" % (next_role)] = None

            default("text", "%s_skin_color" % (next_role), get_text(person, "my_skin_color"))
            default("text", "%s_eye_color" % (next_role), get_text(person, "my_eye_color"))
            default("text", "%s_clothes_color" % (next_role), get_text(person, "my_clothes_color"))
            default("text", "%s_eye_number" % (next_role), get_text(person, "my_eye_number"))
            default("text", "%s_ear_number" % (next_role), get_text(person, "my_ear_number"))
            default("text", "%s_nose_number" % (next_role), get_text(person, "my_nose_number"))
            default("text", "%s_mouth_number" % (next_role), get_text(person, "my_mouth_number"))
            default("text", "%s_accessories_number" % (next_role), get_text(person, "my_accessories_number"))

            default("image", "%s_hair" % (next_role), get_image(person, "hair"))
            default("sound", "%s_kiss" % (next_role), get_sound(person, "kiss"))
            default("sound", "%s_cry" % (next_role), get_sound(person, "cry"))
            default("sound", "%s_bump" % (next_role), get_sound(person, "bump"))
            default("sound", "%s_greeting" % (next_role), get_sound(person, "greeting"))
            default("image", "%s_favouritetoy" % (next_role), get_image(person, "favouritetoy"))

    # Next, try to use people who haven't completed but have provided enough information
    if (len(roles_to_fill) > 0):
        # We have no more completed people to use, find uncompleted people with the greatest contribution and use them
        incomplete = [l for l in models.Character.objects.filter(complete=False)]

        incomplete = sorted(incomplete, key=lambda i : i.images.count() + i.sounds.count(), reverse=True)
        if len(incomplete) > 0:
            person = incomplete.pop(0)
        else:
            person = None

        while len(roles_to_fill) > 0 and person is not None:
                # Fill it as best we can
                # We ignore all the my_ stuff as if its not complete we don't want all our NPCs looking the same
                next_role = roles_to_fill.pop(0)
                default("text", "%s_pk" % (next_role), person.pk)
                default("image", "%s_hair" % (next_role), get_image(person, "hair"))
                default("sound", "%s_kiss" % (next_role), get_sound(person, "kiss"))
                default("sound", "%s_cry" % (next_role), get_sound(person, "cry"))
                default("sound", "%s_bump" % (next_role), get_sound(person, "bump"))
                default("sound", "%s_greeting" % (next_role), get_sound(person, "greeting"))
                default("image", "%s_favouritetoy" % (next_role), get_image(person, "favouritetoy"))
                default("text", "%s_name" % (next_role), get_text(person, "name"))
                if data["text"]["%s_name" % (next_role)] is not None:
                    default("sound", "%s_name" % (next_role), get_sound(person, "name"))
                if "%s_name" % (next_role) not in data["sound"] or data["sound"]["%s_name" % (next_role)] is None:
                    data["text"]["%s_name" % (next_role)] = None

                default("text", "%s_skin_color" % (next_role), get_text(person, "partner_skin_color"))
                default("text", "%s_eye_color" % (next_role), get_text(person, "partner_eye_color"))
                default("text", "%s_clothes_color" % (next_role), get_text(person, "clothes_color"))
                default("text", "%s_eye_number" % (next_role), get_text(person, "child_eye_number"))
                default("text", "%s_ear_number" % (next_role), get_text(person, "child_ear_number"))
                default("text", "%s_nose_number" % (next_role), get_text(person, "child_nose_number"))
                default("text", "%s_mouth_number" % (next_role), get_text(person, "child_mouth_number"))
                default("text", "%s_accessories_number" % (next_role), get_text(person, "child_accessories_number"))
                if len(incomplete) > 0:
                    person = incomplete.pop(0)
                else:
                    person = None

    # Toys
    toys = list(models.Image.objects.filter(key="favouritetoy"))
    random.shuffle(toys)
    if len(toys) > 0:
        default("image", "friend1_favouritetoy", toys[0].image.url)
    if len(toys) > 1:
        default("image", "friend2_favouritetoy", toys[1].image.url)


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

    default("image", "friend1_favouritetoy", "/s/assets/demo/toys/toy_1.png")
    default("image", "friend2_favouritetoy", "/s/assets/demo/toys/toy_2.png")

    # School

    default("image", "blackboard", random.choice(BLACKBOARDS))
    default("sound", "music", "/s/assets/narration/jonny_music.mp3")

    return render(request, "index.html", {"data": json.dumps(data)})


def set_text(c, k, v):
    if (c.texts.filter(key=k).count() > 0):
        return

    models.Text(character=c, key=k, value=v).save()

def set_sound(c, k, v):
    if (c.sounds.filter(key=k).count() > 0):
        return
    im = models.Sound(character=c, key=k)

    url = v
    if not url.startswith("http"):
        url = settings.ROOT_URL + url

    img_temp = NamedTemporaryFile(delete=True)
    img_temp.write(urlopen(url).read())
    img_temp.flush()

    im.save()
    im.sound.save("tmp.webm", img_temp)

def set_image(c, k, v):
    if (c.images.filter(key=k).count() > 0):
        return
    im = models.Image(character=c, key=k)

    url = v
    if not url.startswith("http"):
        url = settings.ROOT_URL + url

    img_temp = NamedTemporaryFile(delete=True)
    img_temp.write(urlopen(url).read())
    img_temp.flush()

    im.save()
    im.image.save("tmp.png", img_temp)

@csrf_exempt
def startupload(request):
    """Return an upload ID."""
    if "parent" in request.POST:
        parent = models.Character.objects.get(pk=request.POST["parent"])
    else:
        parent = None
    c = models.Character(parent=parent)
    c.save()

    d = json.loads(request.POST['data'])

    for k, v in d["texts"].items():
        set_text(c, k, v)

    for k, v in d["sounds"].items():
        set_sound(c, k, v)

    return JsonResponse({"id": c.pk})


@csrf_exempt
def uploadtext(request, uploadid):
    """Store text."""
    c = models.Character.objects.get(pk=uploadid)
    texts = json.loads(request.POST["data"])
    for k, v in texts.items():
        set_text(c, k, v)
    return JsonResponse({})


@csrf_exempt
def uploadimage(request, uploadid):
    c = models.Character.objects.get(pk=uploadid)

    if (c.images.filter(key=request.POST['key']).count() > 0):
        return

    models.Image(character=c,
                 key=request.POST['key'],
                 image=request.FILES['data']).save()
    return JsonResponse({})

@csrf_exempt
def setimage(request, uploadid):
    c = models.Character.objects.get(pk=uploadid)

    images = json.loads(request.POST["data"])

    for k, v in images.items():
        set_image(c, k, v)
    return JsonResponse({})

@csrf_exempt
def setsound(request, uploadid):
    c = models.Character.objects.get(pk=uploadid)

    sounds = json.loads(request.POST["data"])

    for k, v in sounds.items():
        set_sound(c, k, v)
    return JsonResponse({})


@csrf_exempt
def uploadsound(request, uploadid):
    c = models.Character.objects.get(pk=uploadid)

    if (c.sounds.filter(key=request.POST['key']).count() > 0):
        return

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
