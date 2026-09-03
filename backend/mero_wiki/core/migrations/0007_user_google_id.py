from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0006_features_is_available_review'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='google_id',
            field=models.CharField(blank=True, max_length=255, null=True, unique=True),
        ),
    ]