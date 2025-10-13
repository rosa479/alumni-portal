#!/usr/bin/env python3
"""
Simple API test using urllib (no external dependencies)
Tests the post recommendation system with similarity-based ranking
"""

import urllib.request
import urllib.parse
import json
import sys

def test_posts_endpoint():
    """Test the /api/posts/ endpoint with authentication"""
    
    # First, let's try to access the posts endpoint
    url = "http://localhost:8000/api/posts/"
    
    try:
        # Try without authentication first to see what happens
        print("Testing posts endpoint...")
        req = urllib.request.Request(url)
        req.add_header('Content-Type', 'application/json')
        
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            print(f"Success! Got {len(data)} posts")
            
            # Show first few posts to verify ranking
            for i, post in enumerate(data[:3]):
                print(f"Post {i+1}: {post.get('title', 'No title')} by {post.get('author', 'Unknown')}")
                
    except urllib.error.HTTPError as e:
        if e.code == 401:
            print("Authentication required - this is expected")
            print("To test properly, you'll need to:")
            print("1. Register a user or use existing credentials")
            print("2. Login to get a JWT token")
            print("3. Include the token in the Authorization header")
        else:
            print(f"HTTP Error {e.code}: {e.reason}")
    except Exception as e:
        print(f"Error: {e}")
        print("Make sure the Django server is running: python manage.py runserver")

def print_test_instructions():
    """Print instructions for manual testing"""
    print("\n" + "="*60)
    print("MANUAL TESTING INSTRUCTIONS")
    print("="*60)
    print("1. Start the Django server:")
    print("   python manage.py runserver")
    print()
    print("2. Create test users (if not already done):")
    print("   python create_test_users.py")
    print()
    print("3. Test the recommendation algorithm:")
    print("   python test_recommendation_system.py")
    print()
    print("4. Use browser or Postman to test API:")
    print("   - POST http://localhost:8000/api/register/ (create user)")
    print("   - POST http://localhost:8000/api/login/ (get token)")
    print("   - GET http://localhost:8000/api/posts/ (with Authorization header)")
    print()
    print("5. Check that posts are ordered by similarity to logged-in user")
    print("   - Users from same department should appear first")
    print("   - Users from same graduation year should rank higher")
    print("="*60)

if __name__ == "__main__":
    print("Alumni Portal - Post Recommendation System Test")
    print("-" * 50)
    
    test_posts_endpoint()
    print_test_instructions()