from django.contrib import admin
from core.models import user,Features


@admin.register(user)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'full_name', 'tc', 'is_active', 'is_admin','is_staff','created_at', 'updated_at')
    list_filter = ('is_admin', 'is_active')
    search_fields = ('email', 'full_name')
    ordering = ('email',)

@admin.register(Features)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email','name','category','name','profile','phone','description','location')
    list_filter = ('email', 'name')
    search_fields = ('email', 'name')

