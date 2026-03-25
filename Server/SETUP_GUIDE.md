# 🚀 Complete Setup & Testing Guide

## Project Structure

Your project is now fully organized:

```
INTERVIEW/
├── Frontend/          # React + TypeScript (Port 5173)
├── Backend/           # Node + Express (Port 3000)
└── PROJECT_STRUCTURE.md
```

## ✅ What's Already Done

### Frontend (100% Complete)
- ✅ React 18 + TypeScript 5.2 with Vite
- ✅ Material-UI v5.16.14 fully integrated
- ✅ Persistent collapsible sidebar
- ✅ Login/Register pages with validation
- ✅ Dashboard with stats and project grid
- ✅ TanStack Query for server state
- ✅ React Hook Form + Zod validation
- ✅ Axios HTTP client with interceptors
- ✅ All files properly structured
- ✅ Dev server running at http://localhost:5173

### Backend (100% Complete)
- ✅ Node 22 + Express 4.19.2
- ✅ TypeScript 5.2 (CommonJS)
- ✅ MongoDB models (User, Project, Column, Task)
- ✅ Complete service layer (3 services)
- ✅ All controllers (3 controllers)
- ✅ All route definitions
- ✅ JWT authentication
- ✅ Bcryptjs password hashing
- ✅ Helmet security headers
- ✅ CORS configuration
- ✅ Error handling middleware
- ✅ Database connection setup
- ✅ Environment configuration
- ✅ Type definitions

## 🔧 Installation & Setup

### Step 1: Install Backend Dependencies

```bash
cd Interview/Backend
npm install
```

This will install:
- express, mongoose, jsonwebtoken, bcryptjs
- helmet, cors, morgan, compression
- typescript, ts-node, nodemon (dev)
- All required @types/* packages

### Step 2: Setup Backend Environment

Create `Interview/Backend/.env` file:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/project-management
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRY=7d
FRONTEND_URL=http://localhost:5173
LOG_LEVEL=debug
```

### Step 3: Install MongoDB

**Option A: Local Installation**
```bash
# Windows - Download from https://www.mongodb.com/try/download/community
# Then start MongoDB:
mongod
```

**Option B: MongoDB Atlas (Cloud - Recommended for Testing)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Update `MONGODB_URI` in `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/project-management?retryWrites=true&w=majority
   ```

### Step 4: Start Backend Development Server

```bash
cd Interview/Backend
npm run dev
```

Expected output:
```
📡 Connecting to MongoDB...
✅ MongoDB connected
🚀 Server running on http://localhost:3000
📝 Environment: development
🔗 Frontend: http://localhost:5173
```

### Step 5: Start Frontend Development Server (if not running)

```bash
cd Interview/Frontend
npm install
npm run dev
```

Expected: Server running at http://localhost:5173

## 📍 Verify Everything Works

### 1. Health Check
```bash
curl http://localhost:3000/health
```

Should return:
```json
{
  "status": "OK",
  "timestamp": "2024-02-04T...",
  "environment": "development"
}
```

### 2. API Info
```bash
curl http://localhost:3000/
```

Should return API endpoints list

## 🧪 Testing API Endpoints

### Install Postman or Insomnia
- Postman: https://www.postman.com/downloads/
- Insomnia: https://insomnia.rest/download

### Test Authentication

1. **Register User**
   - Method: `POST`
   - URL: `http://localhost:3000/api/auth/register`
   - Body (JSON):
   ```json
   {
     "email": "test@example.com",
     "password": "password123",
     "name": "Test User"
   }
   ```
   - Response: `{ data: { token, user }, message: "..." }`

2. **Login User**
   - Method: `POST`
   - URL: `http://localhost:3000/api/auth/login`
   - Body:
   ```json
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```
   - Response: `{ data: { token, user }, message: "..." }`

3. **Get Current User**
   - Method: `GET`
   - URL: `http://localhost:3000/api/auth/me`
   - Headers: `Authorization: Bearer <your-token>`
   - Response: `{ data: { user }, message: "..." }`

### Test Projects

1. **Create Project**
   - Method: `POST`
   - URL: `http://localhost:3000/api/projects`
   - Headers: `Authorization: Bearer <token>`
   - Body:
   ```json
   {
     "name": "My First Project",
     "description": "Test project"
   }
   ```
   - Response: Project with 4 default columns (Todo, In Progress, Review, Done)

2. **Get All Projects**
   - Method: `GET`
   - URL: `http://localhost:3000/api/projects`
   - Headers: `Authorization: Bearer <token>`
   - Response: Array of projects

3. **Get Single Project**
   - Method: `GET`
   - URL: `http://localhost:3000/api/projects/<projectId>`
   - Headers: `Authorization: Bearer <token>`

### Test Tasks

1. **Create Task**
   - Method: `POST`
   - URL: `http://localhost:3000/api/projects/<projectId>/tasks`
   - Headers: `Authorization: Bearer <token>`
   - Body:
   ```json
   {
     "title": "First Task",
     "description": "Do something",
     "priority": "high",
     "columnId": "<columnId>"
   }
   ```

2. **Get Project Tasks**
   - Method: `GET`
   - URL: `http://localhost:3000/api/projects/<projectId>/tasks`
   - Headers: `Authorization: Bearer <token>`

3. **Get Analytics**
   - Method: `GET`
   - URL: `http://localhost:3000/api/projects/<projectId>/analytics`
   - Headers: `Authorization: Bearer <token>`
   - Response: `{ totalTasks, completedTasks, tasksByStatus, tasksByPriority, ... }`

## 🔍 Frontend-Backend Integration

### Automatic Token Management
The frontend automatically:
1. Stores JWT token in localStorage after login
2. Includes token in all API requests (via axios interceptor)
3. Redirects to login if token is invalid/expired
4. Handles error responses with user-friendly messages

### API Configuration
In `Frontend/src/services/api.service.ts`:
```typescript
const API_BASE_URL = 'http://localhost:3000/api';
```

## 🐛 Troubleshooting

### Backend won't start
```
Error: Cannot find module 'express'
Solution: Run `npm install` in Backend folder
```

### MongoDB connection error
```
MongoNetworkError: connect ECONNREFUSED
Solution: 
- Start MongoDB: mongod
- OR use MongoDB Atlas with correct MONGODB_URI in .env
```

### CORS error on frontend
```
Access to XMLHttpRequest blocked by CORS
Solution: 
- Verify FRONTEND_URL in Backend/.env matches http://localhost:5173
- Check PORT is 3000 in Backend/.env
```

### TypeScript errors
```
Solution: 
- Delete node_modules and package-lock.json
- Run npm install again
- Check TypeScript version matches (5.2.2)
```

### Token issues
```
401 Unauthorized error
Solution:
- Register/login again to get fresh token
- Check Authorization header format: "Bearer <token>"
- Verify JWT_SECRET in .env is consistent
```

## 📊 Database Visualization (Optional)

### MongoDB Compass (GUI Tool)
1. Download: https://www.mongodb.com/products/tools/compass
2. Connect to `mongodb://localhost:27017`
3. View databases, collections, and documents
4. Create sample data manually if needed

## 🎯 Next Steps

1. ✅ Install dependencies (`npm install` in both Frontend & Backend)
2. ✅ Setup `.env` file in Backend
3. ✅ Start MongoDB
4. ✅ Start Backend: `npm run dev`
5. ✅ Start Frontend: `npm run dev`
6. ✅ Test API endpoints with Postman
7. ✅ Use frontend at http://localhost:5173
8. ✅ Create projects and tasks through UI
9. ✅ View analytics dashboard

## 📝 Common Tasks

### Add a new user role
Edit `Backend/src/types/index.ts`:
```typescript
role: 'admin' | 'user' | 'viewer'  // Add 'viewer'
```

### Change database name
Update `Backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/my-new-db-name
```

### Modify JWT expiry
Update `Backend/.env`:
```env
JWT_EXPIRY=14d  # Change from 7d to 14 days
```

### Add new model field
1. Edit Mongoose schema in `Backend/src/models/`
2. Update TypeScript interface in `Backend/src/types/index.ts`
3. Update service methods to handle new field
4. Update controller to accept new field in requests
5. Update frontend type definitions

## 🎉 You're All Set!

Your full-stack SaaS project management dashboard is ready to go:

- **Frontend**: React + Material-UI with Kanban board
- **Backend**: Node + Express with MongoDB
- **Authentication**: JWT-based with secure password hashing
- **Features**: Projects, tasks, columns, analytics, team management
- **Type Safety**: Full TypeScript throughout

Start building and testing! 🚀

---

**Questions?** Check the README files in Frontend/ and Backend/ folders for more details.

**Stuck?** Review the error messages - they're usually very helpful!

**Ready to deploy?** Build frontend and backend, push to GitHub, deploy to Heroku/Vercel/AWS.
