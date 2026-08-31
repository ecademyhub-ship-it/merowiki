from django.contrib import admin
from core.models import user,Features,Review


@admin.register(user)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'full_name', 'google_id','tc', 'is_active', 'is_admin','is_staff','created_at', 'updated_at')
    list_filter = ('is_admin', 'is_active')
    search_fields = ('email', 'full_name')
    ordering = ('email',)

@admin.register(Features)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email','name','category','name','profile','phone','description','location')
    list_filter = ('email', 'name')
    search_fields = ('email', 'name')

@admin.register(Review)
class UserAdmin(admin.ModelAdmin):
    list_display = ('user', 'feature', 'rating','comment')
    search_fields = ('user', )

