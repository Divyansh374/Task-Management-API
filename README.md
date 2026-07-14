# Task Management API

Node.js | Express.js | MongoDB | JWT | REST API | MIT License

This project was built to learn scalable backend architecture using Node.js, Express and MongoDB. It demonstrates authentication, authorization, CRUD operations, middleware architecture, error handling, aggregation pipelines and secure REST API design.

This project served as my backend foundation before building more production-oriented systems like the Expense Tracker API.

## 📋 Features

- **User Authentication** - Secure signup and login with JWT tokens
- **CRUD Operations** - Create, read, update, and delete tasks
- **Task Completion** - Mark tasks as complete with a dedicated endpoint
- **Role-Based Authorization** - Admin-specific routes for managing users
- **Protected Routes** - Middleware-based protection for sensitive endpoints
- **Password Management** - Update password functionality for authenticated users

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JWT (JSON Web Tokens)

## 📦 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Task-Management
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with your MongoDB URI and JWT secret:

   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   ```

4. **Start the server**

   - With Nodemon (for development):
     ```bash
     npm run start
     ```
   - Without Nodemon:
     ```bash
     node server.js
     ```

## 📚 API Endpoints

### Authentication

- `POST /api/users/signup` - Register a new user
- `POST /api/users/login` - Login user
- `PATCH /api/users/update-password` - Update password (protected)

### Tasks

- `GET /api/tasks` - Get all tasks (protected)
- `POST /api/tasks` - Create a new task (protected)
- `PATCH /api/tasks/:id` - Update a task (protected)
- `DELETE /api/tasks/:id` - Delete a task (protected)
- `PATCH /api/tasks/:id/complete` - Mark task as complete (protected)

### Admin Routes

- `GET /api/users` - Get all users (admin only)

## 🔐 Authentication

The API uses JWT for authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

## 📁 Project Structure

```
Task-Management/
├── routes/          # Route handlers
├── controllers/     # Business logic
├── models/          # MongoDB schemas
├── middleware/      # Custom middleware
├── server.js        # Entry point
└── .env            # Environment variables
```

## 📝 License

This project is open source and available under the MIT License.
