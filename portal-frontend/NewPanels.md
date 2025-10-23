# Frontend Components Structure
Core Components:
```
AdminPanel.jsx - Main admin dashboard

ActiveScholarships.jsx - Displays active scholarships

AllScholarships.jsx - Complete scholarship management

Applications.jsx - Scholarship applications list

ApplicationDetails.jsx - Individual application review

PendingApprovals.jsx - Pending applications

NewScholarship.jsx - Scholarship creation form
```

# Backend Schema Recommendations
### 1. Scholarship Schema
```
{
  _id: ObjectId,
  name: String, // "Merit Scholarship"
  description: String,
  amount: String, // "₹20,000"
  active: Boolean,
  eligibility: String,
  deadline: Date,
  createdAt: Date,
  updatedAt: Date
}
```
### 2. Application Schema
```
{
  _id: ObjectId,
  studentId: ObjectId, // Reference to Student
  scholarshipId: ObjectId, // Reference to Scholarship
  name: String,
  roll: String,
  department: String,
  email: String,
  fatherName: String,
  motherName: String,
  fatherOccupation: String,
  motherOccupation: String,
  annualIncome: String,
  gpa: String,
  reason: String, // Application reason
  approved: Boolean, // null = pending, true = approved, false = rejected
  rejectionReason: String,
  documents: {
    aadhar: String, // File path or URL
    bankPassbook: String,
    incomeCertificate: String,
    marksheet: String
  },
  photo: String, // Student photo URL
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Meeting Outcomes Schema
```
{
  _id: ObjectId,
  date: Date,
  summary: String,
  attendees: [String],
  decisions: [String],
  createdAt: Date
}
```

## API Endpoints Required
### Scholarships
```
GET    /api/scholarships           - Get all scholarships
GET    /api/scholarships/active    - Get active scholarships
POST   /api/scholarships           - Create new scholarship
PUT    /api/scholarships/:id       - 
```
### Update scholarship
```
PATCH  /api/scholarships/:id/toggle - Toggle active status
DELETE /api/scholarships/:id        - Delete scholarship
```
### Applications
```
GET    /api/applications           - Get all applications
GET    /api/applications/pending   - Get pending applications
GET    /api/applications/:id       - Get application details
POST   /api/applications           - Submit new application
PUT    /api/applications/:id/approve - Approve application
PUT    /api/applications/:id/reject - Reject application
```
### Admin & Analytics
```
GET    /api/admin/stats            - Get dashboard statistics
GET    /api/meeting-outcomes       - Get meeting records
POST   /api/meeting-outcomes       - Create meeting record
GET    /api/posts                  - Get announcements
POST   /api/posts                  - Create announcement
```