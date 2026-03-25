# Architecture Guide

## Overview

This document explains the architecture and design patterns used in the Project Management Dashboard.

## State Management Architecture

### 1. Server State (API Data)

**File**: `src/hooks/useApi.ts`

Server state is managed using **TanStack Query** (React Query). This library handles:
- Data fetching and caching
- Synchronization across browser tabs
- Background refetching
- Automatic garbage collection
- Mutation handling

**Example**:
```typescript
// Fetching data
const { data: projects, isLoading } = useProjects();

// Mutating data
const { mutate: createProject } = useCreateProject();
createProject(
  { name: "My Project", description: "..." },
  {
    onSuccess: () => {
      // Handle success
    }
  }
);
```

**Key Features**:
- Automatic invalidation of related queries on mutations
- Retry logic for failed requests
- Stale time and cache time configuration

### 2. UI State (Local Application State)

**File**: `src/hooks/useUI.ts`

UI state is managed using React's built-in `useState` hook. This includes:
- Modal open/close states
- Sidebar visibility
- Filter selections
- Form visibility

**Example**:
```typescript
// Modal management
const editTaskModal = useEditTaskModal();

const openTaskModal = (task: Task) => {
  editTaskModal.open(task); // Open with task data
};

const closeTaskModal = () => {
  editTaskModal.close(); // Close and clear task
};
```

**Key Features**:
- Simple and predictable
- No side effects
- Instant UI updates

## Component Structure

### Layout Components

Layouts define the overall page structure and are selected by routes.

**DashboardLayout** (`src/layouts/DashboardLayout.tsx`):
```
┌─────────────────────────────────┐
│         Header                  │
├──────────┬──────────────────────┤
│          │                      │
│ Sidebar  │    Main Content      │
│          │     (Outlet)         │
│          │                      │
└──────────┴──────────────────────┘
```

**AuthLayout** (`src/layouts/AuthLayout.tsx`):
```
┌─────────────────────────────────┐
│                                 │
│     ┌─────────────────────┐    │
│     │   Auth Card         │    │
│     │   (Login/Register)  │    │
│     └─────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

### Page Components

Pages are rendered within layouts using React Router's `<Outlet />`.

```
Route
  └─ Layout
       └─ Outlet (renders Page)
            └─ Page Component
```

### Feature Components

Feature components are reusable components that handle specific functionality:
- ProjectCard: Displays a project summary
- TaskCard: Displays a task (future)
- Modal: Dialog for editing/creating (future)

## Type Safety

### Core Types

All types are defined in `src/types/index.ts`:

```typescript
// Domain Models
interface User { id, email, name, avatar, role, createdAt }
interface Project { id, name, description, status, columns, members, owner, createdAt, updatedAt }
interface Task { id, title, description, status, priority, columnId, projectId, assignedTo, dueDate, ... }
interface Column { id, name, projectId, position, tasks }

// Form Input Types
interface CreateTaskInput { title, description, priority, dueDate, assignedTo }
interface UpdateTaskInput extends Partial<CreateTaskInput> { id, status }

// API Response Types
interface ApiResponse<T> { success, data, error, message }
interface PaginatedResponse<T> { items, total, page, limit, totalPages }
```

### Usage

```typescript
// Typed API service
const createTask = async (projectId: string, data: CreateTaskInput): Promise<ApiResponse<Task>> => {
  // ...
};

// Typed hooks
const { data: task } = useTask(projectId, taskId); // Type: Task | undefined

// Typed components
interface ProjectCardProps {
  project: Project;
}
const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  // project is fully typed
};
```

## API Service Pattern

**File**: `src/services/api.service.ts`

The API service is a singleton that handles all HTTP requests:

```typescript
class ApiService {
  private client: AxiosInstance;
  
  constructor() {
    this.client = axios.create({ /* config */ });
    // Interceptors for auth, error handling, etc.
  }
  
  // Organized by domain
  async getProjects(): Promise<ApiResponse<Project[]>> { }
  async createProject(data: CreateProjectInput): Promise<ApiResponse<Project>> { }
  async getTasks(projectId: string): Promise<ApiResponse<Task[]>> { }
  // ...
}

export const apiService = new ApiService();
```

**Benefits**:
- Centralized configuration
- Automatic token injection
- Consistent error handling
- Easy to mock in tests
- Type-safe API calls

## Data Flow

### Fetching Data

```
Component
  ├─ useProjects() [TanStack Query Hook]
  │   ├─ Check cache
  │   ├─ If stale: apiService.getProjects()
  │   │   └─ HTTP GET /api/projects
  │   ├─ Update cache
  │   └─ Return { data, isLoading, error }
  │
  └─ Render with data
```

### Mutating Data

```
Component
  ├─ useCreateProject() [TanStack Query Mutation]
  │   ├─ User submits form
  │   ├─ mutate(formData)
  │   │   ├─ apiService.createProject(formData)
  │   │   │   └─ HTTP POST /api/projects
  │   │   ├─ invalidateQueries(['projects'])
  │   │   │   └─ Refetch data
  │   │   └─ Call onSuccess
  │   │
  │   └─ Return { isPending, error }
  │
  └─ Render loading state or success
```

### Managing UI State

```
Component
  ├─ useEditTaskModal() [Custom Hook]
  │   ├─ useState(isOpen, selectedTask)
  │   ├─ Return { isOpen, open(task), close(), selectedTask }
  │   │
  │   └─ User opens modal
  │       ├─ editTaskModal.open(task)
  │       └─ setState({ isOpen: true, selectedTask: task })
  │
  └─ Render modal if isOpen
```

## Routing Structure

```
/
├─ /auth (AuthLayout)
│  ├─ /login (LoginPage)
│  └─ /register (RegisterPage - Future)
│
└─ /dashboard (DashboardLayout)
   ├─ /dashboard (DashboardPage)
   ├─ /projects (ProjectsPage)
   ├─ /projects/:id (ProjectDetail - Future)
   ├─ /tasks (TasksPage - Future)
   ├─ /analytics (AnalyticsPage - Future)
   └─ /team (TeamPage - Future)
```

## Error Handling

### API Errors

```typescript
// In service
this.client.interceptors.response.use(
  response => response.data,
  error => {
    // Handle 401 -> redirect to login
    // Handle 500 -> show error toast
    return Promise.reject(error);
  }
);

// In component
const { data, error } = useProjects();
if (error) {
  return <div>Error: {error.message}</div>;
}
```

### Form Validation Errors

```typescript
// Using React Hook Form + Zod
const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Minimum 6 characters'),
});

const { formState: { errors } } = useForm({
  resolver: zodResolver(loginSchema),
});

if (errors.email) {
  return <span>{errors.email.message}</span>;
}
```

## Performance Optimizations

### Query Caching

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes before data is stale
      gcTime: 1000 * 60 * 10,   // Keep unused data for 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

### Code Splitting

Routes are lazy-loaded (can be implemented):

```typescript
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ProjectsPage = lazy(() => import('@/pages/ProjectsPage'));

// Usage
<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/dashboard" element={<DashboardPage />} />
  </Routes>
</Suspense>
```

## Environment Configuration

```env
# .env
VITE_API_URL=http://localhost:3000/api
```

```typescript
// In code
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
```

## Best Practices

1. **Separate Server and UI State**: Use TanStack Query for API data, React hooks for UI state
2. **Type Everything**: Use TypeScript interfaces for all data structures
3. **Centralize API Calls**: Use a single API service class
4. **Component Composition**: Break down large components into smaller, reusable pieces
5. **Error Boundaries**: Handle errors gracefully
6. **Loading States**: Show proper loading indicators
7. **Validation**: Validate data with Zod before submission
8. **Accessibility**: Use semantic HTML and ARIA attributes

## Testing Strategy (Future)

```typescript
// Unit tests for utilities
// Integration tests for custom hooks
// Component tests for React components
// E2E tests with Cypress/Playwright
```

## Future Improvements

- [ ] Add React.lazy() for code splitting
- [ ] Implement error boundaries
- [ ] Add comprehensive logging
- [ ] Implement offline support with IndexedDB
- [ ] Add real-time updates with WebSockets
- [ ] Implement role-based access control (RBAC)
- [ ] Add analytics tracking
- [ ] Implement dark mode
