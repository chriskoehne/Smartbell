# Generated by Django 4.0.4 on 2022-05-02 10:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('gym', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gymclassattendance',
            name='member',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='gym.member'),
        ),
    ]