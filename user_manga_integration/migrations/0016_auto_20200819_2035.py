# Generated by Django 2.2.7 on 2020-08-19 18:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_manga_integration', '0015_auto_20200819_2023'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usermangareadingsettings',
            name='theme',
            field=models.CharField(choices=[['DEFAULT', 'DEFAULT']], default='DEFAULT', max_length=12),
        ),
    ]