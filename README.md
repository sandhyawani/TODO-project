# MERN To-Do List Application

## Overview

This is a full-stack To-Do List application developed using the MERN Stack (MongoDB, Express.js, React.js, and Node.js). The application allows users to create, manage, update, and delete tasks efficiently.

## Features

* User Registration and Login
* JWT Authentication
* Create Tasks
* View Tasks
* Update Tasks
* Delete Tasks
* Responsive User Interface
* MongoDB Database Integration

## Technologies Used

### Frontend

* React.js
* Bootstrap
* Axios
* React Router DOM

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt.js
* dotenv

## Project Structure

```text
project-root/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
└── README.md
```

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd project-folder
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Authentication

* POST /api/auth/register
* POST /api/auth/login

### Tasks

* GET /api/tasks
* POST /api/tasks
* PUT /api/tasks/:id
* DELETE /api/tasks/:id

## Screenshots

Add screenshots of:

* Login Page
* Registration Page
* Dashboard
* Task Management

## Future Enhancements

* Task Categories
* Due Dates and Reminders
* Dark Mode
* Task Search and Filtering

## Author

**Sandhya Wani**

MCA Student

Sinhgad Institute of Business Administration and Research

## Assignment Submission

This project was developed as part of the MERN Stack Internship Assignment.
