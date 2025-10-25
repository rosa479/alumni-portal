from rest_framework import serializers
from .models import Scholarship, ScholarshipApplication


class ScholarshipListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for listing scholarships
    """
    created_by_name = serializers.SerializerMethodField()
    progress_percentage = serializers.ReadOnlyField()
    remaining_amount = serializers.ReadOnlyField()
    contributors_count = serializers.SerializerMethodField()
    applications_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Scholarship
        fields = [
            'id', 'title', 'description', 'eligibility', 'target_amount', 
            'current_amount', 'status', 'image_url', 'created_by', 
            'created_by_name', 'created_at', 'updated_at', 
            'progress_percentage', 'remaining_amount', 'contributors_count',
            'applications_count'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'current_amount']
    
    def get_created_by_name(self, obj):
        if obj.created_by and hasattr(obj.created_by, 'alumni_profile'):
            return obj.created_by.alumni_profile.full_name
        return obj.created_by.email if obj.created_by else None
    
    def get_contributors_count(self, obj):
        return obj.contributors.count()
    
    def get_applications_count(self, obj):
        return obj.applications.count()


class ScholarshipDetailSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for scholarship with contributors and applications
    """
    created_by_name = serializers.SerializerMethodField()
    created_by_email = serializers.EmailField(source='created_by.email', read_only=True)
    progress_percentage = serializers.ReadOnlyField()
    remaining_amount = serializers.ReadOnlyField()
    contributors_count = serializers.SerializerMethodField()
    applications_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Scholarship
        fields = [
            'id', 'title', 'description', 'eligibility', 'target_amount', 
            'current_amount', 'status', 'image_url', 'created_by', 
            'created_by_name', 'created_by_email', 'created_at', 'updated_at',
            'progress_percentage', 'remaining_amount', 'contributors_count',
            'applications_count'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'current_amount']
    
    def get_created_by_name(self, obj):
        if obj.created_by and hasattr(obj.created_by, 'alumni_profile'):
            return obj.created_by.alumni_profile.full_name
        return obj.created_by.email if obj.created_by else None
    
    def get_contributors_count(self, obj):
        return obj.contributors.count()
    
    def get_applications_count(self, obj):
        return obj.applications.count()


class ScholarshipCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating scholarships
    """
    class Meta:
        model = Scholarship
        fields = [
            'id', 'title', 'description', 'eligibility', 'target_amount',
            'status', 'image_url'
        ]
        read_only_fields = ['id']
    
    def create(self, validated_data):
        # Automatically set created_by to the current user
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class ScholarshipApplicationListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for listing scholarship applications
    """
    student_name = serializers.CharField(source='student.alumni_profile.full_name', read_only=True)
    student_email = serializers.EmailField(source='student.email', read_only=True)
    scholarship_title = serializers.CharField(source='scholarship.title', read_only=True)
    
    class Meta:
        model = ScholarshipApplication
        fields = [
            'id', 'student', 'student_name', 'student_email', 
            'scholarship', 'scholarship_title', 'name', 'roll', 
            'department', 'email', 'gpa', 'approved', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class ScholarshipApplicationDetailSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for scholarship application with all fields
    """
    student_name = serializers.CharField(source='student.alumni_profile.full_name', read_only=True)
    student_email = serializers.EmailField(source='student.email', read_only=True)
    scholarship_title = serializers.CharField(source='scholarship.title', read_only=True)
    scholarship_description = serializers.CharField(source='scholarship.description', read_only=True)
    
    class Meta:
        model = ScholarshipApplication
        fields = [
            'id', 'student', 'student_name', 'student_email',
            'scholarship', 'scholarship_title', 'scholarship_description',
            'name', 'roll', 'department', 'email',
            'father_name', 'mother_name', 'father_occupation', 'mother_occupation',
            'annual_income', 'gpa', 'reason', 'approved', 'rejection_reason',
            'aadhar_document', 'bank_passbook_document', 'income_certificate_document',
            'marksheet_document', 'photo', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'student']


class ScholarshipApplicationCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating scholarship applications
    """
    class Meta:
        model = ScholarshipApplication
        fields = [
            'scholarship', 'name', 'roll', 'department', 'email',
            'father_name', 'mother_name', 'father_occupation', 'mother_occupation',
            'annual_income', 'gpa', 'reason',
            'aadhar_document', 'bank_passbook_document', 'income_certificate_document',
            'marksheet_document', 'photo'
        ]
    
    def validate(self, data):
        """
        Validate that the user hasn't already applied for this scholarship
        """
        request = self.context.get('request')
        scholarship = data.get('scholarship')
        
        if request and scholarship:
            # Check if user already has an application for this scholarship
            existing = ScholarshipApplication.objects.filter(
                student=request.user,
                scholarship=scholarship
            ).exists()
            
            if existing:
                raise serializers.ValidationError(
                    "You have already applied for this scholarship."
                )
        
        return data
    
    def create(self, validated_data):
        # Automatically set student to the current user
        validated_data['student'] = self.context['request'].user
        return super().create(validated_data)


class ScholarshipApplicationUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating scholarship applications (by applicant)
    """
    class Meta:
        model = ScholarshipApplication
        fields = [
            'name', 'roll', 'department', 'email',
            'father_name', 'mother_name', 'father_occupation', 'mother_occupation',
            'annual_income', 'gpa', 'reason',
            'aadhar_document', 'bank_passbook_document', 'income_certificate_document',
            'marksheet_document', 'photo'
        ]
    
    def validate(self, data):
        """
        Prevent updates if application is already approved or rejected
        """
        if self.instance.approved != ScholarshipApplication.ApprovalStatus.PENDING:
            raise serializers.ValidationError(
                "Cannot update an application that has already been reviewed."
            )
        return data


class ScholarshipApplicationApprovalSerializer(serializers.ModelSerializer):
    """
    Serializer for approving/rejecting scholarship applications (admin only)
    """
    class Meta:
        model = ScholarshipApplication
        fields = ['approved', 'rejection_reason']
    
    def validate(self, data):
        """
        Validate that rejection_reason is provided when rejecting
        """
        approved = data.get('approved')
        rejection_reason = data.get('rejection_reason', '').strip()
        
        if approved == ScholarshipApplication.ApprovalStatus.REJECTED and not rejection_reason:
            raise serializers.ValidationError({
                'rejection_reason': 'Rejection reason is required when rejecting an application.'
            })
        
        return data
