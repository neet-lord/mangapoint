# Generated by Django 2.2.1 on 2020-03-14 21:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_manga_integration', '0010_auto_20200314_2002'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usermangarating',
            name='rating',
            field=models.IntegerField(choices=[(0, 0), (1, 1), (2, 2), (3, 3), (4, 4), (5, 5)]),
        ),
    ]
