# User Portfolio Management System

A Spring Boot application for managing user portfolios and projects.

## Features

- User authentication with JWT
- Email verification
- Password reset functionality
- Profile management (name, job title, bio, profile image)
- Project management (CRUD operations)
- File upload for profile images

## Prerequisites

- Java 17 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd MyFolio_BE
```

2. Configure the database:
   - Create a MySQL database named `myfolio`
   - Update `src/main/resources/application.properties` with your database credentials

3. Configure email settings:
   - Update `src/main/resources/application.properties` with your email service credentials
   - For Gmail, you'll need to generate an App Password

4. Build the project:
```bash
mvn clean install
```

## Running the Application

1. Start the application:
```bash
mvn spring-boot:run
```

2. The application will be available at `http://localhost:8080`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### User Profile

- `GET /api/user/profile/{userId}` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/user/profile/image` - Update profile image

### Projects

- `GET /api/user/projects/{userId}` - Get user's projects
- `POST /api/user/projects` - Add a new project
- `PUT /api/user/projects/{projectId}` - Update a project
- `DELETE /api/user/projects/{projectId}` - Delete a project

## Security

- JWT-based authentication
- Password encryption using BCrypt
- CORS configuration for frontend integration
- Protected endpoints with Spring Security

## File Storage

Profile images are stored in the `uploads/profile-images` directory. Make sure this directory is created and has appropriate write permissions.

## Error Handling

The application includes comprehensive error handling for:
- Invalid credentials
- Duplicate email registration
- Invalid tokens
- Unauthorized access
- File upload errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 