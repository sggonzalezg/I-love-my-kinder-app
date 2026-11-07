# Coding Standards: Expo / React Native

This document establishes mandatory coding standards for the i-love-my-kinder mobile app. All code must follow these rules. See `docs/CODING_STANDARDS.md` for detailed examples and guidelines.

## Principles

1. **Legibility over brevity** — A clear name beats a clever abbreviation. `userIsAuthenticated` beats `userAuth`.
2. **KISS: Keep It Simple** — Use the simplest approach that works. No premature optimization.
3. **DRY: Don't Repeat Yourself** — Extract repeated logic into functions or utilities.
4. **SRP: Single Responsibility Principle** — One function, one component, one job. Reanimated worklets stay separate from business logic.
5. **Descriptive naming** — Names should explain purpose. `const isOverdue = dueDate < today` is clearer than `const x = a < b`.
6. **No magic numbers or strings** — All constants go in `src/constants/`.
7. **Modular structure by feature** — Each feature owns its screens, logic, and tests.

## File Structure

- Features in `src/features/<feature>/` with screens, components, hooks, types, tests
- Shared components in `src/components/`
- Utilities in `src/lib/` (animations, api, storage, utils)
- All constants in `src/constants/`
- Global types in `src/types/`
- Expo Router routes in `src/app/`

## Naming Conventions

- **camelCase** for variables and functions
- **PascalCase** for components and types
- **UPPER_SNAKE_CASE** for constants in `src/constants/`
- **No magic numbers/strings** — all go in constants

## React Components

- One component per file
- Props interface named `${ComponentName}Props`
- Functional components only
- Hooks at the top, unconditionally
- Prop destructuring in function signature

## Component State

- Component state uses `useReducer`, never `useState`
- Action types are named constants (`const COUNTER_ACTIONS = { INCREMENTED: 'incremented' } as const`)
- The reducer is a pure function outside the component (or in its own file) with its own tests

## Styles

- UI is split into reusable components; shared ones live in `src/components/`
- No inline styles and no `style` objects in the markup
- Each component's styles live in its own `<Component>.styles.ts` with `StyleSheet.create`; no SCSS transformer
- Styles that depend on the color scheme use `createThemedStyles((colors) => ({ ... }))` from `src/theme/themed-styles.ts`
- A value only known at runtime (a safe-area inset) comes from a small function exported by the same `.styles.ts`

## Animations and Gestures

- Use Reanimated 4 and Gesture Handler
- Keep animation logic on UI thread (no setState in gestures)
- Extract reusable animation logic to `src/lib/animations/`
- Every worklet must declare `'worklet'` as first line
- Never animate layout properties — use `transform` and `opacity`

## Testing

- Tests in `__tests__/` folders
- File naming: `${subject}.test.ts`
- Arrange-Act-Assert pattern
- One behavior per test
- Run before commits: `npm run test`

## Error Handling

- Never silently fail — always log or throw
- Validate at boundaries (API responses, user input)

## Imports and Exports

- Use named exports
- Group imports: React/Expo → third-party → local
- Use absolute imports via tsconfig paths

## TypeScript

- Strict mode enabled
- Type props, returns, and variables
- Avoid `any` — use `unknown` then narrow

## Comments

Only comment the **why**, not the **what**. Code shows what it does; comments explain why it must do it that way.

## Boundaries

**Always:** Run tests before commits, follow naming conventions, use constants instead of magic numbers, validate inputs, extract repeated logic

**Ask First:** Adding external dependencies, changing file structure, adding new animation/gesture patterns, adding telemetry

**Never:** Commit secrets/API keys, remove failing tests without documenting why, use `console.log` in production, commit commented code, disable ESLint rules without reason, animate layout properties, setState in gestures, `useState` in components, inline styles or `style` objects in the markup

See `docs/CODING_STANDARDS.md` for detailed examples and context.
