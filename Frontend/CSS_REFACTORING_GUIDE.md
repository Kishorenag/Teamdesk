# CSS Refactoring Guide - No Inline CSS

## Overview
This document outlines the CSS refactoring initiative to move all inline styles from components to separate CSS files. This improves code maintainability, performance, and follows modern CSS best practices.

## Current Status

### ✅ Completed Files (CSS created + imports added)
1. **LoginPage** - Login form styling
2. **RegisterPage** - Registration form styling  
3. **DashboardPage** - Dashboard layout and stats cards
4. **ProjectsPage** - Project cards and grid layout
5. **ProjectDetailsPage** - Project Kanban view
6. **TasksPage** - Tasks table and filters
7. **AnalyticsPage** - Analytics charts and metrics
8. **TeamPage** - Team members management

### ⏳ In Progress - Need JSX Refactoring
The CSS files are created and imports are added. The following pages need inline sx props replaced with className attributes:
- DashboardPage (header, stats cards, projects section)
- ProjectsPage (grid, cards, dialogs)
- ProjectDetailsPage (full component)
- TasksPage (table, chips)
- AnalyticsPage (metrics, charts)
- TeamPage (current user card, members table)

### ⏳ Not Started
- Layout files (AuthLayout.tsx, DashboardLayout.tsx)
- Component files (ProjectCard.tsx)
- Any custom components in /components folder

## CSS Structure Pattern

### File Organization
```
components/
├── ComponentName.tsx
├── ComponentName.css
└── (ComponentName specific styles only)

pages/
├── PageName.tsx
├── PageName.css
└── (Page specific styles only)

layouts/
├── LayoutName.tsx
├── LayoutName.css
└── (Layout specific styles only)
```

### CSS Naming Convention
Use BEM (Block Element Modifier) pattern with kebab-case:

```css
/* Block */
.component-name { }

/* Element (part of block) */
.component-name__header { }
.component-name__content { }
.component-name__footer { }

/* Modifier (variant) */
.component-name--active { }
.component-name__item--selected { }

/* Sub-elements under elements are allowed */
.component-name__header__title { }
.component-name__header__menu { }
```

### CSS Variables Pattern
Define at top of each CSS file:

```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --primary-color: #667eea;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --border-radius-md: 12px;
  --spacing-unit: 8px;
}
```

### Responsive Design Pattern
```css
/* Base styles (mobile first) */
.component { }

/* Tablet and up */
@media (min-width: 600px) {
  .component { }
}

/* Desktop and up */
@media (min-width: 960px) {
  .component { }
}
```

## Component Refactoring Workflow

### Step 1: Create CSS File
Create `ComponentName.css` with all styles extracted from component's sx props.

### Step 2: Add Import
At top of component file, add:
```tsx
import './ComponentName.css';
```

### Step 3: Replace Inline Styles with classNames
**BEFORE:**
```tsx
<Box sx={{ 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'flex-start', 
  mb: 3 
}}>
  <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
    Title
  </Typography>
</Box>
```

**AFTER:**
```tsx
<Box className="component__header">
  <Typography variant="h3" className="component__title">
    Title
  </Typography>
</Box>
```

**In CSS:**
```css
.component__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-unit) * 3;
}

.component__title {
  font-weight: 800;
  margin-bottom: var(--spacing-unit);
}
```

### Step 4: Dynamic Styles (when needed)
Use inline styles ONLY for truly dynamic values:

```tsx
<Card className="stat-card" style={{ '--card-color': stat.color } as React.CSSProperties}>
  {/* Content */}
</Card>
```

In CSS:
```css
.stat-card::before {
  background: var(--card-color, var(--primary-color));
}
```

### Step 5: MUI Props Only for Layout Logic
Keep ONLY these MUI props:
- `variant` - For Typography variants
- `component` - For semantic HTML
- `display`, `flex`, `justifyContent` (only when needed for flex/grid)
- `gridColumn`, `gridRow` (for grid layouts)
- Event handlers (onClick, onChange, etc.)
- Conditional rendering props

```tsx
<Button
  variant="contained"
  fullWidth
  className="button-primary"  // Use className
  onClick={handleClick}         // Allowed
  disabled={isPending}          // Allowed
>
  Click Me
</Button>
```

## Migration Checklist

### For DashboardPage
- [ ] Header section (title, subtitle, buttons)
- [ ] Stats cards grid
- [ ] Projects grid section
- [ ] Empty state card
- [ ] Test responsive behavior

### For ProjectsPage
- [ ] Header section
- [ ] Project cards (color header, content, actions)
- [ ] Create project dialog
- [ ] Empty state
- [ ] Test card grid responsiveness

### For ProjectDetailsPage
- [ ] Back button styling
- [ ] Project title
- [ ] Project info cards (owner, team, status)
- [ ] Columns layout
- [ ] Task cards
- [ ] Create task dialog
- [ ] Empty column states

### For TasksPage
- [ ] Header section
- [ ] Project filter controls
- [ ] Task table styling
- [ ] Status and priority chips
- [ ] Empty table state

### For AnalyticsPage
- [ ] Header section
- [ ] Project selector
- [ ] Metric cards grid
- [ ] Charts container
- [ ] Status distribution grid
- [ ] Empty state

### For TeamPage
- [ ] Header section (title, add button)
- [ ] Current user card (gradient background, avatar, info)
- [ ] Team members table
- [ ] Member rows and cells
- [ ] Add member dialog
- [ ] Empty state

## Best Practices

### ✅ DO
- Use CSS classes for all visual styling
- Use CSS variables for colors and spacing
- Use BEM naming convention
- Keep CSS organized by component sections
- Use CSS Grid/Flexbox for layout
- Use media queries for responsive design
- Import CSS at top of component file

### ❌ DON'T
- Use inline sx props for styling (only for very dynamic values)
- Use CSS modules (use plain CSS)
- Use styled-components or emotion
- Mix inline styles and CSS class naming
- Use !important (except in rare cases)
- Create global styles (use component-scoped CSS)

## Performance Benefits
- Reduced JavaScript bundle size
- Better CSS tree-shaking
- Easier browser caching of CSS
- Cleaner, more readable components
- Better separation of concerns

## Testing Checklist After Refactoring
- [ ] Component renders without errors
- [ ] Styles match original appearance
- [ ] Responsive design works at breakpoints
- [ ] Hover/active states work
- [ ] Dialog/modal styling correct
- [ ] Colors match brand palette
- [ ] Spacing consistent with design system

## Examples Completed

### LoginPage Pattern
```tsx
// Component
import './LoginPage.css';

<Box component="form" className="login-form">
  <Button className="login-form__submit-button">Login</Button>
</Box>

// CSS
.login-form {
  display: flex;
  flex-direction: column;
  gap: calc(var(--spacing-unit) * 2.5);
}

.login-form__submit-button {
  background: var(--primary-gradient);
  margin-top: calc(var(--spacing-unit) * 2.5);
}
```

### Dashboard Stats Card Pattern
```tsx
// Component
<Card className="dashboard-stat-card" style={{ '--stat-color': stat.color } as React.CSSProperties}>
  <Box className="dashboard-stat-card__content">
    <Typography className="dashboard-stat-card__label">{stat.label}</Typography>
  </Box>
</Card>

// CSS
.dashboard-stat-card {
  padding: calc(var(--spacing-unit) * 3.125);
  position: relative;
}

.dashboard-stat-card::before {
  background: var(--stat-color, #667eea);
}
```

## Next Steps
1. Complete JSX refactoring for remaining pages
2. Refactor layout files (AuthLayout, DashboardLayout)
3. Refactor reusable components (ProjectCard)
4. Test all pages for styling consistency
5. Performance audit before production

## Questions or Issues?
Refer to CODING_GUIDELINES.md for the complete CSS requirements.
