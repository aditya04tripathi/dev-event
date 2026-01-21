# MongoDb and Nestjs Backend API

A powerful, robust, and secure backend API built with **NestJS** and **MongoDB**.  
This project is designed to be a solid foundation for your web applications, providing out-of-the-box support for authentication, user management, and role-based access control.

---

## 🚀 Key Features

- **Authentication**: Secure User Sign-up and Sign-in using Argon2 for password hashing.
- **Authorization**: Role-Based Access Control (RBAC) to protect endpoints (User vs Admin).
- **JWT Security**: Stateless authentication using JSON Web Tokens.
- **Docs**: Auto-generated API documentation with Swagger.
- **Database**: MongoDB integration via Mongoose.
- **Clean Architecture**: Modular structure with Services, Controllers, and Guards.

---

## 🛠️ Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **Database**: MongoDB (with Mongoose ODM)
- **Language**: TypeScript
- **Auth**: Passport-JWT
- **Docs**: Swagger (OpenAPI)

---

## 🚦 Prerequisites

Before you start, make sure you have these installed on your computer:

1.  **Node.js**: The runtime environment. [Download here](https://nodejs.org/).
2.  **pnpm**: A fast, disk space-efficient package manager.
    ```bash
    npm install -g pnpm
    ```
3.  **MongoDB**: You need a running MongoDB instance.
    - _Option A_: Install locally ([Community Edition](https://www.mongodb.com/try/download/community)).
    - _Option B_: Use a free cloud database like [MongoDB Atlas](https://www.mongodb.com/atlas).

---

## 🏁 Setup Guide

Follow these steps to get the app running on your machine.

### 1. Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/aditya04tripathi/nestjs-starter-api-with-jwt-auth.git
cd nestjs-starter-api-with-jwt-auth
```

### 2. Install Dependencies

Install all the necessary libraries:

```bash
pnpm install
```

### 3. Configure Environment Variables

The app needs secret keys (like database URL) to work.
Create a `.env` file in the root folder and add the following:

```env
# Database Connection String
DATABASE_URL="mongodb://localhost:27017/nestjs-starter-api-with-jwt-auth"

# Secret Key for signing JWT Tokens (Make this long and random!)
JWT_SECRET="super-secret-key-change-me"
```

### 4. Run the Server

Start the application in development mode:

```bash
pnpm run start:dev
```

You should see logs indicating the server has started successfully, usually on `http://localhost:3000`.

---

## 📖 How to Use the API

Once the server is running, you can interact with it using an API Client (like Postman) or the built-in Swagger docs.

### Interactive Documentation (Swagger)

Open your browser and go to:  
👉 **[http://localhost:3000/api](http://localhost:3000/api)**

Here you can see all available endpoints and test them directly from the browser!

### 🔑 Authentication

#### 1. Sign Up (Register)

Create a new user account.

- **Endpoint**: `POST /auth/sign-up`
- **Body** (JSON):
  ```json
  {
  	"username": "johndoe",
  	"email": "john@example.com",
  	"fullName": "John Doe",
  	"password": "securepassword123"
  }
  ```
- **Response**: You will receive your user details and a distinct `token`. **Save this token**, you need it to access other parts of the app!

#### 2. Sign In (Login)

Log in to an existing account.

- **Endpoint**: `POST /auth/sign-in`
- **Body** (JSON):
  ```json
  {
  	"usernameOrEmail": "johndoe",
  	"password": "securepassword123"
  }
  ```
- **Response**: Returns your `user` object and a `token`.

---

### 👤 User Management (Protected Routes)

**Note**: For these requests, you must include the **Token** you got from login in the `Authorization` header.

- **Header Format**: `Authorization: Bearer <YOUR_TOKEN_HERE>`

#### 1. Get My Profile

Retrieve your own user details.

- **Endpoint**: `GET /user/me`
- **Permission**: Any logged-in user.
- **Response**: Your user profile data.

#### 2. Get All Users (Admin Only)

Retrieve a list of all registered users. This is a restricted route.

- **Endpoint**: `GET /user/all`
- **Permission**: **Admin** only.
- **How to test**:
  1.  You need a user with the `admin` role.
  2.  (Manually update your user's role to 'admin' in your MongoDB database for testing).
  3.  Call this endpoint with the admin's token.
- **Response**: A list of all user objects.

---

### 🛡️ Understanding Roles (RBAC)

This system uses **Role-Based Access Control**.

- **User**: The default role. Can access basic features (like `GET /user/me`).
- **Admin**: Has elevated privileges. Can access special routes (like `GET /user/all`).

When you sign up, you are a **User** by default.

---

## 🤝 Contributing

We welcome contributions!

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

Copyright (c) 2025 Aditya Tripathi
