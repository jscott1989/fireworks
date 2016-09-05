from django import template

register = template.Library()

@register.filter()
def get_text(character, key):
    v = character.texts.filter(key=key).first()
    if v is None:
        return None
    return v.value
