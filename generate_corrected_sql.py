#!/usr/bin/env python3
"""
Script to generate corrected SQL that properly links AlumniProfile records to User records
"""

import uuid

# User data from generate_user_sql.sql
users_data = [
    ('gautamukh@gmail.com', 'Gautam Mukherjee', '1985', 'ECE'),
    ('goutamdas.iift@gmail.com', 'Goutam Das', '1993', 'ECE'),
    ('somnathchatterjeegm@gmail.com', 'Somnath Chatterjee', '1985', 'EE'),
    ('sandeepsenapati24@gmail.com', 'Sandeep Senapati', None, None),
    ('roybanerjee.supriyo@gmail.com', 'Supriyo Roy Banerjee', '2022', 'EMBA'),
    ('sampadhabal@gmail.com', 'Sampa Dhabal', '2005', 'PHY'),
    ('amitava@banglanatak.com', 'Amitava Bhattacharya', '1989', 'MIN'),
    ('prateepguha@outlook.com', 'Prateep Guha', '1977', 'MET'),
    ('soumitra@outlook.com', 'Soumitra Bhattacharya', '1977', 'ME'),
    ('abb1953@1953.com', 'Abhijit Banerjee', '1977', 'MET'),
    ('profdciitkgp@gmail.com', 'Debashish Chakravarty', '1993', 'MIN'),
    ('surelia@yahoo.com', 'Anand Surelia', '1997', 'CSE'),
    ('saiqat@yahoo.com', 'Saikat Sarkar', '1989', 'App Geo'),
    ('nirmal_agarwala@yahoo.com', 'Nirmal Kumar Agarwala', '1985', 'CSE'),
    ('soumimukherjee02@gmail.com', 'Soumi Mukherjee', '2018', 'EMBA'),
    ('amit.bhutoria@gmail.com', 'Amit Bhutoria', '2006', 'AE'),
    ('dubey.umesh@gmail.com', 'Umesh Kumar Dubey', '1975', 'EE'),
    ('Adatta@powertechcons.com', 'Arnab Datta', '1984', 'MET'),
    ('saktipadajana@yahoo.com', 'Saktipada Jana', '1986', 'MIN'),
]

print("-- Generated corrected SQL with proper UUID linking")
print("-- First, insert User records and capture their UUIDs")
print()

# Generate User INSERT statements with explicit UUIDs
user_uuids = {}
for i, (email, name, grad_year, dept) in enumerate(users_data):
    user_uuid = str(uuid.uuid4())
    user_uuids[email] = user_uuid
    
    print(f"-- User {i+1}: {name}")
    print(f"INSERT INTO test_app_user (id, password, last_login, is_superuser, is_staff, is_active, date_joined, email, roll_number, role, status, invited_by_id, credit_points) VALUES ('{user_uuid}', '12345678', NULL, false, false, true, '2025-10-14T16:59:33+00', '{email}', '', 'ALUMNI', 'PENDING', NULL, 0);")

print()
print("-- Now insert AlumniProfile records with correct user_id references")
print()

# Generate AlumniProfile INSERT statements with correct user_id
for i, (email, name, grad_year, dept) in enumerate(users_data):
    user_uuid = user_uuids[email]
    
    # Handle NULL values properly
    grad_year_str = f"'{grad_year}'" if grad_year else "NULL"
    dept_str = f"'{dept}'" if dept else "NULL"
    
    print(f"-- AlumniProfile {i+1}: {name}")
    print(f"INSERT INTO test_app_alumniprofile (full_name, graduation_year, department, profile_picture_url, about_me, credit_score, user_id) VALUES ('{name}', {grad_year_str}, {dept_str}, NULL, '', 0, '{user_uuid}');")

print()
print("-- Verification queries:")
print("-- SELECT u.email, u.id, a.full_name FROM test_app_user u JOIN test_app_alumniprofile a ON u.id = a.user_id;")
print("-- SELECT COUNT(*) FROM test_app_alumniprofile WHERE user_id IS NOT NULL;")
