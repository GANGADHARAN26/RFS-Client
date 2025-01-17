# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
Project Documentation

Features Implemented

1. User Authentication

Login Functionality:

Users can log in using their email and password.

Authentication is handled using JWT tokens.

Tokens are stored in cookies for secure access.

Forgot Password:

Users can request a password reset link via email.

OTP-based password reset is implemented.

Change Password:

Users can update their password after validating OTP and providing a new password.

2. Candidate Management Dashboard

Features:

Add Candidate:

Form to add a candidate with fields such as name, job title, email, phone number, and resume (PDF).

Validates uploaded resume files (must be PDF and less than 2 MB).

View Candidates:

List of all candidates with details like name, job title, email, phone, state, and resume link.

Displays resume URLs for preview.

Edit Candidate:

Edit candidate details, including job title and status.

Update the resume file if needed.

Delete Candidate:

Remove a candidate from the database.

Filters and Sorting:

Filter candidates by job title or state.

Sort candidates by name in ascending or descending order.

Search:

Search candidates by name.

3. Backend Services

Email Service:

Implemented using Nodemailer to send emails for password reset and other notifications.

Middleware for Authentication:

Custom middleware to validate JWT tokens and authorize access to protected routes.

Logging:

Integrated logging with a custom logger for error and activity tracking.

S3 File Uploads:

Resumes are uploaded to Amazon S3 using the AWS SDK.

Ensures secure and scalable storage for candidate files.

JWT Token Management:

Secure generation of JWT tokens for user authentication.

Token expiration and validation handled.

Input Validation:

Used Joi for robust input validation on all backend APIs.

Error Handling:

Centralized error handling middleware with detailed logs for better debugging and monitoring.

4. Token Expiry Handling

Intercepts API responses to handle 401 Unauthorized errors due to token expiration.

Automatically clears cookies and local storage, then redirects users to the login page.

5. Notifications

Toast notifications for success and error messages:

Successful login, candidate creation, update, and deletion.

Token expiration or API errors are displayed as error notifications.

6. State Management with Redux and Redux Toolkit

Centralized State Management:

All application states, including authentication, candidates, and notifications, are managed using Redux Toolkit.

Async Thunks:

Asynchronous operations like fetching, creating, updating, and deleting candidates are handled using Redux Toolkit's createAsyncThunk.

Error Handling:

Built-in error handling with state updates and toast notifications.

Performance Optimizations:

Efficient state updates with immutability ensured by Redux Toolkit.

7. Input Validations

Backend Validations:

All inputs are validated server-side using Joi, ensuring data integrity.

Frontend Validations:

Validations for forms include required fields, email format checks, file size and type checks for resumes, and more.

