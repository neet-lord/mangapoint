# Generated by Django 2.2.1 on 2019-09-15 16:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('manga', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='event',
            name='affected_manga',
        ),
        migrations.RemoveField(
            model_name='event',
            name='affected_tags',
        ),
        migrations.RemoveField(
            model_name='event',
            name='affected_users',
        ),
        migrations.RemoveField(
            model_name='chapter',
            name='uploader',
        ),
        migrations.RemoveField(
            model_name='manga',
            name='ratings',
        ),
        migrations.RemoveField(
            model_name='manga',
            name='subscribers',
        ),
        migrations.RemoveField(
            model_name='tag',
            name='subscribers',
        ),
        migrations.DeleteModel(
            name='Bookmark',
        ),
        migrations.DeleteModel(
            name='Event',
        ),
    ]
