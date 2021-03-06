# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-08-31 10:07
from __future__ import unicode_literals

from django.db import migrations, models
import fireworks.models


class Migration(migrations.Migration):

    dependencies = [
        ('fireworks', '0003_auto_20160831_0948'),
    ]

    operations = [
        migrations.AddField(
            model_name='character',
            name='complete',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='sound',
            name='sound',
            field=models.FileField(upload_to=fireworks.models.RandomFileName('sounds', 'webm')),
        ),
    ]
