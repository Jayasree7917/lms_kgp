# 🎓 KGP Learning Management System (LMS)

KGP LMS is a full-stack Learning Management System built to simplify online learning and course management. The platform provides separate experiences for students and instructors, making it easy to create, manage, enroll in, and complete courses through a modern and responsive interface.

The project focuses on delivering a smooth learning experience while maintaining security, scalability, and performance.

---

## 🚀 Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Authentication & Security

* JWT Authentication
* bcryptjs Password Hashing
* Helmet
* Express Rate Limiter
* Express Validator

### Media Management

* Cloudinary
* Multer

---

## ✨ Key Features

### User Authentication & Authorization

* Secure user registration and login using JWT authentication.
* Role-based access for Students and Instructors.
* Protected routes to ensure users can only access authorized resources.

### Student Features

* Browse and search available courses.
* Enroll in courses and access learning content.
* Watch video lectures through an interactive course player.
* Track learning progress and course completion.
* Rate and review completed courses.
* Personalized dashboard showing enrolled and completed courses.

### Instructor Features

* Dedicated instructor dashboard.
* Create, update, publish, and manage courses.
* Upload course thumbnails and video lectures.
* Organize content into sections and lectures.
* Manage course details such as category, duration, difficulty level, and pricing.

### Security & Performance

* Secure API endpoints with authentication middleware.
* Request validation to maintain data integrity.
* Rate limiting to prevent abuse and brute-force attacks.
* Security headers implemented using Helmet.

---

## 📂 Project Structure

LMS/

├── backend/

│ ├── config/

│ ├── controllers/

│ ├── middleware/

│ ├── models/

│ ├── routes/

│ ├── utils/

│ ├── server.js

│ └── package.json

│

├── frontend/

│ ├── src/

│ │ ├── api/

│ │ ├── assets/

│ │ ├── components/

│ │ ├── App.jsx

│ │ ├── main.jsx

│ │ └── index.css

│ ├── index.html

│ └── package.json

│

└── README.md

---

## ⚙️ Setup Instructions

### Prerequisites

Before running the project, make sure you have:

* Node.js (v18 or above)
* npm
* MongoDB Atlas account or local MongoDB setup
* Cloudinary account

---

### Backend Setup

1. Move to the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file and add:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://localhost:5173
```

4. Start the backend server:

```bash
npm run dev
```

---

### Frontend Setup

1. Move to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

4. Run the frontend:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## 🎯 Project Highlights

* Built a complete Learning Management System using the MERN Stack.
* Implemented secure JWT-based authentication and role-based authorization.
* Integrated Cloudinary for efficient storage and delivery of course media.
* Developed separate dashboards for students and instructors.
* Enabled course enrollment, progress tracking, reviews, and course management.
* Designed a responsive and user-friendly interface for a seamless learning experience.

---

## 📈 Future Enhancements

* Online assessments and quizzes.
* Certificate generation upon course completion.
* Live classes and video conferencing integration.
* Payment gateway integration for premium courses.
* Admin panel for platform-wide management.

This project demonstrates the development of a scalable and secure e-learning platform capable of supporting both learners and instructors in an online education environment.
