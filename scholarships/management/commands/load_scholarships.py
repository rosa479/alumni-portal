from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from scholarships.models import Scholarship, ScholarshipApplication
from decimal import Decimal

User = get_user_model()


class Command(BaseCommand):
    help = 'Load IIT Kharagpur scholarship data and applications into the database'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting scholarship data loading...'))

        # Get or create an admin user to be the creator of scholarships
        admin_user, created = User.objects.get_or_create(
            email='admin@iitkgp.ac.in',
            defaults={
                'is_staff': True,
                'is_superuser': True,
                'role': 'ADMIN',
                'status': 'VERIFIED'
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS(f'Created admin user: {admin_user.email}'))

        # Clear existing scholarships and applications
        ScholarshipApplication.objects.all().delete()
        Scholarship.objects.all().delete()
        self.stdout.write(self.style.WARNING('Cleared existing scholarships and applications'))

        # Define all 20 IIT Kharagpur scholarships
        scholarships_data = [
            {
                'title': 'Kirttan B Behra Memorial Award',
                'description': 'Merit-Based Award in memory of Kirttan B Behra for outstanding students. Corpus: ₹58,64,079',
                'eligibility': 'Outstanding academic performance',
                'target_amount': Decimal('5864079.00'),
                'current_amount': Decimal('5864079.00'),
                'status': 'ACTIVE',
            },
            {
                'title': 'Dr. Nirni Kumar Memorial Award',
                'description': 'Merit-Based Memorial award for exceptional students.',
                'eligibility': 'Exceptional academic achievement',
                'target_amount': Decimal('100000.00'),
                'current_amount': Decimal('0.00'),
                'status': 'ACTIVE',
            },
            {
                'title': 'Markose Thomas Memorial Award',
                'description': 'Merit-Based Award for students demonstrating academic excellence.',
                'eligibility': 'Strong academic record',
                'target_amount': Decimal('150000.00'),
                'current_amount': Decimal('0.00'),
                'status': 'ACTIVE',
            },
            {
                'title': 'Prof G P Sastry Memorial Award',
                'description': 'Merit-Based Memorial award honoring Prof G P Sastry.',
                'eligibility': 'Academic merit',
                'target_amount': Decimal('120000.00'),
                'current_amount': Decimal('0.00'),
                'status': 'ACTIVE',
            },
            {
                'title': 'Learn-Earn-Return (LER) Scholarship',
                'description': 'Need-Based Comprehensive scholarship program for deserving students. Largest corpus fund supporting multiple students. Corpus: ₹1,23,81,072',
                'eligibility': 'Financial need and academic merit',
                'target_amount': Decimal('12381072.00'),
                'current_amount': Decimal('12381072.00'),
                'status': 'ACTIVE',
            },
            {
                'title': 'Prof Jnan Ranjan Banerjee Chair Professorship',
                'description': 'Merit-Based Chair professorship for advanced research.',
                'eligibility': 'Research excellence',
                'target_amount': Decimal('200000.00'),
                'current_amount': Decimal('0.00'),
                'status': 'ACTIVE',
            },
            {
                'title': 'Ghanshyam Das and Krishna Kumari Agarwal Chair Professorship',
                'description': 'Merit-Based Endowed chair for distinguished faculty.',
                'eligibility': 'Faculty excellence',
                'target_amount': Decimal('250000.00'),
                'current_amount': Decimal('0.00'),
                'status': 'ACTIVE',
            },
            {
                'title': 'Class of 1972 Golden Jubilee Scholarship',
                'description': 'Need-Based Golden jubilee scholarship from the Class of 1972.',
                'eligibility': 'Financial need',
                'target_amount': Decimal('180000.00'),
                'current_amount': Decimal('0.00'),
                'status': 'ACTIVE',
            },
            {
                'title': 'Dr. Kalyan Kumar Bandyopadhyay Memorial Scholarship',
                'description': 'Merit-Based Memorial scholarship for outstanding achievement.',
                'eligibility': 'Outstanding academic performance',
                'target_amount': Decimal('140000.00'),
                'current_amount': Decimal('0.00'),
                'status': 'ACTIVE',
            },
            {
                'title': 'Sukumar Basu Memorial Scholarship',
                'description': 'Merit-Based Scholarship in memory of Sukumar Basu.',
                'eligibility': 'Academic excellence',
                'target_amount': Decimal('130000.00'),
                'current_amount': Decimal('0.00'),
                'status': 'ACTIVE',
            },
            {
                'title': 'Prof. Ajoy Kumar Ray Memorial Scholarship',
                'description': 'Merit-Based Memorial scholarship honoring Prof. Ajoy Kumar Ray.',
                'eligibility': 'Academic merit in Engineering',
                'target_amount': Decimal('120000.00'),
                'current_amount': Decimal('0.00'),
                'status': 'ACTIVE',
            },
            {
                'title': 'Emergency Medical Fund',
                'description': 'Need-Based Fund for students facing medical emergencies.',
                'eligibility': 'Medical emergency',
                'target_amount': Decimal('500000.00'),
                'current_amount': Decimal('0.00'),
                'status': 'ACTIVE',
            },
            {
                'title': 'Sitaram Agarwal Scholarship',
                'description': 'Need-Based Need-based scholarship for deserving students.',
                'eligibility': 'Financial need',
                'target_amount': Decimal('100000.00'),
                'current_amount': Decimal('0.00'),
                'status': 'ACTIVE',
            },
            {
                'title': 'Alumni Association Student Support Fund',
                'description': 'Need-Based General support fund from alumni association.',
                'eligibility': 'Various criteria',
                'target_amount': Decimal('300000.00'),
                'current_amount': Decimal('0.00'),
                'status': 'ACTIVE',
            },
            {
                'title': 'Research Excellence Award',
                'description': 'Merit-Based Award for students with exceptional research contributions.',
                'eligibility': 'Published research work',
                'target_amount': Decimal('250000.00'),
                'current_amount': Decimal('0.00'),
                'status': 'ACTIVE',
            },
            {
                'title': 'Sports Excellence Scholarship',
                'description': 'Merit-Based For students excelling in sports at national/international level.',
                'eligibility': 'National/International sports achievement',
                'target_amount': Decimal('180000.00'),
                'current_amount': Decimal('0.00'),
                'status': 'ACTIVE',
            },
            {
                'title': 'Cultural Achievement Award',
                'description': 'Merit-Based Recognition for outstanding cultural contributions.',
                'eligibility': 'Cultural achievements',
                'target_amount': Decimal('100000.00'),
                'current_amount': Decimal('0.00'),
                'status': 'ACTIVE',
            },
            {
                'title': 'Women in STEM Scholarship',
                'description': 'Need-Based Encouraging women to pursue STEM fields.',
                'eligibility': 'Female students in STEM',
                'target_amount': Decimal('220000.00'),
                'current_amount': Decimal('0.00'),
                'status': 'ACTIVE',
            },
            {
                'title': 'First Generation Scholar Award',
                'description': 'Need-Based Supporting first-generation college students.',
                'eligibility': 'First generation college student',
                'target_amount': Decimal('200000.00'),
                'current_amount': Decimal('0.00'),
                'status': 'ACTIVE',
            },
            {
                'title': 'Rural Development Initiative Scholarship',
                'description': 'Need-Based For students committed to rural development.',
                'eligibility': 'Rural background and commitment to rural development',
                'target_amount': Decimal('180000.00'),
                'current_amount': Decimal('0.00'),
                'status': 'ACTIVE',
            },
        ]

        # Create scholarships
        created_scholarships = []
        for data in scholarships_data:
            scholarship = Scholarship.objects.create(
                created_by=admin_user,
                **data
            )
            created_scholarships.append(scholarship)
            self.stdout.write(self.style.SUCCESS(f'Created scholarship: {scholarship.title}'))

        self.stdout.write(self.style.SUCCESS(f'\nCreated {len(created_scholarships)} scholarships'))

        # Create student users for applications
        students_data = [
            {'email': 'tanay.gupta@iitkgp.ac.in', 'roll': '24IM10008', 'name': 'Tanay Gupta', 'dept': 'Industrial & Systems Engineering'},
            {'email': 'prathmesh.somani@iitkgp.ac.in', 'roll': '21NA10033', 'name': 'Somani Prathmesh Amit', 'dept': 'Ocean Engineering & Naval Architecture'},
            {'email': 'piran.karkaria@iitkgp.ac.in', 'roll': '20IM3FP52', 'name': 'Piran Karkaria', 'dept': 'Industrial & Systems Engineering'},
            {'email': 'kosha.lele@iitkgp.ac.in', 'roll': '22CS10035', 'name': 'Kosha Lele', 'dept': 'Computer Science & Engineering'},
            {'email': 'heramb.warke@iitkgp.ac.in', 'roll': '22EE10089', 'name': 'Warke Heramb', 'dept': 'Electrical Engineering'},
            {'email': 'syed.faiz@iitkgp.ac.in', 'roll': '23ME10067', 'name': 'Syed Faiz', 'dept': 'Mechanical Engineering'},
            {'email': 'poojitha.jangili@iitkgp.ac.in', 'roll': '21CH10045', 'name': 'Jangili Poojitha', 'dept': 'Chemical Engineering'},
            {'email': 'vikhram.annapureddy@iitkgp.ac.in', 'roll': '22AE10012', 'name': 'Annapureddy Vikhram', 'dept': 'Aerospace Engineering'},
            {'email': 'chandrans.singh@iitkgp.ac.in', 'roll': '23CV10023', 'name': 'Chandrans Singh', 'dept': 'Civil Engineering'},
            {'email': 'hadwik.payidiparthy@iitkgp.ac.in', 'roll': '22BT10018', 'name': 'Payidiparthy Hadwik', 'dept': 'Biotechnology'},
        ]

        students = []
        for student_data in students_data:
            student, created = User.objects.get_or_create(
                email=student_data['email'],
                defaults={
                    'role': 'ALUMNI',
                    'status': 'VERIFIED'
                }
            )
            if created:
                student.set_password('student123')
                student.save()
            students.append({**student_data, 'user': student})
            self.stdout.write(self.style.SUCCESS(f'Created/retrieved student: {student.email}'))

        # Create scholarship applications
        applications_data = [
            {
                'student_index': 0,  # Tanay Gupta
                'scholarship_title': 'Learn-Earn-Return (LER) Scholarship',
                'gpa': '9.2',
                'approved': 'APPROVED',
                'father_name': 'Rajesh Gupta',
                'father_occupation': 'Engineer',
                'mother_name': 'Priya Gupta',
                'mother_occupation': 'Teacher',
                'annual_income': '₹4,50,000',
            },
            {
                'student_index': 1,  # Prathmesh Somani
                'scholarship_title': 'Kirttan B Behra Memorial Award',
                'gpa': '8.9',
                'approved': 'APPROVED',
                'father_name': 'Amit Somani',
                'father_occupation': 'Business',
                'mother_name': 'Meera Somani',
                'mother_occupation': 'Homemaker',
                'annual_income': '₹6,00,000',
            },
            {
                'student_index': 2,  # Piran Karkaria
                'scholarship_title': 'Emergency Medical Fund',
                'gpa': '8.5',
                'approved': 'APPROVED',
                'father_name': 'Rustom Karkaria',
                'father_occupation': 'Doctor',
                'mother_name': 'Shireen Karkaria',
                'mother_occupation': 'Nurse',
                'annual_income': '₹8,00,000',
            },
            {
                'student_index': 3,  # Kosha Lele
                'scholarship_title': 'Women in STEM Scholarship',
                'gpa': '9.5',
                'approved': 'APPROVED',
                'father_name': 'Vinay Lele',
                'father_occupation': 'Software Engineer',
                'mother_name': 'Anita Lele',
                'mother_occupation': 'Professor',
                'annual_income': '₹12,00,000',
            },
            {
                'student_index': 4,  # Heramb Warke
                'scholarship_title': 'Research Excellence Award',
                'gpa': '9.1',
                'approved': 'APPROVED',
                'father_name': 'Suresh Warke',
                'father_occupation': 'Farmer',
                'mother_name': 'Savita Warke',
                'mother_occupation': 'Teacher',
                'annual_income': '₹3,00,000',
            },
            {
                'student_index': 5,  # Syed Faiz
                'scholarship_title': 'First Generation Scholar Award',
                'gpa': '8.7',
                'approved': 'APPROVED',
                'father_name': 'Mohammed Faiz',
                'father_occupation': 'Shopkeeper',
                'mother_name': 'Fatima Faiz',
                'mother_occupation': 'Tailor',
                'annual_income': '₹2,50,000',
            },
            {
                'student_index': 6,  # Poojitha Jangili
                'scholarship_title': 'Class of 1972 Golden Jubilee Scholarship',
                'gpa': '8.8',
                'approved': 'PENDING',
                'father_name': 'Ravi Jangili',
                'father_occupation': 'Accountant',
                'mother_name': 'Lakshmi Jangili',
                'mother_occupation': 'Homemaker',
                'annual_income': '₹4,00,000',
            },
            {
                'student_index': 7,  # Vikhram Annapureddy
                'scholarship_title': 'Sports Excellence Scholarship',
                'gpa': '8.3',
                'approved': 'APPROVED',
                'father_name': 'Krishna Annapureddy',
                'father_occupation': 'Coach',
                'mother_name': 'Radha Annapureddy',
                'mother_occupation': 'Nutritionist',
                'annual_income': '₹5,00,000',
            },
            {
                'student_index': 8,  # Chandrans Singh
                'scholarship_title': 'Rural Development Initiative Scholarship',
                'gpa': '8.6',
                'approved': 'APPROVED',
                'father_name': 'Balwant Singh',
                'father_occupation': 'Farmer',
                'mother_name': 'Gurpreet Kaur',
                'mother_occupation': 'Social Worker',
                'annual_income': '₹2,00,000',
            },
            {
                'student_index': 9,  # Hadwik Payidiparthy
                'scholarship_title': 'Dr. Kalyan Kumar Bandyopadhyay Memorial Scholarship',
                'gpa': '9.0',
                'approved': 'APPROVED',
                'father_name': 'Venkat Payidiparthy',
                'father_occupation': 'Scientist',
                'mother_name': 'Sandhya Payidiparthy',
                'mother_occupation': 'Researcher',
                'annual_income': '₹9,00,000',
            },
        ]

        created_applications = []
        for app_data in applications_data:
            student_info = students[app_data['student_index']]
            scholarship = Scholarship.objects.get(title=app_data['scholarship_title'])
            
            application = ScholarshipApplication.objects.create(
                student=student_info['user'],
                scholarship=scholarship,
                name=student_info['name'],
                roll=student_info['roll'],
                department=student_info['dept'],
                email=student_info['email'],
                gpa=app_data['gpa'],
                father_name=app_data['father_name'],
                father_occupation=app_data['father_occupation'],
                mother_name=app_data['mother_name'],
                mother_occupation=app_data['mother_occupation'],
                annual_income=app_data['annual_income'],
                reason='Seeking financial assistance to continue my studies and achieve my academic goals. I am committed to academic excellence and giving back to the community.',
                approved=app_data['approved'],
            )
            created_applications.append(application)
            self.stdout.write(self.style.SUCCESS(
                f'Created application: {student_info["name"]} -> {scholarship.title} ({app_data["approved"]})'
            ))

        self.stdout.write(self.style.SUCCESS(f'\nCreated {len(created_applications)} applications'))
        self.stdout.write(self.style.SUCCESS('\n✓ Successfully loaded all scholarship data!'))
        self.stdout.write(self.style.SUCCESS(f'  - {len(created_scholarships)} scholarships'))
        self.stdout.write(self.style.SUCCESS(f'  - {len(students)} students'))
        self.stdout.write(self.style.SUCCESS(f'  - {len(created_applications)} applications'))
