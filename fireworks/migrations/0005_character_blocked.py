# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-09-08 07:22
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fireworks', '0004_auto_20160831_1007'),
    ]

    operations = [
        migrations.AddField(
            model_name='character',
            name='blocked',
            field=models.BooleanField(default=False),
        ),
    ]
