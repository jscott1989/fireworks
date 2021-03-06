# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-08-31 09:48
from __future__ import unicode_literals

from django.db import migrations, models
import fireworks.models


class Migration(migrations.Migration):

    dependencies = [
        ('fireworks', '0002_auto_20160829_1528'),
    ]

    operations = [
        migrations.AlterField(
            model_name='image',
            name='image',
            field=models.ImageField(upload_to=fireworks.models.RandomFileName('images', 'png')),
        ),
        migrations.AlterField(
            model_name='sound',
            name='sound',
            field=models.FileField(upload_to=fireworks.models.RandomFileName('sounds', 'png')),
        ),
    ]
