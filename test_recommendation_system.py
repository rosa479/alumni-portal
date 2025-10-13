# test_recommendation_system.py
"""
Simple script to test the recommendation system logic
"""

# Mock data to test our similarity algorithm
def calculate_user_similarity(current_user_data, post_author_data):
    """
    Test version of our similarity calculation
    """
    user_graduation_year = current_user_data['graduation_year']
    user_department = current_user_data['department']
    
    author_graduation_year = post_author_data['graduation_year']
    author_department = post_author_data['department']
    
    similarity_score = 0
    
    # Department similarity (highest weight - 50 points)
    if user_department == author_department:
        similarity_score += 50
        print(f"Same department ({user_department}): +50 points")
    
    # Graduation year proximity (40 points max)
    year_difference = abs(user_graduation_year - author_graduation_year)
    if year_difference == 0:
        similarity_score += 40  # Same year
        print(f"Same graduation year ({user_graduation_year}): +40 points")
    elif year_difference == 1:
        similarity_score += 30  # 1 year difference
        print(f"1 year difference: +30 points")
    elif year_difference == 2:
        similarity_score += 20  # 2 years difference
        print(f"2 years difference: +20 points")
    elif year_difference <= 5:
        similarity_score += 10  # Within 5 years
        print(f"{year_difference} years difference: +10 points")
    else:
        print(f"{year_difference} years difference: +0 points")
    
    # Bonus for same department AND close graduation year
    if (user_department == author_department and year_difference <= 2):
        similarity_score += 20  # Bonus for being very similar
        print(f"Same department + close year bonus: +20 points")
    
    return similarity_score

# Test cases
print("=== RECOMMENDATION SYSTEM TEST ===\n")

# Current user
current_user = {
    'graduation_year': 2020,
    'department': 'Computer Science'
}

# Test post authors
test_authors = [
    {'name': 'Alice', 'graduation_year': 2020, 'department': 'Computer Science'},
    {'name': 'Bob', 'graduation_year': 2019, 'department': 'Computer Science'},
    {'name': 'Charlie', 'graduation_year': 2018, 'department': 'Computer Science'},
    {'name': 'Diana', 'graduation_year': 2020, 'department': 'Mechanical Engineering'},
    {'name': 'Eva', 'graduation_year': 2015, 'department': 'Computer Science'},
    {'name': 'Frank', 'graduation_year': 2021, 'department': 'Electrical Engineering'},
]

print(f"Current User: {current_user['graduation_year']} {current_user['department']}\n")

results = []
for author in test_authors:
    print(f"Testing similarity with {author['name']} ({author['graduation_year']} {author['department']}):")
    score = calculate_user_similarity(current_user, author)
    results.append((author['name'], score))
    print(f"Final Score: {score}\n")

print("=== RECOMMENDATION RANKING ===")
results.sort(key=lambda x: x[1], reverse=True)
for i, (name, score) in enumerate(results, 1):
    print(f"{i}. {name}: {score} points")

print("\n=== EXPECTED RANKING EXPLANATION ===")
print("1. Alice: Same department + same year + bonus = 110 points")
print("2. Bob: Same department + 1 year diff + bonus = 100 points") 
print("3. Charlie: Same department + 2 year diff + bonus = 90 points")
print("4. Eva: Same department + 5 year diff = 60 points")
print("5. Diana: Same year + different department = 40 points")
print("6. Frank: Different department + 1 year diff = 30 points")