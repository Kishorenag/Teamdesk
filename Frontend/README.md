# Project Management Dashboard

A modern React + TypeScript SaaS project management application with Kanban board, analytics, and comprehensive state management.

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: TanStack Query (Server State) + React Hooks (UI State)
- **Form Management**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Styling**: CSS Modules

## Features

- **Complex Layouts**: Separate layouts for Dashboard (Sidebar + Header) and Auth (Centered Card)
- **Kanban Board**: Drag-and-drop task management across columns
- **Analytics**: Project insights and statistics
- **Server State Management**: Efficient data fetching with TanStack Query
- **UI State Management**: Modal, sidebar, and filter state with custom hooks
- **Type Safety**: Strict TypeScript interfaces for all data models
- **Form Validation**: Zod schema validation with React Hook Form

## Project Structure

```
src/
├── components/              # Reusable components
│   ├── layout/             # Layout components
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   └── ProjectCard.tsx
├── pages/                   # Page components
│   ├── LoginPage.tsx
│   └── DashboardPage.tsx
├── layouts/                 # Layout templates
│   ├── DashboardLayout.tsx  # Sidebar + Header layout
│   └── AuthLayout.tsx       # Centered card layout
├── routes/                  # Routing configuration
│   └── AppRoutes.tsx
├── types/                   # TypeScript interfaces
│   └── index.ts
├── services/                # API services
│   └── api.service.ts
├── hooks/                   # Custom hooks
│   ├── useApi.ts           # TanStack Query hooks
│   ├── useUI.ts            # UI state management hooks
│   └── index.ts
├── utils/                   # Utility functions
├── App.tsx                  # Main app component
└── main.tsx                 # Entry point
```

## Key Concepts

### State Separation

- **Server State** (useApi.ts): Manages data from the API using TanStack Query
  - Automatic caching
  - Background refetching
  - Synchronization across tabs
  - Automatic garbage collection

- **UI State** (useUI.ts): Manages local application state
  - Modal open/close states
  - Sidebar toggle
  - Filter states
  - No API calls

### Type Safety

All data structures are defined in `src/types/index.ts`:
- User, Project, Task, Column, Subtask, Attachment
- API response types
- Form input types

### API Service

Centralized API client in `src/services/api.service.ts`:
- Automatic token injection
- Error handling
- Typed responses
- Interceptors for authentication

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Build

```bash
npm run build
```

## Environment Variables

Create a `.env` file:

```
VITE_API_URL=http://localhost:3000/api
```

## Future Implementation Tasks

- [ ] Implement Kanban board with drag-and-drop
- [ ] Add analytics dashboard
- [ ] Create task detail and edit modals
- [ ] Implement project creation flow
- [ ] Add team management
- [ ] Implement subtasks and attachments
- [ ] Add real-time notifications
- [ ] Implement role-based access control
- [ ] Add dark mode support
- [ ] Implement offline support with Service Workers

## License

MIT
