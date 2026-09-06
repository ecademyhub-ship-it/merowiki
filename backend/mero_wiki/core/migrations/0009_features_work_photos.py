from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0008_alter_features_category'),
    ]

    operations = [
        migrations.AddField(
            model_name='features',
            name='work_photo_1',
            field=models.ImageField(blank=True, null=True, upload_to='photos/'),
        ),
        migrations.AddField(
            model_name='features',
            name='work_photo_2',
            field=models.ImageField(blank=True, null=True, upload_to='photos/'),
        ),
        migrations.AddField(
            model_name='features',
            name='work_photo_3',
            field=models.ImageField(blank=True, null=True, upload_to='photos/'),
        ),
        migrations.AddField(
            model_name='features',
            name='work_photo_4',
            field=models.ImageField(blank=True, null=True, upload_to='photos/'),
        ),
        migrations.AddField(
            model_name='features',
            name='work_photo_5',
            field=models.ImageField(blank=True, null=True, upload_to='photos/'),
        ),
    ]