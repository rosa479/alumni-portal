# create_test_users.py
"""
Simple Django script to create test users for the recommendation system
Run this with: python manage.py shell < create_test_users.py
"""

from django.contrib.auth import get_user_model
from test_app.models import AlumniProfile, Community, Post

User = get_user_model()

def create_test_data():
    print("Creating test users and posts for recommendation system...")
    
    # Create a test community
    community, created = Community.objects.get_or_create(
        name="Computer Science Alumni",
        defaults={'description': "Alumni from Computer Science Department"}
    )
    
    # Create test users with different profiles
    users_data = [
        {
            'email': 'alice2020cs@example.com',
            'roll_number': '20CS001',
            'full_name': 'Alice Johnson', 
            'graduation_year': 2020,
            'department': 'Computer Science'
        },
        {
            'email': 'bob2019cs@example.com', 
            'roll_number': '19CS001',
            'full_name': 'Bob Smith',
            'graduation_year': 2019,
            'department': 'Computer Science'
        },
        {
            'email': 'charlie2018cs@example.com',
            'roll_number': '18CS001', 
            'full_name': 'Charlie Brown',
            'graduation_year': 2018,
            'department': 'Computer Science'
        },
        {
            'email': 'diana2020me@example.com',
            'roll_number': '20ME001',
            'full_name': 'Diana Wilson',
            'graduation_year': 2020,
            'department': 'Mechanical Engineering'
        },
        {
            'email': 'testuser@example.com',
            'roll_number': '20CS999',
            'full_name': 'Test User',
            'graduation_year': 2020, 
            'department': 'Computer Science'
        }
    ]
    
    created_users = []
    for user_data in users_data:
        # Create user if doesn't exist
        user, created = User.objects.get_or_create(
            email=user_data['email'],
            defaults={
                'roll_number': user_data['roll_number'],
                'status': User.Status.VERIFIED
            }
        )
        if created:
            user.set_password('testpass123')
            user.save()
            print(f"Created user: {user.email}")
        
        # Create or update profile
        profile, created = AlumniProfile.objects.get_or_create(
            user=user,
            defaults={
                'full_name': user_data['full_name'],
                'graduation_year': user_data['graduation_year'],
                'department': user_data['department']
            }
        )
        if created:
            print(f"Created profile for: {user_data['full_name']}")
        
        created_users.append(user)
    
    # Create sample posts from different users
    posts_data = [
        {
            'author_email': 'alice2020cs@example.com',
            'title': 'Amazing Google Internship Experience!',
            'content': 'Just finished my summer internship at Google. Great experience working on ML projects!'
        },
        {
            'author_email': 'bob2019cs@example.com', 
            'title': 'Startup Journey - Year 2',
            'content': 'Two years into building my startup. Lessons learned and challenges faced.'
        },
        {
            'author_email': 'charlie2018cs@example.com',
            'title': 'PhD Life at MIT',
            'content': 'Sharing my experience doing PhD in Computer Vision at MIT. AMA!'
        },
        {
            'author_email': 'diana2020me@example.com',
            'title': 'Mechanical Engineering Career Tips', 
            'content': 'Transitioning from college to industry in mechanical engineering. Here are my tips!'
        }
    ]
    
    for post_data in posts_data:
        try:
            author = User.objects.get(email=post_data['author_email'])
            post, created = Post.objects.get_or_create(
                title=post_data['title'],
                defaults={
                    'author': author,
                    'community': community,
                    'content': post_data['content'],
                    'status': Post.Status.APPROVED
                }
            )
            if created:
                print(f"Created post: {post.title}")
        except User.DoesNotExist:
            print(f"User not found: {post_data['author_email']}")
    
    print("\n=== Test Data Created Successfully! ===")
    print("\nTest Users:")
    for user in created_users:
        profile = getattr(user, 'alumni_profile', None)
        if profile:
            print(f"- {user.email} | {profile.graduation_year} {profile.department}")
    
    print(f"\nTotal Posts: {Post.objects.filter(status=Post.Status.APPROVED).count()}")
    print("\n=== How to Test ===")
    print("1. Login with testuser@example.com (password: testpass123)")
    print("2. Call GET /api/posts/ to see personalized recommendations")
    print("3. Posts from Alice (same year + dept) should appear first")
    print("4. Posts from Bob/Charlie (same dept, close years) should follow")
    print("5. Diana's post (same year, different dept) should be lower")

if __name__ == "__main__":
    create_test_data()