from django.contrib import admin
from core.models import user

@admin.register(user)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'full_name', 'tc', 'is_active', 'is_admin','is_staff','created_at', 'updated_at')
    list_filter = ('is_admin', 'is_active')
    search_fields = ('email', 'full_name')
    ordering = ('email',)
