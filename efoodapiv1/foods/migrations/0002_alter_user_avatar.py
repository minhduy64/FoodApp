# Generated by Django 4.2.13 on 2024-06-09 06:26

import cloudinary.models
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('foods', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='avatar',
            field=cloudinary.models.CloudinaryField(max_length=255, null=True),
        ),
    ]
