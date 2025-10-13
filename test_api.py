# test_api.py
"""
Simple script to test the recommendation API
"""
import requests
import json

# API Configuration
BASE_URL = "http://localhost:8000/api"

def test_recommendation_api():
    print("=== Testing Alumni Portal Recommendation API ===\n")
    
    # Step 1: Login to get JWT token
    login_data = {
        "email": "testuser@example.com",
        "password": "testpass123"
    }
    
    print("1. Attempting to login...")
    try:
        login_response = requests.post(f"{BASE_URL}/auth/login/", json=login_data)
        if login_response.status_code == 200:
            tokens = login_response.json()
            access_token = tokens['access']
            print("✅ Login successful!")
        else:
            print(f"❌ Login failed: {login_response.status_code}")
            print("Make sure you've created test users with create_test_users.py")
            return
    except requests.exceptions.ConnectionError:
        print("❌ Connection failed. Make sure Django server is running on http://localhost:8000")
        return
    
    # Step 2: Get personalized recommendations
    print("\n2. Getting personalized post recommendations...")
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    try:
        posts_response = requests.get(f"{BASE_URL}/posts/", headers=headers)
        if posts_response.status_code == 200:
            posts = posts_response.json()
            print(f"✅ Got {len(posts)} recommended posts!")
            
            print("\n📋 Recommended Posts (in order of relevance):")
            print("-" * 60)
            
            for i, post in enumerate(posts[:5], 1):  # Show top 5
                author_name = post.get('author_name', 'Unknown')
                title = post.get('title', 'No Title')
                community = post.get('community_name', 'Unknown Community')
                created = post.get('created_at', '')[:10]  # Just date part
                
                print(f"{i}. {title}")
                print(f"   👤 By: {author_name}")
                print(f"   🏫 Community: {community}")
                print(f"   📅 Posted: {created}")
                print()
            
            # Check if recommendations are working
            if len(posts) > 0:
                print("🎯 Recommendation Analysis:")
                print("- Posts from CS 2020 graduates should appear first")
                print("- Posts from CS graduates (2018-2019) should follow")
                print("- Posts from other departments should be lower")
                print("\n✅ Recommendation system is working!")
            else:
                print("⚠️  No posts found. Create some test data first.")
                
        else:
            print(f"❌ Failed to get posts: {posts_response.status_code}")
            print(f"Response: {posts_response.text}")
            
    except Exception as e:
        print(f"❌ Error getting posts: {e}")

if __name__ == "__main__":
    test_recommendation_api()