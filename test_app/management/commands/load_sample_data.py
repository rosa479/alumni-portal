from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from test_app.models import AlumniProfile, Community, Post, Scholarship, ScholarshipContribution
from decimal import Decimal
import uuid

User = get_user_model()

class Command(BaseCommand):
    help = 'Load sample data for the alumni portal'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing data before loading sample data',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Clearing existing data...')
            ScholarshipContribution.objects.all().delete()
            Scholarship.objects.all().delete()
            Post.objects.all().delete()
            Community.objects.all().delete()
            AlumniProfile.objects.all().delete()
            User.objects.filter(is_superuser=False).delete()
            self.stdout.write(self.style.SUCCESS('Existing data cleared.'))

        self.stdout.write('Loading sample data...')

        # Create sample users
        users_data = [
            {
                'email': 'john.doe@example.com',
                'password': 'password123',
                'role': User.Role.ALUMNI,
                'status': User.Status.VERIFIED,
                'alumni_profile': {
                    'full_name': 'John Doe',
                    'graduation_year': 2018,
                    'department': 'Computer Science',
                    'profile_picture_url': 'https://i.pravatar.cc/150?u=john',
                    'about_me': 'Software Engineer at Google. Passionate about AI and machine learning.',
                    'credit_score': 95
                }
            },
            {
                'email': 'priya.sharma@example.com',
                'password': 'password123',
                'role': User.Role.ALUMNI,
                'status': User.Status.VERIFIED,
                'alumni_profile': {
                    'full_name': 'Priya Sharma',
                    'graduation_year': 2020,
                    'department': 'Electrical Engineering',
                    'profile_picture_url': 'https://i.pravatar.cc/150?u=priya',
                    'about_me': 'Product Manager at Microsoft. Love working on innovative products.',
                    'credit_score': 88
                }
            },
            {
                'email': 'rajesh.kumar@example.com',
                'password': 'password123',
                'role': User.Role.ALUMNI,
                'status': User.Status.VERIFIED,
                'alumni_profile': {
                    'full_name': 'Dr. Rajesh Kumar',
                    'graduation_year': 2015,
                    'department': 'Computer Science',
                    'profile_picture_url': 'https://i.pravatar.cc/150?u=rajesh',
                    'about_me': 'Professor at IIT Kharagpur. Research interests in AI and Data Science.',
                    'credit_score': 100
                }
            },
            {
                'email': 'sneha.reddy@example.com',
                'password': 'password123',
                'role': User.Role.ALUMNI,
                'status': User.Status.VERIFIED,
                'alumni_profile': {
                    'full_name': 'Sneha Reddy',
                    'graduation_year': 2019,
                    'department': 'Mechanical Engineering',
                    'profile_picture_url': 'https://i.pravatar.cc/150?u=sneha',
                    'about_me': 'Entrepreneur and startup founder. Building the next big thing in fintech.',
                    'credit_score': 92
                }
            }
        ]

        created_users = []
        for user_data in users_data:
            alumni_data = user_data.pop('alumni_profile')
            user = User.objects.create_user(**user_data)
            AlumniProfile.objects.create(user=user, **alumni_data)
            created_users.append(user)
            self.stdout.write(f'Created user: {user.email}')

        # Create sample communities
        communities_data = [
            {
                'name': 'Entrepreneurship Hub',
                'description': 'Connect with founders, investors, and mentors in the KGP network. Share your startup journey and get valuable insights.',
                'created_by': created_users[3]  # Sneha Reddy
            },
            {
                'name': 'AI & Machine Learning',
                'description': 'Discussions on the latest trends, research, and career opportunities in AI/ML. From beginners to experts, all are welcome.',
                'created_by': created_users[2]  # Dr. Rajesh Kumar
            },
            {
                'name': 'Bay Area Alumni',
                'description': 'A local chapter for alumni living and working in the San Francisco Bay Area. Regular meetups and networking events.',
                'created_by': created_users[0]  # John Doe
            },
            {
                'name': 'Finance & Investing',
                'description': 'A community for professionals in banking, private equity, and venture capital. Share market insights and investment strategies.',
                'created_by': created_users[1]  # Priya Sharma
            },
            {
                'name': 'Research & Academia',
                'description': 'Connecting KGPians pursuing careers in academic and industrial research. Collaborate on research projects and publications.',
                'created_by': created_users[2]  # Dr. Rajesh Kumar
            },
            {
                'name': "KGP '18 Batch",
                'description': 'A private group for the graduating class of 2018 to reconnect and network. Share memories and stay connected.',
                'created_by': created_users[0]  # John Doe
            }
        ]

        created_communities = []
        for community_data in communities_data:
            community = Community.objects.create(**community_data)
            # Add some members to each community
            community.members.add(community.created_by)
            if community.created_by != created_users[0]:
                community.members.add(created_users[0])
            if community.created_by != created_users[1]:
                community.members.add(created_users[1])
            created_communities.append(community)
            self.stdout.write(f'Created community: {community.name}')

        # Create sample posts
        posts_data = [
            {
                'author': created_users[0],
                'community': created_communities[0],  # Entrepreneurship Hub
                'content': 'Just closed our Series A funding! Huge thanks to the KGP network for the early support and mentorship. Looking forward to hiring more KGPians!',
                'status': Post.Status.APPROVED
            },
            {
                'author': created_users[1],
                'community': created_communities[0],  # Entrepreneurship Hub
                'content': 'Looking for a co-founder with a strong tech background for a new EdTech startup. DM me if you\'re interested in revolutionizing education!',
                'status': Post.Status.APPROVED
            },
            {
                'author': created_users[2],
                'community': created_communities[1],  # AI & Machine Learning
                'content': 'Just published a new paper on transformer models in NLP. Happy to share the pre-print with anyone interested in the research.',
                'status': Post.Status.APPROVED
            },
            {
                'author': created_users[3],
                'community': created_communities[2],  # Bay Area Alumni
                'content': 'Bay Area alumni meetup this Saturday at 3 PM in Palo Alto. Great networking opportunity and some exciting announcements!',
                'status': Post.Status.APPROVED
            },
            {
                'author': created_users[1],
                'community': created_communities[3],  # Finance & Investing
                'content': 'Market insights: The fintech sector is showing strong growth. What are your thoughts on the current investment climate?',
                'status': Post.Status.APPROVED
            }
        ]

        for post_data in posts_data:
            post = Post.objects.create(**post_data)
            self.stdout.write(f'Created post: {post.content[:50]}...')

        # Create sample scholarships
        scholarships_data = [
            {
                'title': 'Merit Scholarship for Computer Science',
                'description': 'Supporting outstanding students in Computer Science and Engineering with financial assistance for their academic journey.',
                'target_amount': Decimal('500000.00'),
                'current_amount': Decimal('250000.00'),
                'status': Scholarship.Status.ACTIVE,
                'created_by': created_users[2],  # Dr. Rajesh Kumar
                'image_url': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop'
            },
            {
                'title': 'Women in Engineering Scholarship',
                'description': 'Encouraging and supporting female students pursuing engineering degrees at IIT Kharagpur.',
                'target_amount': Decimal('300000.00'),
                'current_amount': Decimal('180000.00'),
                'status': Scholarship.Status.ACTIVE,
                'created_by': created_users[1],  # Priya Sharma
                'image_url': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop'
            },
            {
                'title': 'Research Excellence Fellowship',
                'description': 'Supporting graduate students conducting cutting-edge research in various engineering disciplines.',
                'target_amount': Decimal('750000.00'),
                'current_amount': Decimal('450000.00'),
                'status': Scholarship.Status.ACTIVE,
                'created_by': created_users[2],  # Dr. Rajesh Kumar
                'image_url': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop'
            },
            {
                'title': 'Startup Innovation Grant',
                'description': 'Supporting student entrepreneurs with innovative ideas and business plans.',
                'target_amount': Decimal('200000.00'),
                'current_amount': Decimal('200000.00'),
                'status': Scholarship.Status.COMPLETED,
                'created_by': created_users[3],  # Sneha Reddy
                'image_url': 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop'
            }
        ]

        created_scholarships = []
        for scholarship_data in scholarships_data:
            scholarship = Scholarship.objects.create(**scholarship_data)
            created_scholarships.append(scholarship)
            self.stdout.write(f'Created scholarship: {scholarship.title}')

        # Create sample scholarship contributions
        contributions_data = [
            {
                'scholarship': created_scholarships[0],  # Merit Scholarship
                'contributor': created_users[0],  # John Doe
                'amount': Decimal('50000.00'),
                'is_anonymous': False,
                'message': 'Happy to support the next generation of CS students!'
            },
            {
                'scholarship': created_scholarships[0],  # Merit Scholarship
                'contributor': created_users[1],  # Priya Sharma
                'amount': Decimal('25000.00'),
                'is_anonymous': False,
                'message': 'Great initiative! Keep up the good work.'
            },
            {
                'scholarship': created_scholarships[1],  # Women in Engineering
                'contributor': created_users[3],  # Sneha Reddy
                'amount': Decimal('30000.00'),
                'is_anonymous': False,
                'message': 'Supporting women in tech!'
            },
            {
                'scholarship': created_scholarships[2],  # Research Excellence
                'contributor': created_users[0],  # John Doe
                'amount': Decimal('100000.00'),
                'is_anonymous': True,
                'message': ''
            }
        ]

        for contribution_data in contributions_data:
            contribution = ScholarshipContribution.objects.create(**contribution_data)
            self.stdout.write(f'Created contribution: INR {contribution.amount} to {contribution.scholarship.title}')

        self.stdout.write(
            self.style.SUCCESS(
                f'\nSuccessfully loaded sample data:\n'
                f'- {len(created_users)} users with alumni profiles\n'
                f'- {len(created_communities)} communities\n'
                f'- {len(posts_data)} posts\n'
                f'- {len(created_scholarships)} scholarships\n'
                f'- {len(contributions_data)} scholarship contributions\n\n'
                f'You can now login with any of these accounts using password "password123":\n'
                f'- {created_users[0].email}\n'
                f'- {created_users[1].email}\n'
                f'- {created_users[2].email}\n'
                f'- {created_users[3].email}'
            )
        )
