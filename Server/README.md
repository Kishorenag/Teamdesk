# SaaS Project Management API

Backend for the SaaS Project Management Dashboard using Node.js, Express, MongoDB, and TypeScript.

## Tech Stack

- **Runtime**: Node.js 22.x LTS
- **Framework**: Express 4.19.2
- **Language**: TypeScript 5.2.2
- **Database**: MongoDB 6.x/7.x with Mongoose 7.6.10
- **Authentication**: JWT 9.1.2 + bcryptjs 2.4.3
- **Module System**: CommonJS

## Project Structure

```
Backend/
├── src/
│   ├── app.ts                 # Express app setup
│   ├── server.ts              # Server entry point
│   ├── config/
│   │   ├── environment.ts      # Environment configuration
│   │   └── database.ts         # MongoDB connection
│   ├── models/
│   │   ├── User.ts            # User schema
│   │   ├── Project.ts          # Project schema
│   │   ├── Column.ts           # Kanban column schema
│   │   ├── Task.ts             # Task schema
│   │   └── index.ts            # Model exports
│   ├── controllers/
│   │   ├── auth.controller.ts  # Auth HTTP handlers
│   │   ├── project.controller.ts # Project handlers
│   │   ├── task.controller.ts   # Task handlers
│   │   └── index.ts             # Controller exports
│   ├── services/
│   │   ├── auth.service.ts     # Auth business logic
│   │   ├── project.service.ts  # Project logic
│   │   ├── task.service.ts     # Task logic
│   │   └── index.ts             # Service exports
│   ├── routes/
│   │   ├── auth.routes.ts      # Auth endpoints
│   │   ├── project.routes.ts   # Project endpoints
│   │   ├── task.routes.ts      # Task endpoints
│   │   └── index.ts            # Route aggregation
│   ├── middleware/
│   │   ├── auth.middleware.ts  # JWT verification
│   │   └── errorHandler.ts     # Error handling
│   ├── utils/
│   │   ├── jwt.ts              # JWT utilities
│   │   └── password.ts         # Password hashing
│   └── types/
│       └── index.ts            # TypeScript interfaces
├── .env.example                # Environment template
├── tsconfig.json               # TypeScript config
├── package.json                # Dependencies
└── README.md                   # This file
```

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/project-management
   JWT_SECRET=your-secret-key-here
   JWT_EXPIRY=7d
   FRONTEND_URL=http://localhost:5173
   LOG_LEVEL=debug
   ```

3. **Start MongoDB**:
   Make sure MongoDB is running on your machine or update `MONGODB_URI` to point to your MongoDB instance.

## Development

Start the development server with hot reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Build & Production

Build TypeScript to JavaScript:

```bash
npm run build
```

Start production server:

```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Projects
- `GET /api/projects` - Get all projects (requires auth)
- `POST /api/projects` - Create project (requires auth)
- `GET /api/projects/:id` - Get project (requires auth)
- `PUT /api/projects/:id` - Update project (requires auth, owner only)
- `DELETE /api/projects/:id` - Delete project (requires auth, owner only)

### Tasks
- `GET /api/projects/:projectId/tasks` - Get project tasks (requires auth)
- `POST /api/projects/:projectId/tasks` - Create task (requires auth)
- `GET /api/projects/:projectId/tasks/:taskId` - Get task (requires auth)
- `PUT /api/projects/:projectId/tasks/:taskId` - Update task (requires auth)
- `DELETE /api/projects/:projectId/tasks/:taskId` - Delete task (requires auth)
- `PATCH /api/projects/:projectId/tasks/:taskId/move` - Move task (requires auth)
- `GET /api/projects/:projectId/analytics` - Get project analytics (requires auth)

### Health
- `GET /health` - Health check
- `GET /` - API info

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

The API uses centralized error handling with consistent error responses:

```json
{
  "error": {
    "message": "Error description",
    "stack": "..."  // Only in development
  }
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Database Models

### User
- `email` (String, unique)
- `password` (String, hashed)
- `name` (String)
- `avatar` (String, optional)
- `role` (String, enum: admin|user)
- `createdAt`, `updatedAt`

### Project
- `name` (String)
- `description` (String)
- `owner` (ObjectId, ref: User)
- `members` (Array of ObjectId, ref: User)
- `columns` (Array of ObjectId, ref: Column)
- `status` (String, enum: active|archived)
- `createdAt`, `updatedAt`

### Column
- `name` (String)
- `position` (Number)
- `projectId` (ObjectId, ref: Project)
- `tasks` (Array of ObjectId, ref: Task)
- `createdAt`, `updatedAt`

### Task
- `title` (String)
- `description` (String)
- `status` (String, enum: todo|in-progress|review|done)
- `priority` (String, enum: low|medium|high|urgent)
- `columnId` (ObjectId, ref: Column)
- `projectId` (ObjectId, ref: Project)
- `assignedTo` (ObjectId, ref: User)
- `dueDate` (Date, optional)
- `subtasks` (Array with title and completed fields)
- `attachments` (Array of strings)
- `createdAt`, `updatedAt`

## TypeScript

All code is written in TypeScript with strict mode enabled. Run type checking:

```bash
npm run type-check
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run type-check` - Run TypeScript type checking
- `npm test` - Run tests (configured in package.json)

## Integration with Frontend

The frontend communicates with this API at `http://localhost:3000`. Configure `FRONTEND_URL` in `.env` to match your frontend deployment.

### CORS

CORS is enabled for the frontend URL specified in environment variables.

### Authentication Flow

1. User registers/logs in at `/api/auth/register` or `/api/auth/login`
2. Server returns JWT token
3. Frontend stores token in localStorage
4. Frontend includes token in all subsequent API requests
5. AuthMiddleware verifies token before processing requests

## Development Notes

- All errors are caught by the `express-async-errors` middleware
- Middleware is applied in order: helmet → cors → compression → morgan → body parsing
- Routes are organized by feature: auth, projects, tasks
- Services contain business logic, controllers handle HTTP layer
- Database connection is established on server startup
- Graceful shutdown handlers clean up database connections

## Support

For issues or questions, refer to the frontend documentation or create an issue in the repository.
