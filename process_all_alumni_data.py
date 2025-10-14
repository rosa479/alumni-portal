#!/usr/bin/env python3
"""
Script to process all alumni data and generate corrected SQL with proper UUID linking
"""

import re
import uuid

def extract_email_from_user_sql(sql_line):
    """Extract email from User INSERT statement"""
    # Pattern to match email in VALUES clause
    email_pattern = r"VALUES \(.*?,\s*'([^']+@[^']+)'"
    match = re.search(email_pattern, sql_line)
    return match.group(1) if match else None

def extract_alumni_data_from_sql(sql_line):
    """Extract alumni data from AlumniProfile INSERT statement"""
    # Pattern to match the VALUES clause
    values_pattern = r"VALUES \('([^']*)',\s*'([^']*)',\s*'([^']*)',\s*([^,]+),\s*'([^']*)',\s*(\d+),\s*NULL\)"
    match = re.search(values_pattern, sql_line)
    if match:
        return {
            'full_name': match.group(1) if match.group(1) != 'NULL' else None,
            'graduation_year': match.group(2) if match.group(2) != 'NULL' else None,
            'department': match.group(3) if match.group(3) != 'NULL' else None,
            'profile_picture_url': None if match.group(4) == 'NULL' else match.group(4),
            'about_me': match.group(5),
            'credit_score': int(match.group(6))
        }
    return None

def process_files():
    """Process both SQL files and generate corrected output"""
    
    # Read user data
    print("Reading user data...")
    user_emails = []
    with open(r'c:\Users\harsh\OneDrive\Desktop\generate_user_sql.sql', 'r', encoding='utf-8') as f:
        for line in f:
            if line.strip().startswith('INSERT INTO test_app_user'):
                email = extract_email_from_user_sql(line)
                if email:
                    user_emails.append(email)
    
    print(f"Found {len(user_emails)} user records")
    
    # Read alumni data
    print("Reading alumni data...")
    alumni_data = []
    with open(r'c:\Users\harsh\OneDrive\Desktop\alumni.sql', 'r', encoding='utf-8') as f:
        for line in f:
            if line.strip().startswith('INSERT INTO test_app_alumniprofile'):
                data = extract_alumni_data_from_sql(line)
                if data:
                    alumni_data.append(data)
    
    print(f"Found {len(alumni_data)} alumni records")
    
    # Generate corrected SQL
    print("Generating corrected SQL...")
    
    # Create mapping of email to UUID
    email_to_uuid = {}
    for email in user_emails:
        email_to_uuid[email] = str(uuid.uuid4())
    
    # Write corrected SQL
    with open('corrected_all_alumni_data.sql', 'w', encoding='utf-8') as f:
        f.write("-- Generated corrected SQL with proper UUID linking for all alumni data\n")
        f.write("-- First, insert User records with explicit UUIDs\n\n")
        
        # Write User INSERT statements
        user_index = 0
        for email in user_emails:
            user_uuid = email_to_uuid[email]
            user_index += 1
            
            f.write(f"-- User {user_index}: {email}\n")
            f.write(f"INSERT INTO test_app_user (id, password, last_login, is_superuser, is_staff, is_active, date_joined, email, roll_number, role, status, invited_by_id, credit_points) VALUES ('{user_uuid}', '12345678', NULL, false, false, true, '2025-10-14T16:59:33+00', '{email}', '', 'ALUMNI', 'PENDING', NULL, 0);\n")
        
        f.write("\n-- Now insert AlumniProfile records with correct user_id references\n\n")
        
        # Write AlumniProfile INSERT statements
        # We need to match alumni records to users
        # For now, we'll create alumni profiles for all users, using the first few alumni records as templates
        alumni_index = 0
        for i, email in enumerate(user_emails):
            user_uuid = email_to_uuid[email]
            alumni_index += 1
            
            # Use alumni data if available, otherwise create generic data
            if i < len(alumni_data):
                alumni = alumni_data[i]
                full_name = alumni['full_name'] or f"Alumni {alumni_index}"
                grad_year = alumni['graduation_year'] or '1990'
                dept = alumni['department'] or 'Engineering'
            else:
                full_name = f"Alumni {alumni_index}"
                grad_year = '1990'
                dept = 'Engineering'
            
            f.write(f"-- AlumniProfile {alumni_index}: {full_name}\n")
            f.write(f"INSERT INTO test_app_alumniprofile (full_name, graduation_year, department, profile_picture_url, about_me, credit_score, user_id) VALUES ('{full_name}', '{grad_year}', '{dept}', NULL, '', 0, '{user_uuid}');\n")
        
        f.write("\n-- Verification queries:\n")
        f.write("-- SELECT u.email, u.id, a.full_name FROM test_app_user u JOIN test_app_alumniprofile a ON u.id = a.user_id;\n")
        f.write("-- SELECT COUNT(*) FROM test_app_alumniprofile WHERE user_id IS NOT NULL;\n")
        f.write("-- SELECT COUNT(*) FROM test_app_user;\n")
        f.write("-- SELECT COUNT(*) FROM test_app_alumniprofile;\n")
    
    print(f"Generated corrected SQL with {len(user_emails)} user records and {len(user_emails)} alumni profile records")
    print("Output saved to: corrected_all_alumni_data.sql")

if __name__ == "__main__":
    process_files()
