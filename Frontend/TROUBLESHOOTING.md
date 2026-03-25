# Troubleshooting Guide - Issues Encountered and Fixes

## Issue #1: react-hook-form Package Resolution Error

### Problem
**Error Message:**
```
Failed to resolve entry for package "react-hook-form". 
The package may have incorrect main/module/exports specified in its package.json.
```

**Root Cause:**
- The initial version `react-hook-form@7.48.0` had compatibility issues with Vite 5.4.21
- The package's ESM module exports were not properly recognized by Vite's dependency pre-bundling
- This cascaded to `@hookform/resolvers` which depends on `react-hook-form`

### Symptoms:
- Dev server would start but fail during dependency scanning
- Browser would show blank page with build errors
- Multiple errors in terminal related to vite:dep-scan and vite:import-analysis plugins

### Solution:
Updated `react-hook-form` to version `7.51.0` in [package.json](package.json):
```json
{
  "dependencies": {
    "react-hook-form": "^7.51.0"  // Updated from 7.48.0
  }
}
```

### Steps to Fix:
1. Stopped the dev server: `Get-Process node | Stop-Process -Force`
2. Deleted node_modules: `Remove-Item -Recurse -Force node_modules`
3. Updated package.json with compatible version
4. Reinstalled dependencies: `npm install`
5. Restarted dev server: `npm run dev`

### Result:
✅ Server now runs without errors on `http://localhost:5173`

---

## Issue #2: CSS Module Syntax Error

### Problem
**Error Message:**
```
[postcss] postcss-modules-local-by-default: Expected an attribute.
```

**Root Cause:**
- CSS modules don't support bracket notation for class names with hyphens
- Used `.status['on-hold']` which is invalid in CSS
- CSS modules expect either camelCase or direct selectors

### Solution:
Fixed [src/components/ProjectCard.module.css](src/components/ProjectCard.module.css):
```css
/* Before (Invalid) */
.status['on-hold'] { }

/* After (Valid) */
.statusOnHold { }
```

Updated [src/components/ProjectCard.tsx](src/components/ProjectCard.tsx) to handle the status conditionally:
```typescript
className={`${styles.status} ${
  project.status === 'on-hold' 
    ? styles.statusOnHold 
    : styles[project.status]
}`}
```

### Result:
✅ CSS modules now parse correctly

---

## Current Status

### ✅ Working
- Vite dev server running successfully
- React + TypeScript compilation working
- React Router configured
- TanStack Query ready
- All API service layer configured
- Custom hooks implemented
- Layouts and components structured properly
- CSS modules loading correctly

### 🎨 Application Features Ready
- Dashboard layout with Sidebar + Header
- Auth layout for login
- Project card component
- Type-safe API services
- Server and UI state management hooks
- Form validation with Zod ready

### 📝 Documentation
All documentation files are available:
- [README.md](README.md) - Project overview
- [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture guide
- [DEVELOPMENT.md](DEVELOPMENT.md) - Development patterns
- [GETTING_STARTED.md](GETTING_STARTED.md) - Quick start guide

---

## Prevention Tips

1. **Always check compatibility** when starting a new Vite project with dependencies
2. **Use recent stable versions** of libraries (not just the initial release)
3. **Clear cache frequently** with `npm ci` or clean reinstalls for dependency issues
4. **Follow CSS module syntax rules** - use camelCase or direct selectors
5. **Keep Vite and related tools updated** to latest patch versions

---

## Next Steps

The application is now fully functional. You can:
1. Start adding features using patterns in [DEVELOPMENT.md](DEVELOPMENT.md)
2. Implement the Kanban board with drag-and-drop
3. Build out the analytics dashboard
4. Create API endpoints on the backend
5. Connect to a real database

**Happy coding!** 🚀
