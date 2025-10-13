# Simple Post Recommendation System - Alumni Portal

## Overview

I've implemented a **simple but effective recommendation system** for the Alumni Portal that shows posts based on **user similarity**. The system prioritizes posts from alumni who have similar profiles to the current user.

## How It Works

### 🎯 **Similarity Scoring Algorithm**

The system calculates a similarity score between the current user and each post author based on:

1. **Department Matching (50 points)**
   - Same department = 50 points
   - Different department = 0 points

2. **Graduation Year Proximity (40 points max)**
   - Same year = 40 points
   - 1 year difference = 30 points  
   - 2 years difference = 20 points
   - 3-5 years difference = 10 points
   - More than 5 years = 0 points

3. **Similarity Bonus (20 points)**
   - Same department AND graduation year within 2 years = +20 bonus points

### 📊 **Example Scoring**

For a user graduated in **2020 from Computer Science**:

| Post Author | Graduation Year | Department | Score | Ranking |
|-------------|----------------|------------|-------|---------|
| Alice | 2020 | Computer Science | **110** | 🥇 1st |
| Bob | 2019 | Computer Science | **100** | 🥈 2nd |  
| Charlie | 2018 | Computer Science | **90** | 🥉 3rd |
| Eva | 2015 | Computer Science | **60** | 4th |
| Diana | 2020 | Mechanical Eng | **40** | 5th |
| Frank | 2021 | Electrical Eng | **30** | 6th |

## 🔧 **Implementation Details**

### Modified Endpoint: `GET /api/posts/`

The existing `/api/posts/` endpoint now returns **personalized recommendations** instead of just chronological posts.

### Key Features:

1. **Performance Optimized**
   - Only considers posts from last 30 days for better performance
   - Falls back to latest 50 posts if no recent posts available
   - Uses `select_related` for efficient database queries

2. **Smart Filtering**
   - Excludes user's own posts
   - Only shows approved posts
   - Handles users without profiles gracefully

3. **Intelligent Sorting**
   - Primary: Similarity score (highest first)
   - Secondary: Post recency (newest first)

### Code Structure:

```python
class PostListCreateView(generics.ListCreateAPIView):
    def get_queryset(self):
        # 1. Get user's profile data
        # 2. Filter recent approved posts
        # 3. Calculate similarity scores
        # 4. Sort by score + recency
        # 5. Return top 20 posts
        
    def _calculate_user_similarity(self, current_user, post_author, user_graduation_year, user_department):
        # Calculates similarity score based on department and graduation year
```

## 🚀 **Usage**

### API Request:
```http
GET /api/posts/
Authorization: Bearer <jwt-token>
```

### Response:
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Great internship opportunity at Google!",
    "content": "Hey fellow CS graduates...",
    "author_name": "Alice Smith",
    "author_profile_picture": "https://example.com/alice.jpg", 
    "community_name": "Computer Science",
    "graduation_year": 2020,
    "department": "Computer Science",
    "created_at": "2025-10-13T10:30:00Z",
    "likes_count": 15,
    "comments_count": 8,
    "is_liked": false
  }
]
```

## 💡 **Why This Approach Works**

### 1. **Relevant Content**
Alumni are more likely to be interested in posts from people with similar backgrounds:
- **Same Department**: Shared academic interests and career paths
- **Similar Graduation Year**: Similar life stage and experiences

### 2. **Network Effect** 
People from the same department and year likely:
- Know each other personally
- Share mutual connections
- Have similar career trajectories

### 3. **Engagement Boost**
Users are more likely to:
- Read posts from familiar backgrounds
- Engage with relevant content
- Build meaningful connections

## 🔄 **Fallback Strategy**

The system gracefully handles edge cases:

1. **No User Profile**: Returns chronological posts
2. **No Recent Posts**: Shows latest 50 posts regardless of date
3. **No Similar Users**: Still shows posts sorted by recency

## 📈 **Expected Results**

Users will see:
- **More relevant posts** at the top of their feed
- **Better engagement** with content from similar alumni
- **Stronger connections** within their academic/professional community
- **Personalized experience** without complex setup

## 🛠 **Testing**

I've included a test script (`test_recommendation_system.py`) that validates the scoring algorithm with sample data. The test shows the expected ranking based on user similarity.

## 🎯 **Benefits**

✅ **Simple & Effective**: Easy to understand and maintain  
✅ **No Additional Setup**: Works with existing user profiles  
✅ **Performance Friendly**: Optimized database queries  
✅ **Graceful Degradation**: Falls back to chronological when needed  
✅ **Immediate Impact**: Works as soon as users have profiles  

This recommendation system provides a significant improvement in content relevance while maintaining simplicity and performance!