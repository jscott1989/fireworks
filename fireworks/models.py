from django.db import models
from django.utils.deconstruct import deconstructible
import os
import uuid


@deconstructible
class RandomFileName(object):
    def __init__(self, path, extension):
        self.path = os.path.join(path, "%s.%s")
        self.extension = extension

    def __call__(self, _, filename):
        # @note It's up to the validators to check if it's the correct file type in name or if one even exist.
        return self.path % (uuid.uuid4(), self.extension)


class Character(models.Model):
    """Represents a character who has a set of stored behaviour and a parent."""
    parent = models.ForeignKey('self', related_name="children", null=True)
    complete = models.BooleanField(default=False)
    blocked = models.BooleanField(default=False)


class Image(models.Model):
    character = models.ForeignKey(Character, related_name="images")
    key = models.CharField(max_length=255)
    image = models.ImageField(upload_to=RandomFileName("images", "png"))


class Sound(models.Model):
    character = models.ForeignKey(Character, related_name="sounds")
    key = models.CharField(max_length=255)
    sound = models.FileField(upload_to=RandomFileName("sounds", "webm"))


class Text(models.Model):
    character = models.ForeignKey(Character, related_name="texts")
    key = models.CharField(max_length=255)
    value = models.TextField()
