from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Scholarship, ScholarshipApplication
from .serializers import (
    ScholarshipListSerializer,
    ScholarshipDetailSerializer,
    ScholarshipCreateUpdateSerializer,
    ScholarshipApplicationListSerializer,
    ScholarshipApplicationDetailSerializer,
    ScholarshipApplicationCreateSerializer,
    ScholarshipApplicationUpdateSerializer,
    ScholarshipApplicationApprovalSerializer
)


@api_view(['GET', 'POST'])
def scholarship_list(request):
    """
    List all scholarships or create a new one (admin only)
    Query params:
    - status: filter by status (ACTIVE, INACTIVE, COMPLETED)
    - include_inactive: if 'true', returns all scholarships regardless of status
    """
    if request.method == 'GET':
        # Check if we should include all scholarships or just active ones
        include_inactive = request.query_params.get('include_inactive', 'false').lower() == 'true'
        status_filter = request.query_params.get('status')
        
        if include_inactive:
            # Return all scholarships regardless of status
            scholarships = Scholarship.objects.all()
        elif status_filter:
            # Filter by specific status
            scholarships = Scholarship.objects.filter(status=status_filter.upper())
        else:
            # Default: only active scholarships
            scholarships = Scholarship.objects.filter(status=Scholarship.Status.ACTIVE)
        
        scholarships = scholarships.order_by('-created_at')
        serializer = ScholarshipListSerializer(scholarships, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        # Only admin can create scholarships
        if not request.user.is_authenticated or request.user.role != 'ADMIN':
            return Response(
                {"error": "Only administrators can create scholarships"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = ScholarshipCreateUpdateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
def scholarship_detail(request, pk):
    """
    Retrieve, update or delete a scholarship
    """
    scholarship = get_object_or_404(Scholarship, pk=pk)
    
    if request.method == 'GET':
        serializer = ScholarshipDetailSerializer(scholarship)
        return Response(serializer.data)
    
    elif request.method in ['PUT', 'PATCH']:
        # Only admin or creator can update
        if not request.user.is_authenticated or (
            request.user.role != 'ADMIN' and request.user != scholarship.created_by
        ):
            return Response(
                {"error": "You don't have permission to update this scholarship"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = ScholarshipCreateUpdateSerializer(
            scholarship, 
            data=request.data, 
            partial=(request.method == 'PATCH'),
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        # Only admin can delete
        if not request.user.is_authenticated or request.user.role != 'ADMIN':
            return Response(
                {"error": "Only administrators can delete scholarships"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        scholarship.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def application_list(request):
    """
    List all applications (admin) or user's own applications
    """
    if request.user.role == 'ADMIN':
        # Admin can see all applications
        applications = ScholarshipApplication.objects.all()
    else:
        # Regular users can only see their own applications
        applications = ScholarshipApplication.objects.filter(student=request.user)
    
    # Optional filtering by scholarship
    scholarship_id = request.query_params.get('scholarship')
    if scholarship_id:
        applications = applications.filter(scholarship_id=scholarship_id)
    
    # Optional filtering by approval status
    approval_status = request.query_params.get('status')
    if approval_status:
        applications = applications.filter(approved=approval_status)
    
    serializer = ScholarshipApplicationListSerializer(applications, many=True)
    return Response(serializer.data)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def application_detail(request, pk):
    """
    Retrieve, update or delete an application
    """
    application = get_object_or_404(ScholarshipApplication, pk=pk)
    
    # Check permissions: user can only access their own applications (unless admin)
    if request.user.role != 'ADMIN' and application.student != request.user:
        return Response(
            {"error": "You don't have permission to access this application"},
            status=status.HTTP_403_FORBIDDEN
        )
    
    if request.method == 'GET':
        serializer = ScholarshipApplicationDetailSerializer(application)
        return Response(serializer.data)
    
    elif request.method in ['PUT', 'PATCH']:
        # Only the applicant can update their application (and only if pending)
        if application.student != request.user:
            return Response(
                {"error": "You can only update your own applications"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = ScholarshipApplicationUpdateSerializer(
            application,
            data=request.data,
            partial=(request.method == 'PATCH')
        )
        if serializer.is_valid():
            serializer.save()
            return Response(ScholarshipApplicationDetailSerializer(application).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        # Only the applicant can delete (and only if pending)
        if application.student != request.user:
            return Response(
                {"error": "You can only delete your own applications"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if application.approved != ScholarshipApplication.ApprovalStatus.PENDING:
            return Response(
                {"error": "Cannot delete an application that has been reviewed"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        application.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_for_scholarship(request, scholarship_id):
    """
    Submit a scholarship application
    """
    scholarship = get_object_or_404(Scholarship, pk=scholarship_id)
    
    # Check if scholarship is active
    if scholarship.status != Scholarship.Status.ACTIVE:
        return Response(
            {"error": "This scholarship is not currently accepting applications"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Create application with scholarship in data
    data = request.data.copy()
    data['scholarship'] = scholarship_id
    
    serializer = ScholarshipApplicationCreateSerializer(data=data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(
            ScholarshipApplicationDetailSerializer(serializer.instance).data,
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def approve_application(request, pk):
    """
    Approve or reject a scholarship application (admin only)
    """
    application = get_object_or_404(ScholarshipApplication, pk=pk)
    
    serializer = ScholarshipApplicationApprovalSerializer(
        application,
        data=request.data,
        partial=True
    )
    
    if serializer.is_valid():
        serializer.save()
        return Response(ScholarshipApplicationDetailSerializer(application).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def scholarship_statistics(request):
    """
    Get statistics for scholarship dashboard
    Returns:
    - total_scholarships: total number of scholarships
    - active_scholarships: number of active scholarships
    - total_applications: total number of applications
    - pending_applications: number of pending applications
    - approved_applications: number of approved applications
    - rejected_applications: number of rejected applications
    """
    stats = {
        'total_scholarships': Scholarship.objects.count(),
        'active_scholarships': Scholarship.objects.filter(status=Scholarship.Status.ACTIVE).count(),
        'inactive_scholarships': Scholarship.objects.filter(status=Scholarship.Status.INACTIVE).count(),
        'completed_scholarships': Scholarship.objects.filter(status=Scholarship.Status.COMPLETED).count(),
        'total_applications': ScholarshipApplication.objects.count(),
        'pending_applications': ScholarshipApplication.objects.filter(
            approved=ScholarshipApplication.ApprovalStatus.PENDING
        ).count(),
        'approved_applications': ScholarshipApplication.objects.filter(
            approved=ScholarshipApplication.ApprovalStatus.APPROVED
        ).count(),
        'rejected_applications': ScholarshipApplication.objects.filter(
            approved=ScholarshipApplication.ApprovalStatus.REJECTED
        ).count(),
    }
    
    return Response(stats)

