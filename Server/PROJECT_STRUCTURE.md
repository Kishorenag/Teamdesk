# Backend Project Structure - Node.js + Express + MongoDB

## 📁 Directory Organization

```
Server/
├── src/
│   ├── app.ts                      # Express app configuration
│   ├── server.ts                   # Server entry point
│   │
│   ├── config/
│   │   ├── database.ts             # MongoDB connection setup
│   │   └── environment.ts          # Environment variables
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts      # Authentication handlers
│   │   ├── project.controller.ts   # Project management handlers
│   │   ├── task.controller.ts      # Task management handlers
│   │   └── index.ts                # Export all controllers
│   │
│   ├── models/
│   │   ├── User.ts                 # User schema
│   │   ├── Project.ts              # Project schema
│   │   ├── Column.ts               # Column schema
│   │   ├── Task.ts                 # Task schema
│   │   └── index.ts                # Export all models
│   │
│   ├── services/
│   │   ├── auth.service.ts         # Authentication business logic
│   │   ├── project.service.ts      # Project business logic
│   │   ├── task.service.ts         # Task business logic
│   │   └── index.ts                # Export all services
│   │
│   ├── routes/
│   │   ├── auth.routes.ts          # Authentication routes
│   │   ├── project.routes.ts       # Project routes
│   │   ├── task.routes.ts          # Task routes
│   │   └── index.ts                # Export all routes
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts      # JWT authentication middleware
│   │   ├── errorHandler.ts         # Error handling middleware
│   │   └── index.ts                # Export all middleware
│   │
│   ├── utils/
│   │   ├── jwt.ts                  # JWT token generation/verification
│   │   └── password.ts             # Password hashing utilities
│   │
│   └── types/
│       └── index.ts                # TypeScript interfaces
│
├── dist/                           # Compiled JavaScript (generated)
│   ├── app.js
│   ├── server.js
│   └── ... (compiled structure mirrors src/)
│
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## 📋 Core Files Explanation

### Configuration Files

**`config/environment.ts`**
- Loads environment variables from `.env` file
- Exports configuration object with defaults
- Variables: `NODE_ENV`, `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRY`, `FRONTEND_URL`, `LOG_LEVEL`

**`config/database.ts`**
- Establishes MongoDB connection via Mongoose
- Handles connection retries and cleanup
- Connection options: `retryWrites: true`, write concern

### Models (MongoDB Schemas)

**`models/User.ts`**
```typescript
{
  _id: ObjectId,
  email: string (unique, lowercase, indexed),
  password: string (hashed, select: false),
  name: string,
  avatar: string (URL),
  role: 'user' | 'admin',
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**`models/Project.ts`**
```typescript
{
  _id: ObjectId,
  name: string (required),
  description: string,
  owner: ObjectId (ref: User, required),
  members: ObjectId[] (ref: User, default: []),
  columns: ObjectId[] (ref: Column, default: []),
  status: 'active' | 'archived' (default: 'active'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**`models/Column.ts`**
```typescript
{
  _id: ObjectId,
  name: string (required),
  position: number,
  project: ObjectId (ref: Project, required),
  tasks: ObjectId[] (ref: Task, default: []),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**`models/Task.ts`**
```typescript
{
  _id: ObjectId,
  title: string (required),
  description: string,
  status: 'todo' | 'in-progress' | 'review' | 'done' (default: 'todo'),
  priority: 'low' | 'medium' | 'high' | 'urgent' (default: 'medium'),
  column: ObjectId (ref: Column, required),
  project: ObjectId (ref: Project, required),
  assignedTo: ObjectId (ref: User, optional),
  dueDate: Date (optional),
  subtasks: [{ title: string, completed: boolean }],
  attachments: [{ url: string, name: string }],
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## 🔐 Services (Business Logic)

### AuthService (`services/auth.service.ts`)

**Methods:**
- `register(data: ICreateUserInput): Promise<IAuthResponse>`
  - Validates email uniqueness
  - Hashes password with bcryptjs (SALT_ROUNDS=10)
  - Creates user in MongoDB
  - Generates JWT token (7-day expiry)
  - Returns { token, user }

- `login(data: ILoginInput): Promise<IAuthResponse>`
  - Finds user by email
  - Verifies password (constant-time comparison)
  - Generates JWT token
  - Returns { token, user }

- `getCurrentUser(userId: string): Promise<User>`
  - Retrieves user by ID
  - Excludes password field
  - Returns user object

### ProjectService (`services/project.service.ts`)

**Methods:**
- `getProjects(userId: string): Promise<Project[]>` - List user's projects (owned or member)
- `getProjectById(projectId: string, userId: string): Promise<Project>` - Get single project
- `createProject(data: ICreateProjectInput, userId: string): Promise<Project>`
  - Creates project with current user as owner
  - Auto-creates 4 default columns: "Todo", "In Progress", "Review", "Done"
- `updateProject(projectId: string, data: Partial<Project>, userId: string): Promise<Project>`
  - Owner-only operation
- `deleteProject(projectId: string, userId: string): Promise<void>`
  - Owner-only operation
  - Cascades delete to all columns and tasks

### TaskService (`services/task.service.ts`)

**Methods:**
- `getProjectTasks(projectId: string): Promise<Task[]>` - List all project tasks
- `getTaskById(taskId: string): Promise<Task>` - Get single task details
- `createTask(data: ICreateTaskInput): Promise<Task>` - Create new task
- `updateTask(taskId: string, data: Partial<Task>): Promise<Task>` - Update task
- `deleteTask(taskId: string): Promise<void>` - Delete task
- `moveTask(taskId: string, targetColumnId: string): Promise<Task>`
  - Removes task from current column
  - Adds task to target column
  - Updates task status based on column
- `getProjectAnalytics(projectId: string): Promise<Analytics>`
  - Returns: { totalTasks, completedTasks, pendingTasks, tasksByStatus, tasksByPriority, teamMembers }

## 🎯 Controllers (HTTP Handlers)

### AuthController (`controllers/auth.controller.ts`)

**Endpoints:**
- `POST /api/auth/register`
  - Body: `{ email: string, password: string, name: string }`
  - Returns: `{ data: { token, user }, message }`
  - Status: 201

- `POST /api/auth/login`
  - Body: `{ email: string, password: string }`
  - Returns: `{ data: { token, user }, message }`
  - Status: 200

- `GET /api/auth/me` (Protected)
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ data: user, message }`
  - Status: 200

### ProjectController (`controllers/project.controller.ts`)

**Endpoints:**
- `GET /api/projects` (Protected) - List user's projects
- `POST /api/projects` (Protected) - Create new project
  - Body: `{ name: string, description?: string }`
- `GET /api/projects/:id` (Protected) - Get project details
- `PUT /api/projects/:id` (Protected, Owner only) - Update project
  - Body: `{ name?: string, description?: string }`
- `DELETE /api/projects/:id` (Protected, Owner only) - Delete project

### TaskController (`controllers/task.controller.ts`)

**Endpoints:**
- `GET /api/projects/:projectId/tasks` (Protected) - List project tasks
- `POST /api/projects/:projectId/tasks` (Protected) - Create task
  - Body: `{ title: string, description?: string, priority?: string, assignedTo?: string }`
- `GET /api/projects/:projectId/tasks/:taskId` (Protected) - Get task
- `PUT /api/projects/:projectId/tasks/:taskId` (Protected) - Update task
- `DELETE /api/projects/:projectId/tasks/:taskId` (Protected) - Delete task
- `PATCH /api/projects/:projectId/tasks/:taskId/move` (Protected) - Move task
  - Body: `{ targetColumnId: string }`
- `GET /api/projects/:projectId/analytics` (Protected) - Get project analytics

## 🔐 Middleware

**`middleware/auth.middleware.ts`**
- Verifies JWT token from `Authorization: Bearer <token>` header
- Decodes token and attaches user info to request
- Adds `req.user` with `userId` and `email` properties
- Returns 401 if token invalid/missing
- Used on all protected routes

**`middleware/errorHandler.ts`**
- Global error handling middleware
- Formats error responses consistently
- Shows stack traces in development only
- Returns appropriate HTTP status codes

## 🛠️ Utilities

**`utils/jwt.ts`**
```typescript
export function generateToken(userId: string, email: string): string
- Creates JWT with userId and email
- Expires in 7 days
- Uses HS256 algorithm

export function verifyToken(token: string): TokenPayload
- Validates and decodes JWT
- Throws error if invalid

export function decodeToken(token: string): TokenPayload
- Decodes JWT without validation
```

**`utils/password.ts`**
```typescript
export async function hashPassword(password: string): Promise<string>
- Uses bcryptjs with SALT_ROUNDS=10
- Returns hashed password string

export async function comparePassword(password: string, hash: string): Promise<boolean>
- Constant-time comparison
- Returns true if match
```

## 📊 API Response Format

### Success Response (201/200)
```json
{
  "data": { /* response data */ },
  "message": "Operation successful message"
}
```

### Error Response (400/401/500)
```json
{
  "error": {
    "message": "Error description",
    "stack": "..." // Only in development NODE_ENV
  }
}
```

## 🔄 Request/Response Flow Examples

### Registration Flow
```
POST /api/auth/register
│
└── authController.register()
    │
    └── authService.register()
        ├── Check if email already exists
        ├── Hash password with bcryptjs
        ├── Create user in MongoDB
        ├── Generate JWT token
        └── Return { token, user, message }
```

### Project Creation Flow
```
POST /api/projects
│
├── authMiddleware (verify JWT token)
│
└── projectController.createProject()
    │
    └── projectService.createProject()
        ├── Validate user is authenticated
        ├── Create project with user as owner
        ├── Auto-create 4 default columns
        └── Return created project
```

### Task Movement Flow
```
PATCH /api/projects/:projectId/tasks/:taskId/move
│
├── authMiddleware (verify JWT token)
│
└── taskController.moveTask()
    │
    └── taskService.moveTask()
        ├── Verify task exists
        ├── Remove task from old column
        ├── Add task to new column
        ├── Update task status based on new column
        └── Return updated task
```

### Analytics Retrieval Flow
```
GET /api/projects/:projectId/analytics
│
├── authMiddleware (verify JWT token)
│
└── taskController.getProjectAnalytics()
    │
    └── taskService.getProjectAnalytics()
        ├── Count total tasks
        ├── Count completed tasks
        ├── Group tasks by status
        ├── Group tasks by priority
        ├── Count unique team members
        └── Return analytics object
```

## 🚀 Environment Variables

Create `.env` file in Server directory:
```env
# Server
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/project-management

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRY=7d

# CORS
FRONTEND_URL=http://localhost:5174

# Logging
LOG_LEVEL=debug
```

## 📦 Dependencies

### Core Framework & Database
- **express**: 4.19.2 - REST API framework
- **mongoose**: 7.6.10 - MongoDB ODM with validation
- **typescript**: 5.2.2 - Type safety and development

### Security & Authentication
- **bcryptjs**: 2.4.3 - Password hashing (SALT_ROUNDS=10)
- **jsonwebtoken**: 9.1.2 - JWT token generation/verification
- **helmet**: 7.1.0 - Security headers
- **cors**: 2.8.5 - Cross-origin resource sharing

### Utilities
- **morgan**: 1.10.0 - HTTP request logging
- **compression**: 1.7.4 - Response compression
- **dotenv**: 16.3.1 - Environment variable loading

### Development Tools
- **ts-node**: 10.9.1 - TypeScript execution
- **nodemon**: 3.0.1 - Auto-restart on file changes
- **@types/express**: Latest - TypeScript types
- **@types/node**: Latest - Node.js types

## 🔨 Available Scripts

```bash
# Build TypeScript to JavaScript (creates /dist folder)
npm run build

# Start production server (runs compiled JavaScript)
npm start

# Start with development auto-reload (ts-node + nodemon)
npm run dev

# Check TypeScript for errors without building
npm run type-check
```

## ✅ Feature Checklist

### Authentication
- ✅ User registration with password hashing
- ✅ User login with JWT tokens
- ✅ Current user retrieval
- ✅ JWT token verification on protected routes
- ✅ Token expiry (7 days)

### Project Management
- ✅ Create projects with owner assignment
- ✅ Auto-create default columns on project creation
- ✅ List user's projects
- ✅ Get project details
- ✅ Update project (owner only)
- ✅ Delete project with cascade (owner only)

### Task Management
- ✅ Create tasks with priority and assignment
- ✅ List tasks by project
- ✅ Get task details
- ✅ Update task properties
- ✅ Delete task
- ✅ Move task between columns
- ✅ Update task status based on column
- ✅ Subtask support
- ✅ Attachment support

### Analytics
- ✅ Total tasks count
- ✅ Completed tasks count
- ✅ Tasks by status breakdown
- ✅ Tasks by priority breakdown
- ✅ Team members count
- ✅ Project-level analytics

### Security & Performance
- ✅ Password hashing with bcryptjs
- ✅ JWT-based authentication
- ✅ CORS configuration
- ✅ Security headers (Helmet)
- ✅ Response compression
- ✅ MongoDB indexing for email
- ✅ Environment-based configuration
- ✅ Error handling and logging
- ✅ Input validation
- ✅ TypeScript strict mode

## 🧪 Testing Endpoints with cURL

### Register New User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

### Login User
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
# Response includes: { token, user }
```

### Get Current User (Protected)
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Create Project (Protected)
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "name": "My Awesome Project",
    "description": "This is a project description"
  }'
```

### Create Task (Protected)
```bash
curl -X POST http://localhost:3000/api/projects/PROJECT_ID/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "title": "Implement login page",
    "description": "Create login page component",
    "priority": "high"
  }'
```

### Get Project Analytics (Protected)
```bash
curl -X GET http://localhost:3000/api/projects/PROJECT_ID/analytics \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 📖 Related Documentation

- [Frontend Project Structure](../Frontend/PROJECT_STRUCTURE.md)
- [API Endpoints Overview](../Frontend/API.md)
- [Database Security Practices](./docs/SECURITY.md)

## 🚀 Deployment Ready

The backend is production-ready with:
- ✅ Environment-based configuration
- ✅ Error handling with proper HTTP status codes
- ✅ Security headers with Helmet
- ✅ Response compression
- ✅ CORS properly configured
- ✅ Password hashing and JWT authentication
- ✅ Input validation via TypeScript and Mongoose
- ✅ Request logging with Morgan
- ✅ Graceful error messages
- ✅ TypeScript strict mode
- ✅ No hardcoded secrets
- ✅ Database connection pooling

---

**Last Updated**: March 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
