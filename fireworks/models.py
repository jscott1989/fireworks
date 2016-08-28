
# class Character(models.Model):
#     """Represents a character who has a set of stored behaviour, and some parents."""

#     parent1 = models.ForeignKey('self', related_name="children1")
#     parent2 = models.ForeignKey('self', related_name="children2")


# class Image(models.Model):
#     character = models.ForeignKey(Character, related_name="images")


# class Sound(models.Model):
#     character = models.ForeignKey(Character, related_name="images")


# class Text(models.Model):
#     character = models.ForeignKey(Character, related_name="images")
