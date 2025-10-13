# test_app/management/commands/initialize_recommendations.py

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import models
from test_app.models import Post, UserPreference, RecommendationScore

User = get_user_model()

class Command(BaseCommand):
    help = 'Initialize recommendation system by calculating initial scores and preferences'

    def add_arguments(self, parser):
        parser.add_argument(
            '--recalculate',
            action='store_true',
            help='Recalculate all existing recommendation scores',
        )

    def handle(self, *args, **options):
        self.stdout.write('Initializing recommendation system...')

        if options['recalculate']:
            self.stdout.write('Clearing existing recommendation scores...')
            RecommendationScore.objects.all().delete()

        # Get all users
        users = User.objects.filter(status=User.Status.VERIFIED)
        total_users = users.count()

        # Get all approved posts
        posts = Post.objects.filter(status=Post.Status.APPROVED)
        total_posts = posts.count()

        self.stdout.write(f'Processing {total_users} users and {total_posts} posts...')

        processed_users = 0
        for user in users:
            try:
                # Create user preferences if they don't exist
                preference, created = UserPreference.objects.get_or_create(user=user)
                if created:
                    self.stdout.write(f'Created preferences for user: {user.email}')

                # Initialize recommendation service
                recommendation_service = PostRecommendationService(user)

                # Calculate recommendations for a subset of posts (to avoid overwhelming the system)
                user_posts = posts[:50]  # Limit to 50 most recent posts per user initially
                
                processed_posts = 0
                for post in user_posts:
                    # Skip user's own posts
                    if post.author == user:
                        continue
                    
                    # Calculate recommendation score
                    try:
                        recommendation_service._calculate_post_score(post)
                        processed_posts += 1
                    except Exception as e:
                        self.stdout.write(
                            self.style.WARNING(f'Error calculating score for post {post.id}: {str(e)}')
                        )

                processed_users += 1
                if processed_users % 10 == 0:
                    self.stdout.write(f'Processed {processed_users}/{total_users} users...')

            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Error processing user {user.email}: {str(e)}')
                )

        # Generate some statistics
        total_scores = RecommendationScore.objects.count()
        avg_score = RecommendationScore.objects.aggregate(
            avg_score=models.Avg('total_score')
        )['avg_score']

        self.stdout.write(
            self.style.SUCCESS(
                f'Recommendation system initialized successfully!\n'
                f'- Processed {processed_users} users\n'
                f'- Generated {total_scores} recommendation scores\n'
                f'- Average recommendation score: {avg_score:.3f if avg_score else 0}'
            )
        )

        # Provide some sample recommendations
        if users.exists():
            sample_user = users.first()
            recommendation_service = PostRecommendationService(sample_user)
            sample_recommendations = recommendation_service.get_recommendations(limit=5)
            
            self.stdout.write(f'\nSample recommendations for {sample_user.email}:')
            for i, post in enumerate(sample_recommendations, 1):
                score = RecommendationScore.objects.filter(
                    user=sample_user, post=post
                ).first()
                score_value = score.total_score if score else 0.0
                self.stdout.write(f'{i}. "{post.title}" (Score: {score_value:.3f})')