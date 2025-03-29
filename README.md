# Job Board API

This project is a **Job Board API** that allows users to post and apply for jobs with role-based access control (RBAC). It includes **JWT authentication**, **Multer file upload for resumes**, and **database constraints** for security.

## Features

### ✅ User Authentication
- Users can **sign up** and **log in** using JWT-based authentication.
- **JWT token** is returned upon login for secure API access.

### ✅ Role-Based Access Control (RBAC)
- **Admin**: Can view all job postings.
- **Recruiter**: Can create and manage jobs posted by their company.
- **Job Seeker**: Can view and apply to all jobs.

### ✅ Job Posting & Management
- Recruiters can **add**, **update**, and **delete** jobs.
- Only **the creator (createdBy user)** can update or delete a job post.
- **Admins** can view all job records.
- **Recruiters** can see only their company's job postings.
- **Job seekers** can see all job postings.

### ✅ Resume Upload with Multer
- **Job seekers can upload a PDF resume** when applying for a job.
- Resumes are stored **locally** in `uploads/resumes/`.
- The filename format: **`timestamp-originalname.pdf`**.
- The system updates:
  - `applied_users` field (list of user IDs who applied).
  - `resumes` field (stores `{ userId, resumePath }`).

## API Endpoints

### 🟢 Authentication
#### `POST /auth/signup`
- **Registers a new user**.
- Requires: `email`, `password`, `role`, `companyId` (if recruiter).

#### `POST /auth/login`
- **Logs in a user** and returns a JWT token.
- Requires: `email`, `password`.

### 🟢 Job Routes
#### `POST /jobs/`
- **Create a job** (Only recruiters can post jobs).
- **Requires JWT authentication**.

#### `GET /jobs/`
- **Get jobs based on role**:
  - `Admin`: Fetches all jobs.
  - `Recruiter`: Fetches jobs for their company.
  - `Job Seeker`: Fetches all jobs.

#### `PUT /jobs/:id`
- **Update a job** (Only the creator can update).
- Requires JWT authentication.

#### `PUT /jobs/:id/uploadResume`
- **Allows a job seeker to upload a PDF resume**.
- Stores file in `uploads/resumes/`.
- Updates `applied_users` and `resumes` fields.
- Requires JWT authentication.

### 🔐 Middleware: JWT Authentication
The `authenticateToken` middleware is used to:
- **Verify JWT tokens**.
- **Extract user role** to control access.
- **Deny unauthorized actions** (e.g., job updates by non-creators).

## Installation & Setup
```bash
# Clone the repository
git clone https://github.com/yourrepo/job-board-api.git
cd job-board-api

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env  # Update .env with database and JWT secrets

# Run the server
npm start
```

## Technologies Used
- **Node.js** (Express.js for backend)
- **Sequelize ORM** (MySQL database)
- **JWT Authentication**
- **Multer** (File uploads)
- **Role-based Access Control (RBAC)**

---

### 🚀 Future Enhancements
- **Cloud storage for resumes (AWS S3, Firebase, etc.)**
- **Email notifications upon job applications**
- **Job application status tracking**


