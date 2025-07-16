# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Svelte 5 starter template with SvelteKit, Tailwind CSS 4, and ShadCN-Svelte components. It uses TypeScript for type safety and Vite as the build tool.

## Key Commands

### Development

```bash
yarn dev          # Start development server at http://localhost:5173
yarn build        # Build for production
yarn preview      # Preview production build
```

### Code Quality

```bash
yarn check        # Type-check TypeScript files
yarn check:watch  # Type-check in watch mode
yarn lint         # Run ESLint to check for issues
yarn lint:fix     # Auto-fix linting and formatting issues
```

## Architecture Overview

### Component Organization

- **UI Components** (`src/components/`): Organized by type following ShadCN-Svelte pattern
  - Each component has its own directory with `index.ts` for exports
  - Components use compound component pattern (e.g., Alert with AlertTitle, AlertDescription)
  - Utility classes managed via `cn()` helper from `src/core/utils/index.ts`

### Application Structure

- **Routes** (`src/routes/`): SvelteKit file-based routing
  - `+page.svelte` files define routes
  - `+layout.svelte` for shared layouts
- **Core Logic** (`src/core/`):
  - `services/`: API client setup with Axios and cache interceptor
  - `context/`: Svelte stores for global state (auth, user)
  - `types/`: TypeScript type definitions
  - `constants/`: Application constants and enums

### State Management

- Uses Svelte's built-in stores and context API
- Global auth state in `src/core/context/auth.svelte.ts`
- User state in `src/core/context/user.svelte.ts`

### Styling

- Tailwind CSS 4 with Vite plugin configuration
- Global styles in `src/app.css` with CSS variables for theming
- Dark mode support via CSS custom properties
- Component styles use Tailwind utility classes with `cn()` helper

### API Integration

- Axios client configured in `src/core/services/client.ts`
- Built-in request/response caching via axios-cache-interceptor
- Service modules in `src/core/services/` for different API endpoints

## Important Development Notes

1. **Import Aliases**: Use `src/` alias instead of relative imports

   ```typescript
   import { Button } from 'src/components/button';
   ```

2. **Component Creation**: When creating new components, follow the ShadCN-Svelte pattern:

   - Create a directory with the component name
   - Export from `index.ts`
   - Use compound components for complex UI elements

3. **Type Safety**: TypeScript is configured in strict mode. Always define proper types for:

   - Component props
   - API responses
   - Store values

4. **Pre-commit Hooks**: Husky runs linting before commits. Fix any issues with `yarn lint:fix`

5. **No Test Framework**: This starter doesn't include testing setup. Consider adding Vitest or Playwright if needed.
