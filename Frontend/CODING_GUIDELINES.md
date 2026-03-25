# Coding Guidelines

## CSS and Styling
**MANDATORY - All styling must be in separate CSS files:**
1. **NO inline CSS in components**
   - Do NOT use inline `style` attributes
   - Do NOT use sx prop with hardcoded style objects
   - Do NOT use styled-components or CSS-in-JS
2. **Create separate .css file for each component**
   - Component: `ComponentName.tsx` → Style: `ComponentName.css`
   - Import CSS at top of component: `import './ComponentName.css';`
   - Use descriptive class names: `.component-name`, `.component-name__element`
3. **CSS structure guidelines**
   - Use kebab-case for class names: `.my-component`, `.my-component__header`
   - Group related styles together
   - Use CSS variables for colors: `--primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
   - Organize media queries at the end of selectors
4. **MUI Component Integration**
   - Still use MUI components (Box, Card, Button, etc.)
   - Apply className prop to MUI components for styling
   - Example: `<Card className="project-card">`
   - Use MUI for layout logic, CSS for visual styling

## Material-UI (MUI) Compliance
**MANDATORY - Check before development:**
1. **All UI components must use Material-UI**
   - Replace or remove custom CSS modules and styled components
   - Use MUI components: Box, Card, Button, TextField, etc.
   - Use MUI icons from `@mui/icons-material`
   - Import from `@mui/material` (not `@mui/material/styles` for components)
2. **Layout and structure via MUI**
   - Leverage responsive design with breakpoints
   - Use `<Box>` component with `className` for layout
   - Use `<Grid>`, `<Stack>` for responsive layouts
   - MUI provides layout logic, CSS provides styling
3. **Layout components to use:**
   - `Box` for layout containers (with className)
   - `Grid` or CSS Grid (via Box with className) for responsive layouts
   - `Stack` for flex-based layouts (with className)
   - `Paper` for card-like surfaces (with className)

## TypeScript Checks
1. **Always check for TypeScript errors while making changes**
   - Run TypeScript type checking after any code modifications
   - Verify all imports and type declarations are correct
   - Fix any type errors before considering changes complete
   - Use `npx tsc --noEmit` to check for type errors without emitting files

## Project Documentation
**MANDATORY - Update after ANY code changes:**
1. **Always update PROJECT_STRUCTURE.md**
   - When creating new files, update the folder tree in PROJECT_STRUCTURE.md
   - When creating new folders, add them to the folder tree
   - Keep the documentation synchronized with actual codebase structure
   - This applies to both Frontend and Backend projects
2. **When to update:**
   - After adding new components, pages, or utilities
   - After reorganizing folders or moving files
   - After creating new CSS, API routes, or database models
   - Before marking any task as complete

## Additional Guidelines
- Ensure all changes maintain type safety
- Test the application after making changes
- Keep component interfaces and types up to date
- Verify MUI components render correctly in browser before committing
