from django.contrib import admin
from .models import Scholarship, ScholarshipApplication


@admin.register(Scholarship)
class ScholarshipAdmin(admin.ModelAdmin):
    list_display = ['title', 'status', 'target_amount', 'current_amount', 'progress_percentage', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['title', 'description']
    readonly_fields = ['id', 'created_at', 'updated_at', 'progress_percentage', 'remaining_amount']
    filter_horizontal = ['contributors']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'eligibility', 'status', 'image_url')
        }),
        ('Financial Details', {
            'fields': ('target_amount', 'current_amount')
        }),
        ('Contributors & Creator', {
            'fields': ('contributors', 'created_by')
        }),
        ('Timestamps', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ScholarshipApplication)
class ScholarshipApplicationAdmin(admin.ModelAdmin):
    list_display = ['name', 'scholarship', 'email', 'approved', 'created_at']
    list_filter = ['approved', 'department', 'created_at']
    search_fields = ['name', 'email', 'roll', 'department']
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Application Status', {
            'fields': ('approved', 'rejection_reason')
        }),
        ('References', {
            'fields': ('student', 'scholarship')
        }),
        ('Student Information', {
            'fields': ('name', 'roll', 'department', 'email', 'photo')
        }),
        ('Family Information', {
            'fields': ('father_name', 'mother_name', 'father_occupation', 'mother_occupation', 'annual_income')
        }),
        ('Academic Information', {
            'fields': ('gpa', 'reason')
        }),
        ('Documents', {
            'fields': ('aadhar_document', 'bank_passbook_document', 'income_certificate_document', 'marksheet_document'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_readonly_fields(self, request, obj=None):
        # Make student and scholarship readonly after creation
        if obj:  # Editing an existing object
            return self.readonly_fields + ['student', 'scholarship']
        return self.readonly_fields

