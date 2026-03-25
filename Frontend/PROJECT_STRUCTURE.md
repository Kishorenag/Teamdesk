# Frontend Project Structure - React + TypeScript + Vite

## 📁 Directory Organization

```
Frontend/
├── src/
│   ├── main.tsx                    # React entry point
│   ├── App.tsx                     # Root component
│   │
│   ├── routes/
│   │   └── AppRoutes.tsx           # Route configuration
│   │
│   ├── pages/
│   │   ├── LoginPage.tsx           # Login page with form
│   │   ├── RegisterPage.tsx        # Registration page with form
│   │   ├── DashboardPage.tsx       # Main dashboard with overview
│   │   ├── ProjectsPage.tsx        # Projects management page
│   │   ├── ProjectDetailsPage.tsx  # Individual project Kanban view
│   │   ├── TasksPage.tsx           # Tasks management page
│   │   ├── AnalyticsPage.tsx       # Analytics and insights page
│   │   ├── TeamPage.tsx            # Team members page
│   │   └── index.ts                # Export all pages
│   │
│   ├── layouts/
│   │   ├── AuthLayout.tsx          # Layout for auth pages (login/register)
│   │   ├── DashboardLayout.tsx     # Layout for dashboard pages (with sidebar)
│   │   └── index.ts                # Export all layouts
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx          # Top navigation bar
│   │   │   ├── Sidebar.tsx         # Left navigation sidebar
│   │   │   └── index.ts
│   │   ├── ProjectCard.tsx         # Reusable project card component
│   │   ├── TaskCard.tsx            # Reusable task card component
│   │   └── index.ts                # Export all components
│   │
│   ├── hooks/
│   │   ├── useApi.ts               # TanStack Query hooks for API calls
│   │   │   ├── useCurrentUser()
│   │   │   ├── useLogin()
│   │   │   ├── useRegister()
│   │   │   ├── useLogout()
│   │   │   ├── useProjects()
│   │   │   ├── useProject()
│   │   │   ├── useCreateProject()
│   │   │   ├── useUpdateProject()
│   │   │   ├── useDeleteProject()
│   │   │   ├── useCreateTask()
│   │   │   ├── useUpdateTask()
│   │   │   ├── useDeleteTask()
│   │   │   └── ... (other hooks)
│   │   ├── useUI.ts                # UI-related hooks
│   │   └── index.ts                # Export all hooks
│   │
│   ├── services/
│   │   └── api.service.ts          # Centralized API client (Axios)
│   │       ├── login()
│   │       ├── register()
│   │       ├── logout()
│   │       ├── getCurrentUser()
│   │       ├── getProjects()
│   │       ├── getProject()
│   │       ├── createProject()
│   │       ├── updateProject()
│   │       ├── deleteProject()
│   │       ├── getProjectTasks()
│   │       ├── createTask()
│   │       ├── updateTask()
│   │       ├── deleteTask()
│   │       ├── moveTask()
│   │       └── ... (other methods)
│   │
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces
│   │       ├── User
│   │       ├── Project
│   │       ├── Task
│   │       ├── Column
│   │       ├── ApiResponse
│   │       └── ... (other types)
│   │
│   ├── styles/
│   │   ├── globals.css             # Global styles
│   │   ├── LoginPage.css           # Login form styling
│   │   ├── RegisterPage.css        # Registration form styling
│   │   ├── DashboardPage.css       # Dashboard page styling
│   │   ├── ProjectsPage.css        # Projects management styling
│   │   ├── ProjectDetailsPage.css  # Project Kanban view styling
│   │   ├── TasksPage.css           # Tasks table styling
│   │   ├── AnalyticsPage.css       # Analytics charts styling
│   │   └── TeamPage.css            # Team members page styling
│   │
│   └── vite-env.d.ts               # Vite environment types
│
├── public/
│   └── favicon.ico                 # App favicon
│
├── index.html                      # HTML entry point
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite configuration
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
└── README.md                       # Project documentation
```

## 📋 Core Files Explanation

### Entry Points

**`main.tsx`**
- React application entry point
- Initializes Vite React plugin
- Mounts App component to DOM

**`App.tsx`**
- Root component
- Renders route configuration
- Wraps with providers (QueryClientProvider, etc.)

**`routes/AppRoutes.tsx`**
- Defines all application routes
- Configures layouts for route groups
- Route structure:
  ```
  /login           → AuthLayout → LoginPage
  /register        → AuthLayout → RegisterPage
  /dashboard       → DashboardLayout → DashboardPage
  /projects        → DashboardLayout → ProjectsPage
  /projects/:id    → DashboardLayout → ProjectDetailsPage
  /tasks           → DashboardLayout → TasksPage
  /analytics       → DashboardLayout → AnalyticsPage
  /team            → DashboardLayout → TeamPage
  /                → Redirects to /login
  ```

### Pages (Features)

**`pages/LoginPage.tsx`**
- Email and password form with validation (Zod schema)
- useLogin hook for API call
- Error display and loading states
- Link to register page
- Redirects to /dashboard on success

**`pages/RegisterPage.tsx`**
- Name, email, password, confirm password form
- Password confirmation validation
- useRegister hook for API call
- Error display and loading states
- Link to login page
- Redirects to /dashboard on success

**`pages/DashboardPage.tsx`**
- Overview dashboard with statistics
- 4 stat cards: Total Projects, Active Tasks, Completed Tasks, Team Members
- Recent projects grid
- Empty state for new users
- Modern gradient header with icons
- Responsive layout

**`pages/ProjectsPage.tsx`**
- List all user projects with modern cards
- 6 rotating gradient color schemes
- Create new project dialog
- Edit (disabled) and delete functionality
- Task/column count display
- Empty state for no projects
- Modern card-based layout with hover effects
- Navigation to project details on "View Details" click

**`pages/ProjectDetailsPage.tsx`**
- Individual project view with Kanban-style columns
- Back navigation button to return to projects list
- Project info cards displaying:
  - Project owner with avatar
  - Team members with avatar group
  - Total task count
  - Project status indicator
- Column-based task layout (todo, in-progress, review, done)
- Individual task cards showing:
  - Task title and description
  - Priority indicator with color coding (low, medium, high, urgent)
  - Assigned team member with avatar
  - Drag indicator visual
- Create task dialog with form:
  - Task title (required)
  - Task description (optional)
  - Priority dropdown (low, medium, high, urgent)
  - Column selection dropdown
  - Form validation using Zod schema
- Task creation mutations integrated with TanStack Query
- Empty state for columns with no tasks
- Responsive grid layout
- Modern card styling with hover animations

**`pages/TasksPage.tsx`**
- List tasks with advanced filtering
- Project dropdown filter
- Modern table with status and priority indicators
- Color-coded status chips (todo, in-progress, review, done)
- Color-coded priority chips (low, medium, high, urgent)
- Responsive table layout
- Empty states for different scenarios

**`pages/AnalyticsPage.tsx`**
- Project selection dropdown
- 4 metric cards: Total Tasks, Completed, In Progress, Team Members
- Tasks by Status pie chart
- Tasks by Priority bar chart
- Status distribution grid with color indicators
- Custom tooltip styling on charts
- Empty state when no project selected

**`pages/TeamPage.tsx`**
- Current user card with gradient background
  - Large profile picture with border
  - User name with "You" badge
  - Email display
- Team members section
  - Table with member details
  - Role and status display
  - Remove member button (disabled for demo)
- Modern card-based design
- Add member dialog (disabled for demo)

### Layouts

**`layouts/AuthLayout.tsx`**
- Minimal layout for authentication pages
- Centered card design with gradients
- Displays app logo/title
- Responsive design
- No navigation sidebar

**`layouts/DashboardLayout.tsx`**
- Layout for authenticated pages
- Header with navigation and user menu
- Sidebar with navigation links
  - Dashboard
  - Projects
  - Tasks
  - Analytics
  - Team
- Main content area
- Responsive drawer for mobile

### Components

**`components/layout/Header.tsx`**
- Top navigation bar
- App title/logo
- User menu (profile, logout)
- Mobile menu button
- Search/filter inputs

**`components/layout/Sidebar.tsx`**
- Left navigation panel
- Navigation links with icons
- Active route highlighting
- User profile section
- Collapsible on mobile

**`components/ProjectCard.tsx`**
- Reusable project card component
- Display project name and description
- Show column and task counts
- Edit/delete action buttons
- Hover effects and animations

**`components/TaskCard.tsx`**
- Reusable task card component
- Task title and description
- Priority indicator
- Status badge
- Assigned user
- Due date display

### Hooks

**`hooks/useApi.ts`** - TanStack Query Hooks

User-related:
- `useCurrentUser()` - Fetch logged-in user details
- `useLogin()` - Authenticate user
- `useRegister()` - Register new user
- `useLogout()` - Sign out and clear auth

Project-related:
- `useProjects()` - Fetch user's projects
- `useProject(projectId)` - Fetch single project
- `useCreateProject()` - Create new project
- `useUpdateProject()` - Update project
- `useDeleteProject()` - Delete project

Task-related:
- `useProjectTasks(projectId)` - Fetch project tasks
- `useTask(taskId)` - Fetch single task
- `useCreateTask()` - Create new task
- `useUpdateTask()` - Update task
- `useDeleteTask()` - Delete task
- `useMoveTask()` - Move task between columns

Analytics:
- `useAnalytics(projectId)` - Fetch project analytics

All hooks handle:
- Loading states
- Error states
- Automatic refetching/caching
- Query invalidation on mutations

**`hooks/useUI.ts`**
- UI-related custom hooks (optional)
- Modal/dialog management
- Notification/toast management

### Services

**`services/api.service.ts`** - Axios API Client

Features:
- Centralized API configuration
- Automatic token injection from localStorage
- Request/response interceptors
- Error handling
- Typed responses

Methods:
```typescript
// Auth
async login(email, password): Promise<ApiResponse<{token, user}>>
async register(email, password, name): Promise<ApiResponse<{token, user}>>
async logout(): Promise<ApiResponse<null>>
async getCurrentUser(): Promise<ApiResponse<User>>

// Projects
async getProjects(): Promise<ApiResponse<Project[]>>
async getProject(id): Promise<ApiResponse<Project>>
async createProject(data): Promise<ApiResponse<Project>>
async updateProject(id, data): Promise<ApiResponse<Project>>
async deleteProject(id): Promise<ApiResponse<null>>

// Tasks
async getProjectTasks(projectId): Promise<ApiResponse<Task[]>>
async getTask(taskId): Promise<ApiResponse<Task>>
async createTask(projectId, data): Promise<ApiResponse<Task>>
async updateTask(taskId, data): Promise<ApiResponse<Task>>
async deleteTask(taskId): Promise<ApiResponse<null>>
async moveTask(taskId, targetColumnId): Promise<ApiResponse<Task>>
async getProjectAnalytics(projectId): Promise<ApiResponse<Analytics>>
```

### Types

**`types/index.ts`** - TypeScript Interfaces

```typescript
// User
interface User {
  _id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

// Project
interface Project {
  _id: string;
  name: string;
  description: string;
  owner: User;
  members: User[];
  columns: Column[];
  status: 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

// Task
interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  column: Column;
  project: Project;
  assignedTo?: User;
  dueDate?: Date;
  subtasks: Subtask[];
  attachments: Attachment[];
  createdAt: Date;
  updatedAt: Date;
}

// Column
interface Column {
  _id: string;
  name: string;
  position: number;
  project: Project;
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
}

// API Response wrapper
interface ApiResponse<T> {
  data: T;
  message: string;
}
```

## 🎨 CSS Organization & Styling

### File Structure
All CSS files are centralized in `/src/styles/` directory for easy maintenance:

```
styles/
├── globals.css              # Global styles and resets
├── LoginPage.css            # Login page specific styles
├── RegisterPage.css         # Register page specific styles
├── DashboardPage.css        # Dashboard page specific styles
├── ProjectsPage.css         # Projects management page styles
├── ProjectDetailsPage.css   # Project Kanban view styles
├── TasksPage.css            # Tasks table view styles
├── AnalyticsPage.css        # Analytics page styles
└── TeamPage.css             # Team members page styles
```

### Naming Convention - BEM (Block Element Modifier)
All CSS classes follow BEM pattern with kebab-case:

```css
/* Block */
.project-card { }

/* Element */
.project-card__header { }
.project-card__title { }
.project-card__footer { }

/* Modifier */
.project-card__title--active { }
.project-card__footer--error { }
```

### CSS Variables System
Each CSS file defines project-wide variables for consistency:

```css
:root {
  /* Gradients */
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  /* Colors */
  --primary-color: #667eea;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --text-tertiary: #9ca3af;
  
  /* Sizing */
  --border-radius-md: 12px;
  --border-radius-sm: 8px;
  --spacing-unit: 8px;
}
```

### Styling Best Practices
1. **No Inline CSS** - All styling must be in separate CSS files
2. **MUI + CSS Integration** - Use MUI components with className prop
3. **Component-Scoped Styles** - One CSS file per page component
4. **Variable Reuse** - Use CSS variables for colors, spacing, etc.
5. **Responsive Design** - Media queries for different screen sizes

### Example Component Integration
```tsx
// ProjectCard.tsx
import './ProjectCard.css';

export const ProjectCard = ({ project }) => {
  return (
    <Card className="project-card">
      <Box className="project-card__header">
        <Typography className="project-card__title">
          {project.name}
        </Typography>
      </Box>
      <Box className="project-card__footer">
        {/* content */}
      </Box>
    </Card>
  );
};
```

## 🎨 Design System

### Color Palette

**Gradients**
- Primary: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` (Purple-Blue)
- Secondary: `linear-gradient(135deg, #f093fb 0%, #4facfe 100%)` (Pink-Cyan)

**Semantic Colors**
- Success: `#10b981` (Green)
- Warning: `#f59e0b` (Orange)
- Error: `#ef4444` (Red)
- Info: `#3b82f6` (Blue)

**Neutral Colors**
- Dark: `#1f2937` (Text)
- Medium: `#6b7280` (Secondary text)
- Light: `#f3f4f6` (Borders)
- Lighter: `#f9fafb` (Backgrounds)

### Typography

- **Heading (h1-h3)**: FontWeight 800, Gradients
- **Heading (h4-h6)**: FontWeight 700, Solid colors
- **Body**: FontWeight 400/500, Readable sizes
- **Label**: FontWeight 600, Uppercase transforms

### Spacing

- Gap/Padding: 8px, 12px, 16px, 24px, 32px, 48px
- Border Radius: 6px (buttons), 8px (inputs), 12px (cards)
- Transitions: 0.3s ease for all interactive elements

### Shadows

- Light: `0 2px 12px rgba(0, 0, 0, 0.06)`
- Medium: `0 8px 24px rgba(0, 0, 0, 0.12)`
- Heavy: `0 12px 24px rgba(0, 0, 0, 0.12)`
- Gradient: Custom based on gradient color

## 📦 Dependencies

### Core Framework
- **react**: 18.2.0 - UI library
- **react-dom**: 18.2.0 - DOM rendering
- **react-router-dom**: 6.20.0 - Routing and navigation
- **typescript**: 5.2.2 - Static typing

### UI Framework & Icons
- **@mui/material**: 5.16.14 - Component library
- **@mui/icons-material**: Latest - Icon set
- **@emotion/react**: Latest - Styling library
- **@emotion/styled**: Latest - CSS-in-JS

### State Management & Data Fetching
- **@tanstack/react-query**: 5.25.0 - Server state management
  - Caching, synchronization, refetching
  - Query invalidation and mutation patterns
- **axios**: 1.6.2 - HTTP client
  - Interceptors for auth tokens
  - Request/response transformation

### Form Management & Validation
- **react-hook-form**: 7.51.0 - Lightweight form state
  - Zero dependencies, minimal re-renders
  - TypeScript support
- **@hookform/resolvers**: Latest - Form validation integration
- **zod**: 3.22.4 - Schema validation
  - Type-safe validation schemas
  - Runtime type checking

### Development Tools
- **vite**: 5.4.21 - Build tool and dev server
  - Lightning-fast HMR
  - Optimized production builds
- **@vitejs/plugin-react**: Latest - React integration
- **typescript**: Latest - TypeScript support

## 🚀 Environment Variables

Create `.env` file in Frontend directory:
```env
# Backend API
VITE_API_URL=http://localhost:3000/api

# App Configuration
VITE_APP_NAME=Project Manager
VITE_APP_VERSION=1.0.0
```

## 🔨 Available Scripts

```bash
# Start development server (with HMR)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Type check TypeScript
npm run type-check
```

## 🔐 Authentication Flow

### Login Flow
```
LoginPage
  ↓
(user enters email/password)
  ↓
useLogin() hook
  ↓
apiService.login()
  ↓
Backend checks credentials
  ↓
Backend returns { token, user }
  ↓
Hook stores token in localStorage
  ↓
Hook queries currentUser with token
  ↓
Redirect to /dashboard
```

### Register Flow
```
RegisterPage
  ↓
(user enters name/email/password)
  ↓
useRegister() hook
  ↓
apiService.register()
  ↓
Backend creates user
  ↓
Backend returns { token, user }
  ↓
Hook stores token in localStorage
  ↓
Hook queries currentUser with token
  ↓
Redirect to /dashboard
```

### Protected Routes
```
AppRoutes checks authentication
  ↓
Axios interceptor adds token to headers
  ↓
Backend authMiddleware verifies token
  ↓
Request proceeds if valid
```

## 📊 Data Flow

### Project List
```
ProjectsPage
  ↓
useProjects() hook
  ↓
TanStack Query caching layer
  ↓
apiService.getProjects()
  ↓
Axios GET /api/projects
  ↓
Backend returns Project[]
  ↓
Cache updated, component re-renders
```

### Task Creation
```
TaskForm
  ↓
useCreateTask() hook
  ↓
apiService.createTask()
  ↓
Axios POST /api/projects/:id/tasks
  ↓
Backend creates task
  ↓
Hook invalidates useProjectTasks query
  ↓
Tasks list automatically refetches
  ↓
UI updates with new task
```

## ✅ Features Checklist

### Authentication
- ✅ Login page with validation
- ✅ Register page with validation
- ✅ Password confirmation
- ✅ Token storage and management
- ✅ Automatic logout on token expiry
- ✅ Protected routes

### Project Management
- ✅ View all projects
- ✅ Create new project
- ✅ Delete project
- ✅ Project cards with statistics
- ✅ Empty states
- ✅ Error handling

### Task Management
- ✅ View all tasks
- ✅ Filter by project
- ✅ Create new task
- ✅ Update task
- ✅ Delete task
- ✅ Move task between columns
- ✅ Status display
- ✅ Priority display
- ✅ Assignment display

### Analytics
- ✅ Project analytics dashboard
- ✅ Task distribution charts
- ✅ Status breakdown
- ✅ Priority breakdown
- ✅ Team member count

### UI/UX
- ✅ Modern gradient design
- ✅ Responsive layouts
- ✅ Smooth transitions
- ✅ Loading states
- ✅ Error messages
- ✅ Success messages
- ✅ Accessible components
- ✅ Dark patterns avoided

## 📖 Related Documentation

- [Backend Project Structure](../Server/PROJECT_STRUCTURE.md)
- [Material-UI Documentation](https://mui.com/)
- [TanStack Query Documentation](https://tanstack.com/query)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🚀 Production Checklist

- ✅ TypeScript strict mode enabled
- ✅ Performance optimized (lazy loading ready)
- ✅ Error boundaries in place
- ✅ Loading states on all async operations
- ✅ Form validation with error messages
- ✅ Responsive design tested
- ✅ Accessible navigation
- ✅ Token refresh handling
- ✅ CORS properly configured
- ✅ API base URL configurable
- ✅ Build optimization
- ✅ Security: No hardcoded secrets

---

**Last Updated**: March 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
