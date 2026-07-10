Follow this documentation strictly and prioritize security at all times.

1. Frontend Technologies:
- Framework: Next.js
- Language: TypeScript
- Styling: Tailwind CSS
- API Calls: Custom axios instance (src/lib/axios.ts)
- State Management: React Context + local state
- Authentication: JWT tokens (stored in localStorage)

2. Frontend Structure:
- src/app: Page routing (Next.js App Router)
- src/components: Reusable UI components (buttons, modals, forms, layouts, etc.)
- src/lib: Helper functions, API client, constants, validators
- src/services: Business logic and API services (authentication, users, etc.)
- src/types: TypeScript type definitions
- src/hooks: Custom React hooks
- public/: Static assets (images, icons, favicon)

3. Backend API endpoints:
- POST /api/auth/register - Create new user
- POST /api/auth/login - User login
- GET /api/users/me - Get current user profile
- PUT /api/users/me - Update current user
- GET /api/users - List all users (admin)
- POST /api/users - Create user (admin)
- GET /api/users/:id - Get user by ID (admin)
- PUT /api/users/:id - Update user by ID (admin)
- DELETE /api/users/:id - Delete user (admin)
- GET /api/notifications - List user notifications
- GET /api/notifications/unread-count - Get unread notifications count
- POST /api/notifications/:id/read - Mark notification as read
- POST /api/notifications/mark-all-read - Mark all notifications as read
- GET /api/attendance - List attendance records
- POST /api/attendance/check-in - Check-in attendance
- POST /api/attendance/check-out - Check-out attendance

4. Authentication:
- All protected endpoints require valid JWT token in Authorization header: Bearer <token>
- Token stored in localStorage as 'token'
- Token expires in 1 day (as per backend configuration)
- Implement proper error handling for expired tokens (redirect to login)

5. Security Requirements:
- Always sanitize user inputs to prevent XSS attacks
- Validate form data using Zod (src/lib/validators.ts)
- Use backend API for all data operations (no direct database access)
- Implement proper error handling and display user-friendly messages
- Ensure proper authentication and authorization checks
- Prevent exposing sensitive information in API responses

6. User Roles and Permissions:
- ADMIN: Full access to all features
- TEACHER: Access to teaching tools and student management
- STUDENT: Access to learning materials and attendance tracking
- PARENT: Access to student progress monitoring
- APPLICANT: Admission application features
- PUBLIC: Basic public access

7. Development Best Practices:
- Write clean, modular, and maintainable code
- Use TypeScript for type safety
- Follow Next.js App Router conventions
- Implement responsive design for all pages
- Add proper loading states and error handling
- Optimize performance for better user experience
- Use semantic HTML for better accessibility

8. Testing:
- Test all features thoroughly before deployment
- Verify authentication and authorization flows
- Ensure proper error handling in all scenarios
- Test on different screen sizes and devices
- Validate API integrations are working correctly

Follow these guidelines strictly to ensure a high-quality, secure, and maintainable frontend application.
