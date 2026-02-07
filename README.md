# Task Management Platform

A full-stack web application for managing tasks with features like authentication, task CRUD operations, comments, file attachments, and analytics.

## 🚀 Tech Stack

### Backend
- **Node.js** with **Express.js** - RESTful API server
- **MongoDB** with **Mongoose** - Database and ODM
- **JWT** (jsonwebtoken) - Authentication & authorization
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Chart.js** with react-chartjs-2 - Data visualization
- **React Icons** - Icon library
- **date-fns** - Date formatting utilities

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** account (MongoDB Atlas recommended) - [Sign up here](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download here](https://git-scm.com/)

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Task Management Platform"
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (see Environment Variables section below)
# Add your environment variables to .env

# Start the backend server
npm run dev
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173` (default Vite port)

---

## 🔐 Environment Variables

### Backend (.env)

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5000

# Database Configuration
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database-name>

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
```

#### Variable Descriptions:

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Port number for the backend server | `5000` |
| `MONGO_URI` | MongoDB connection string (Atlas or local) | `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/taskManager` |
| `JWT_SECRET` | Secret key for JWT token signing (use a strong, random string) | `MySecureRandomString123!@#` |

> **⚠️ Security Note**: Never commit your `.env` file to version control. The `.gitignore` should already exclude it.

### Frontend Configuration

The frontend API URL is configured in `frontend/src/config.js`:

```javascript
export const API_URL = 'http://localhost:5000/api';
```

Update this URL if your backend is hosted on a different address.

---

## 🏃‍♂️ How to Run the Application

### Development Mode

1. **Start Backend** (Terminal 1):
```bash
cd backend
npm run dev
```
This starts the backend with **nodemon** (auto-restart on file changes)

2. **Start Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
```
This starts the Vite dev server with hot module replacement

3. **Access the Application**:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000/api`

### Production Mode

#### Backend
```bash
cd backend
npm start
```

#### Frontend
```bash
cd frontend
npm run build
npm run preview
```

Or serve the `dist` folder using a static server like `serve`:
```bash
npx serve -s dist
```

---

## 🏗️ Architecture Decisions

### 1. **Monorepo Structure**
- **Decision**: Separate `backend` and `frontend` directories in a single repository
- **Rationale**: Simplifies version control, easier to maintain related changes, single source of truth
- **Trade-off**: Could be split into microservices for larger scale, but current structure is ideal for a medium-sized application

### 2. **MongoDB as Database**
- **Decision**: NoSQL database (MongoDB) instead of SQL
- **Rationale**: 
  - Flexible schema for evolving requirements
  - Easy to handle nested data (comments, attachments)
  - Excellent Node.js integration with Mongoose
  - Cloud-hosted MongoDB Atlas simplifies deployment
- **Trade-off**: Less strict data consistency guarantees compared to SQL, but acceptable for this use case

### 3. **JWT Authentication**
- **Decision**: Token-based authentication using JWT
- **Rationale**:
  - Stateless authentication (no server-side session storage)
  - Scalable across multiple servers
  - Works well with RESTful APIs
  - Easy to implement with frontend SPA
- **Trade-off**: Tokens cannot be invalidated before expiry (solved with short expiry times and refresh tokens if needed)

### 4. **React with Vite**
- **Decision**: Vite as build tool instead of Create React App
- **Rationale**:
  - Significantly faster development server (ESbuild)
  - Optimized production builds
  - Modern tooling with better DX
  - Lighter and more maintainable
- **Trade-off**: None significant for this project

### 5. **Context API for State Management**
- **Decision**: React Context API (`AuthContext`) instead of Redux/Zustand
- **Rationale**:
  - Simpler for small to medium-scale state
  - No external dependencies
  - Sufficient for authentication state
- **Trade-off**: For very complex state, Redux might be better, but current approach is appropriate

### 6. **RESTful API Design**
- **Decision**: REST instead of GraphQL
- **Rationale**:
  - Simpler to implement and maintain
  - Well-understood by most developers
  - Adequate for the current data requirements
  - Better caching support
- **Trade-off**: Less flexible than GraphQL for complex queries, but not needed here

### 7. **File Upload Strategy**
- **Decision**: Store files locally using Multer
- **Rationale**:
  - Simple implementation for MVP
  - No external storage costs
- **Trade-off**: Not scalable for production (should migrate to cloud storage like AWS S3 or Cloudinary)

### 8. **Component Structure**
- **Decision**: Functional components with hooks
- **Rationale**:
  - Modern React best practices
  - Cleaner and more readable code
  - Better performance
  - Easier to test

---

## 📝 Assumptions Made

### General Assumptions
1. **Single User Workspace**: Tasks are user-specific; users only see their own tasks
2. **Internet Connectivity**: Application requires internet connection (for MongoDB Atlas)
3. **Modern Browsers**: Targets modern browsers with ES6+ support
4. **Development Environment**: Assumes developers have basic knowledge of Node.js and React

### Data Model Assumptions
1. **User Management**:
   - One user creates and manages their own tasks
   - `assigned_to` field in tasks is an array of strings (usernames), not user references
   - Email and username are unique identifiers

2. **Task Management**:
   - Tasks have three statuses: `todo`, `in-progress`, `completed`
   - Tasks have three priority levels: `low`, `medium`, `high`
   - Tags are simple strings, not a separate entity
   - Due dates are optional

3. **Comments**:
   - Comments belong to a single task
   - Comments are created by authenticated users
   - No nested comments (replies to comments)

4. **File Attachments**:
   - Files are stored in the `uploads` directory
   - File size limits are handled by Multer (default 10MB or configured limit)
   - Supported file types are managed at the route level

### Security Assumptions
1. **Password Security**: Bcrypt with salt rounds of 10 is sufficient
2. **JWT Expiry**: Default JWT expiry is acceptable (should be configured based on security requirements)
3. **CORS**: All origins are allowed in development; should be restricted in production
4. **Input Validation**: Basic validation is in place; comprehensive validation should be added for production

### Deployment Assumptions
1. **Development First**: Current setup is optimized for development
2. **Environment Variables**: Developers will configure their own MongoDB and JWT secrets
3. **Port Availability**: Ports 5000 (backend) and 5173 (frontend) are available
4. **No HTTPS**: Development uses HTTP; HTTPS should be configured for production

### Scalability Assumptions
1. **User Base**: Designed for small to medium user base (< 10,000 users)
2. **File Storage**: Local file storage is temporary; migration to cloud storage planned for scale
3. **Database**: Single MongoDB instance is sufficient; sharding/replication not needed yet

---

## 📂 Project Structure

```
Task Management Platform/
├── backend/
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Task.js            # Task schema
│   │   ├── Comment.js         # Comment schema
│   │   └── Attachment.js      # Attachment schema
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── tasks.js           # Task CRUD routes
│   │   ├── comments.js        # Comment routes
│   │   ├── files.js           # File upload routes
│   │   └── analytics.js       # Analytics routes
│   ├── uploads/               # File upload directory
│   ├── .env                   # Environment variables
│   ├── server.js              # Express server entry point
│   └── package.json           # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── TaskList.jsx
│   │   │   ├── TaskItem.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   ├── CommentSection.jsx
│   │   │   ├── FileSection.jsx
│   │   │   ├── Stats.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Authentication context
│   │   ├── pages/             # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── TaskDetail.jsx
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # React entry point
│   │   └── config.js          # API configuration
│   ├── public/                # Static assets
│   ├── index.html             # HTML template
│   ├── vite.config.js         # Vite configuration
│   └── package.json           # Frontend dependencies
│
└── README.md                  # This file
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `GET /api/auth/users` - Get all users (protected)

### Tasks
- `GET /api/tasks` - Get all tasks for logged-in user
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Comments
- `GET /api/comments/:taskId` - Get comments for a task
- `POST /api/comments` - Add comment to task
- `DELETE /api/comments/:id` - Delete comment

### Files
- `POST /api/files/upload` - Upload file attachment
- `GET /api/files/:taskId` - Get files for a task
- `DELETE /api/files/:id` - Delete file

### Analytics
- `GET /api/analytics` - Get task statistics (status, priority breakdown)

---

## 🧪 Testing

Currently, no automated tests are implemented. Recommended additions:

### Backend
- Unit tests with **Jest** and **Supertest**
- Integration tests for API endpoints
- Database mocking with **mongodb-memory-server**

### Frontend
- Component tests with **React Testing Library**
- End-to-end tests with **Playwright** or **Cypress**

---

## 🚀 Future Enhancements

1. **Cloud File Storage**: Migrate from local storage to AWS S3/Cloudinary
2. **Real-time Updates**: Implement WebSocket for live task updates
3. **Email Notifications**: Task reminders and due date alerts
4. **Team Collaboration**: Multi-user workspaces and task assignment
5. **Advanced Filtering**: Search and filter by multiple criteria
6. **Dark Mode**: Theme toggle for user preference
7. **Mobile App**: React Native mobile application
8. **CI/CD Pipeline**: Automated testing and deployment
9. **Rate Limiting**: API rate limiting for security
10. **Caching**: Redis for session and data caching

---

## 📄 License

This project is for educational/portfolio purposes.

---

## 👤 Author

Built as a full-stack development project demonstrating modern web technologies.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

For questions or support, please create an issue in the repository.
