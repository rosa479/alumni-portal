import uuid
from django.db import models
from test_app.models import User


class Scholarship(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "ACTIVE", "Active"
        INACTIVE = "INACTIVE", "Inactive"
        COMPLETED = "COMPLETED", "Completed"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    description = models.TextField()
    eligibility = models.TextField()
    target_amount = models.DecimalField(max_digits=12, decimal_places=2)
    current_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.ACTIVE)
    contributors = models.ManyToManyField(User, related_name='scholarships_contributed', blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='scholarships_author')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    image_url = models.URLField(max_length=500, null=True, blank=True)
    
    @property
    def progress_percentage(self):
        if self.target_amount > 0:
            return min(100, (self.current_amount / self.target_amount) * 100)
        return 0
    
    @property
    def remaining_amount(self):
        return max(0, self.target_amount - self.current_amount)

    def __str__(self):
        return self.title


class ScholarshipApplication(models.Model):
    """
    Model for scholarship applications submitted by students
    """
    class ApprovalStatus(models.TextChoices):
        PENDING = "PENDING", "Pending Review"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"
    
    # Primary key
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # References
    student = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='scholarship_applications'
    )
    scholarship = models.ForeignKey(
        Scholarship, 
        on_delete=models.CASCADE, 
        related_name='applications'
    )
    
    # Student Information
    name = models.CharField(max_length=255)
    roll = models.CharField(max_length=50)
    department = models.CharField(max_length=100)
    email = models.EmailField()
    
    # Family Information
    father_name = models.CharField(max_length=255)
    mother_name = models.CharField(max_length=255)
    father_occupation = models.CharField(max_length=200)
    mother_occupation = models.CharField(max_length=200)
    annual_income = models.CharField(max_length=50)  # Stored as string for flexibility
    
    # Academic Information
    gpa = models.CharField(max_length=10)
    
    # Application Details
    reason = models.TextField(help_text="Why you need this scholarship")
    
    # Approval Status
    approved = models.CharField(
        max_length=10,
        choices=ApprovalStatus.choices,
        default=ApprovalStatus.PENDING
    )
    rejection_reason = models.TextField(blank=True, null=True)
    
    # Documents (file paths or URLs)
    aadhar_document = models.CharField(max_length=500, blank=True, null=True)
    bank_passbook_document = models.CharField(max_length=500, blank=True, null=True)
    income_certificate_document = models.CharField(max_length=500, blank=True, null=True)
    marksheet_document = models.CharField(max_length=500, blank=True, null=True)
    
    # Student Photo
    photo = models.CharField(max_length=500, blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['student', 'scholarship']  # One application per student per scholarship
    
    def __str__(self):
        return f"{self.name} - {self.scholarship.title}"
