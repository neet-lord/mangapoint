# Generated by Django 2.2.1 on 2020-03-12 08:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_manga_integration', '0002_auto_20190929_1230'),
    ]

    operations = [
        migrations.AddField(
            model_name='userchapterbookmarkentry',
            name='is_manually_assigned',
            field=models.BooleanField(default=False),
        ),
    ]
