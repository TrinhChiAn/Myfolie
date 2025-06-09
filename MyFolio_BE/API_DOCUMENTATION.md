# API Documentation - MyFolio Backend

## Base URL
```
http://localhost:8080/api
```

## Authentication Endpoints

### 1. Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "yourPassword123"
}
```

**Response (200 OK):**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `409 Conflict`: Email already exists
- `400 Bad Request`: Invalid input data

### 2. Login
```http
POST /auth/login
```

**Request Body:**
```json
{
    "email": "john@example.com",
    "password": "yourPassword123"
}
```

**Response (200 OK):**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid credentials
- `400 Bad Request`: Invalid input data

### 3. Forgot Password
```http
POST /auth/forgot-password?email=john@example.com
```

**Response (200 OK):**
```json
{}
```

**Error Responses:**
- `404 Not Found`: User not found

### 4. Reset Password
```http
POST /auth/reset-password
```

**Request Parameters:**
- `token`: Reset password token (received via email)
- `newPassword`: New password

**Response (200 OK):**
```json
{}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or expired token
- `400 Bad Request`: Invalid password format

## User Profile Endpoints

### 1. Get User Profile
```http
GET /user/profile/{userId}
```

**Response (200 OK):**
```json
{
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "jobTitle": "Software Developer",
    "bio": "Passionate about coding...",
    "profileImage": "profile-123.jpg"
}
```

**Error Responses:**
- `404 Not Found`: User not found

### 2. Update Profile
```http
PUT /user/profile
```
**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
    "name": "John Doe",
    "jobTitle": "Senior Developer",
    "bio": "Updated bio..."
}
```

**Response (200 OK):**
```json
{
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "jobTitle": "Senior Developer",
    "bio": "Updated bio...",
    "profileImage": "profile-123.jpg"
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token
- `400 Bad Request`: Invalid input data

### 3. Update Profile Image
```http
POST /user/profile/image
```
**Headers:**
```
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data
```

**Request Body:**
- `file`: Image file (max size: 10MB)

**Response (200 OK):**
```json
{
    "id": 1,
    "name": "John Doe",
    "profileImage": "profile-123.jpg",
    ...
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token
- `400 Bad Request`: File too large or invalid format

## Project Endpoints

### 1. Get User Projects
```http
GET /user/projects/{userId}
```

**Response (200 OK):**
```json
[
    {
        "id": 1,
        "name": "Project 1",
        "demoUrl": "https://demo.example.com",
        "repositoryUrl": "https://github.com/user/repo",
        "description": "Project description..."
    },
    ...
]
```

### 2. Add New Project
```http
POST /user/projects
```
**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
    "name": "New Project",
    "demoUrl": "https://demo.example.com",
    "repositoryUrl": "https://github.com/user/repo",
    "description": "Project description..."
}
```

**Response (200 OK):**
```json
{
    "id": 2,
    "name": "New Project",
    "demoUrl": "https://demo.example.com",
    "repositoryUrl": "https://github.com/user/repo",
    "description": "Project description..."
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token
- `400 Bad Request`: Invalid input data

### 3. Update Project
```http
PUT /user/projects/{projectId}
```
**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
    "name": "Updated Project",
    "demoUrl": "https://demo.example.com",
    "repositoryUrl": "https://github.com/user/repo",
    "description": "Updated description..."
}
```

**Response (200 OK):**
```json
{
    "id": 2,
    "name": "Updated Project",
    "demoUrl": "https://demo.example.com",
    "repositoryUrl": "https://github.com/user/repo",
    "description": "Updated description..."
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Project not found
- `403 Forbidden`: Not authorized to update this project

### 4. Delete Project
```http
DELETE /user/projects/{projectId}
```
**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Project not found
- `403 Forbidden`: Not authorized to delete this project

## Error Response Format

All error responses follow this format:
```json
{
    "status": "HTTP_STATUS",
    "timestamp": "20-03-2024 10:30:45",
    "message": "Error message",
    "debugMessage": "Detailed error message",
    "subErrors": []
}
```

## Authentication
- All protected endpoints require a JWT token in the Authorization header
- Format: `Authorization: Bearer {jwt_token}`
- Token is obtained from login or register endpoints
- Token expiration: 24 hours

## File Upload Constraints
- Maximum file size: 10MB
- Supported formats: JPG, PNG, GIF
- Files are stored in: `uploads/profile-images/`

## Validation Rules
- Email must be valid format
- Password minimum length: 8 characters
- Project name is required
- Profile image maximum size: 10MB 