from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from test_app.models import AlumniProfile, Community, Post, Scholarship, ScholarshipContribution, Tag, UserTag
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
            UserTag.objects.all().delete()
            Tag.objects.all().delete()
            Community.objects.all().delete()
            AlumniProfile.objects.all().delete()
            User.objects.filter(is_superuser=False).delete()
            self.stdout.write(self.style.SUCCESS('Existing data cleared.'))

        self.stdout.write('Loading sample data...')

        # Create sample users
        users_data = [
            {
                'email': 'john.doe@example.com',
                'roll_number': '24MA10060',
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
                'roll_number': '24MA10061',
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
                'roll_number': '24MA10062',
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
                'roll_number': '24MA10063',
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

        # Create sample tags for each community
        self.stdout.write('Creating sample tags...')
        for community in created_communities:
            # Create different tags for different communities
            if 'Entrepreneurship' in community.name:
                tag_names = ['Founder', 'Investor', 'Mentor', 'Startup Enthusiast', 'Business Development']
            elif 'AI' in community.name:
                tag_names = ['ML Engineer', 'Data Scientist', 'AI Researcher', 'Deep Learning Expert', 'NLP Specialist']
            elif 'Bay Area' in community.name:
                tag_names = ['Software Engineer', 'Product Manager', 'Tech Lead', 'Senior Developer', 'Architect']
            elif 'Finance' in community.name:
                tag_names = ['Investment Banker', 'Private Equity', 'Venture Capital', 'Financial Analyst', 'Portfolio Manager']
            elif 'Research' in community.name:
                tag_names = ['Professor', 'Research Scientist', 'PhD Student', 'Postdoc', 'Academic']
            else:  # KGP '18 Batch
                tag_names = ['Hall President', 'General Secretary', 'Cultural Secretary', 'Sports Secretary', 'Class Representative']
            
            for tag_name in tag_names:
                tag = Tag.objects.create(
                    name=tag_name,
                    description=f'{tag_name} role in {community.name}',
                    community=community,
                    created_by=community.created_by
                )
                self.stdout.write(f'Created tag: {tag_name} in {community.name}')

        # Assign some tags to users
        self.stdout.write('Assigning tags to users...')
        for community in created_communities:
            community_tags = Tag.objects.filter(community=community)
            community_members = community.members.all()
            
            # Assign 1-2 random tags to each member
            for member in community_members:
                assigned_tags = community_tags.order_by('?')[:2]
                for tag in assigned_tags:
                    UserTag.objects.create(
                        user=member,
                        tag=tag,
                        assigned_by=community.created_by
                    )
                    self.stdout.write(f'Assigned tag {tag.name} to {member.email} in {community.name}')

        # Create sample posts with titles and images
        posts_data = [
            {
                'author': created_users[0],
                'community': created_communities[0],  # Entrepreneurship Hub
                'title': 'Series A Funding Success! 🚀',
                'content': 'Just closed our Series A funding! Huge thanks to the KGP network for the early support and mentorship. Looking forward to hiring more KGPians!',
                'image_url': 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop',
                'status': Post.Status.APPROVED
            },
            {
                'author': created_users[1],
                'community': created_communities[0],  # Entrepreneurship Hub
                'title': 'Looking for Co-founder - EdTech Startup',
                'content': 'Looking for a co-founder with a strong tech background for a new EdTech startup. DM me if you\'re interested in revolutionizing education!',
                'image_url': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
                'status': Post.Status.APPROVED
            },
            {
                'author': created_users[2],
                'community': created_communities[1],  # AI & Machine Learning
                'title': 'New Research Paper Published - Transformer Models in NLP',
                'content': 'Just published a new paper on transformer models in NLP. Happy to share the pre-print with anyone interested in the research.',
                'image_url': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop',
                'status': Post.Status.APPROVED
            },
            {
                'author': created_users[3],
                'community': created_communities[2],  # Bay Area Alumni
                'title': 'Bay Area Alumni Meetup - This Saturday!',
                'content': 'Bay Area alumni meetup this Saturday at 3 PM in Palo Alto. Great networking opportunity and some exciting announcements!',
                'image_url': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop',
                'status': Post.Status.APPROVED
            },
            {
                'author': created_users[1],
                'community': created_communities[3],  # Finance & Investing
                'title': 'Market Insights: Fintech Sector Growth',
                'content': 'Market insights: The fintech sector is showing strong growth. What are your thoughts on the current investment climate?',
                'image_url': 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop',
                'status': Post.Status.APPROVED
            },
            {
                'author': created_users[0],
                'community': created_communities[4],  # Research & Academia
                'title': 'IIT Kharagpur Research Collaboration Opportunity',
                'content': 'Exciting opportunity for research collaboration between IIT Kharagpur and international universities. Looking for PhD students and postdocs interested in interdisciplinary research.',
                'image_url': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
                'status': Post.Status.APPROVED
            },
            {
                'author': created_users[2],
                'community': created_communities[1],  # AI & Machine Learning
                'title': 'Machine Learning Workshop at IIT KGP',
                'content': 'Conducting a hands-on machine learning workshop for students and alumni. Topics include deep learning, computer vision, and natural language processing.',
                'image_url': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
                'status': Post.Status.APPROVED
            },
            {
                'author': created_users[3],
                'community': created_communities[5],  # KGP '18 Batch
                'title': 'KGP 2018 Batch Reunion - Save the Date!',
                'content': 'Mark your calendars! Our batch reunion is scheduled for December 2024. Planning committee is working hard to make it memorable. Stay tuned for updates!',
                'image_url': 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop',
                'status': Post.Status.APPROVED
            }
        ]

        for post_data in posts_data:
            post = Post.objects.create(**post_data)
            self.stdout.write(f'Created post: {post.content[:50]}...')

        # Create real IIT Kharagpur awards and scholarships
        scholarships_data = [
            {
                'title': 'Wg. Cdr. K R Krishnamurthy Memorial Endowment Award',
                'description': 'Memorial endowment award established in honor of Wg. Cdr. K R Krishnamurthy. Notice for the award will be published shortly by the Institute Academic Section.',
                'target_amount': Decimal('1000000.00'),
                'current_amount': Decimal('0.00'),
                'status': Scholarship.Status.ACTIVE,
                'image_url': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop'
            },
            {
                'title': 'Gajria PhD Thesis Award',
                'description': 'Award for outstanding PhD thesis work. The MoU has been submitted for inclusion in the Senate and Board of Governors (BoG) Report.',
                'target_amount': Decimal('500000.00'),
                'current_amount': Decimal('0.00'),
                'status': Scholarship.Status.ACTIVE,
                'image_url': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop'
            },
            {
                'title': 'Gajria Chair Professorship',
                'description': 'Conferred to Prof. Nilmoni Sarkar, Dept. of Chemistry, for 3 years. A plaque was presented during Foundation Day.',
                'target_amount': Decimal('2000000.00'),
                'current_amount': Decimal('0.00'),
                'status': Scholarship.Status.ACTIVE,
                'image_url': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
            },
            {
                'title': 'Gajria Faculty Excellence Award',
                'description': 'Conferred to Prof. Santanu Panda, Dept. of Chemistry, for 3 years. A plaque was presented during Foundation Day.',
                'target_amount': Decimal('1000000.00'),
                'current_amount': Decimal('0.00'),
                'status': Scholarship.Status.ACTIVE,
                'image_url': 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=300&fit=crop'
            },
            {
                'title': 'Markose Thomas Memorial Award',
                'description': 'Committee selected two papers for the 2023 Award. Supporting research excellence in computer science and AI.',
                'target_amount': Decimal('500000.00'),
                'current_amount': Decimal('3024115.00'),
                'status': Scholarship.Status.ACTIVE,
                'image_url': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop'
            },
            {
                'title': 'Dr. Suprabhat Ray Memorial Fellowship Fund',
                'description': 'Memorial fellowship fund for enhancing experimental facilities. The Chemistry Department has initiated the procurement process for two double-beam UV-Vis spectrophotometers.',
                'target_amount': Decimal('1000000.00'),
                'current_amount': Decimal('468832.00'),
                'status': Scholarship.Status.ACTIVE,
                'image_url': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop'
            },
            {
                'title': 'Prof Mandakini Majumdar Student Excellence Award',
                'description': 'Award for student excellence. Awardee for AY 2024–25: Chandrans Singh (Roll No- 22CS30017).',
                'target_amount': Decimal('500000.00'),
                'current_amount': Decimal('2015390.00'),
                'status': Scholarship.Status.ACTIVE,
                'image_url': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
            },
            {
                'title': 'Mrs. Sagarika Mukherjee Memorial Award',
                'description': 'Memorial award in honor of Mrs. Sagarika Mukherjee. No suitable candidate found for current year. New advertisement for 2025–26 to be published in Feb 2026.',
                'target_amount': Decimal('1000000.00'),
                'current_amount': Decimal('7345624.00'),
                'status': Scholarship.Status.ACTIVE,
                'image_url': 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=300&fit=crop'
            },
            {
                'title': 'Sidhanta - Jagan Akella Geochemistry Award',
                'description': 'Award for excellence in geochemistry research. Awaiting update from the Academic Section.',
                'target_amount': Decimal('500000.00'),
                'current_amount': Decimal('2509223.00'),
                'status': Scholarship.Status.ACTIVE,
                'image_url': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop'
            },
            {
                'title': 'Aruna & Ram Gopal Khandelia Award',
                'description': 'Award for academic excellence. Final selection completed; result to be announced shortly. Application for 2025 already published.',
                'target_amount': Decimal('1000000.00'),
                'current_amount': Decimal('7847600.00'),
                'status': Scholarship.Status.ACTIVE,
                'image_url': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop'
            },
            {
                'title': 'Vinod Gupta Leadership Scholarship',
                'description': 'Leadership scholarship for outstanding students. No suitable candidate found for current year. New advertisement for 2025–26 to be published in Feb 2026.',
                'target_amount': Decimal('500000.00'),
                'current_amount': Decimal('2811779.00'),
                'status': Scholarship.Status.ACTIVE,
                'image_url': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
            },
            {
                'title': 'Brundabana Sahu Student Award',
                'description': 'Student award for academic excellence. Awardee for AY 2024–25: Mr Debasish Panda (Roll No - 24EC10010). Amendment MoU finalized; in process for final signing.',
                'target_amount': Decimal('500000.00'),
                'current_amount': Decimal('325291.00'),
                'status': Scholarship.Status.ACTIVE,
                'image_url': 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=300&fit=crop'
            },
            {
                'title': 'Ritesh Ranjan Memorial Scholarship',
                'description': 'Memorial scholarship in honor of Ritesh Ranjan. The notification inviting applications for the 2024–2025 session was published on 17th March 2025. No suitable candidate has been found.',
                'target_amount': Decimal('200000.00'),
                'current_amount': Decimal('87385.00'),
                'status': Scholarship.Status.ACTIVE,
                'image_url': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop'
            },
            {
                'title': 'Richard D Souza Sports Scholarship',
                'description': 'Sports scholarship for outstanding athletes. Awardee for AY 2024–25: Ms Jangili Poojitha (Roll No- 21CE31015). The new advertisement for 2025-26 is in process.',
                'target_amount': Decimal('500000.00'),
                'current_amount': Decimal('0.00'),
                'status': Scholarship.Status.ACTIVE,
                'image_url': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop'
            },
            {
                'title': 'Learn-Earn-Return Scholarship',
                'description': 'Scholarship program for deserving students. Spring Semester 2024–25 and Autumn Semester 2025–26 awardees have been selected.',
                'target_amount': Decimal('2000000.00'),
                'current_amount': Decimal('12381072.00'),
                'status': Scholarship.Status.ACTIVE,
                'image_url': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
            },
            {
                'title': 'Arupratan Gupta Memorial Endowed Scholarship',
                'description': 'Memorial endowed scholarship in honor of Arupratan Gupta. Awardee for AY 2024–25: Annapureddy Vikhram Reddy (Roll No- 23EC10010). New advertisement for 2025–26 to be published in Feb 2026.',
                'target_amount': Decimal('500000.00'),
                'current_amount': Decimal('0.00'),
                'status': Scholarship.Status.ACTIVE,
                'image_url': 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=300&fit=crop'
            },
            {
                'title': 'Late Ned Mohan Chair Professorship',
                'description': 'Chair professorship in honor of Late Ned Mohan. The MoU has been submitted for inclusion in the Senate and Board of Governors (BoG) Report.',
                'target_amount': Decimal('3000000.00'),
                'current_amount': Decimal('0.00'),
                'status': Scholarship.Status.ACTIVE,
                'image_url': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop'
            }
        ]

        created_scholarships = []
        for scholarship_data in scholarships_data:
            scholarship = Scholarship.objects.create(**scholarship_data)
            created_scholarships.append(scholarship)
            self.stdout.write(f'Created scholarship: {scholarship.title}')

        # Create sample scholarship endowment
        endowment_data = [
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

        for contribution_data in endowment_data:
            contribution = ScholarshipContribution.objects.create(**contribution_data)
            self.stdout.write(f'Created contribution: INR {contribution.amount} to {contribution.scholarship.title}')

        self.stdout.write(
            self.style.SUCCESS(
                f'\nSuccessfully loaded sample data:\n'
                f'- {len(created_users)} users with alumni profiles\n'
                f'- {len(created_communities)} communities\n'
                f'- {len(posts_data)} posts\n'
                f'- {len(created_scholarships)} scholarships\n'
                f'- {len(endowment_data)} scholarship endowment\n\n'
                f'You can now login with any of these accounts using password "password123":\n'
                f'- {created_users[0].email}\n'
                f'- {created_users[1].email}\n'
                f'- {created_users[2].email}\n'
                f'- {created_users[3].email}'
            )
        )
