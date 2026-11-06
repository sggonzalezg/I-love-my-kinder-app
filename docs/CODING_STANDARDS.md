# Coding Standards for i-Love-My-Kinder Mobile App

**English source:** This is the source of truth. See `CODING_STANDARDS.es.md` for the Spanish translation.

## Core Principles

1. **Legibility over brevity** — Clear names beat clever abbreviations
2. **KISS** — Use the simplest approach that works
3. **DRY** — Extract repeated logic into utilities
4. **SRP** — One function, one component, one job
5. **Descriptive naming** — Names explain purpose
6. **No magic numbers** — All constants go in `src/constants/`
7. **Modular by feature** — Each feature owns its screens, logic, tests

## File Structure

```
src/
├── features/           # By domain (auth, calendar, profile, etc.)
│   └── [feature]/
│       ├── screens/
│       ├── components/
│       ├── hooks/
│       ├── types/
│       └── __tests__/
├── components/         # Shared UI components
├── lib/                # Shared utilities
├── constants/          # All hardcoded values
├── types/              # Global types
└── app/                # Expo Router routes
```

## Naming Conventions

- **camelCase** for variables and functions
- **PascalCase** for components and types
- **UPPER_SNAKE_CASE** for constants in `src/constants/`

## React Components

- One component per file unless tightly coupled
- Props interface named `${ComponentName}Props`
- Functional components only (no class components)
- Hooks at the top, unconditionally
- Prop destructuring in function signature

```typescript
interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export function Button({ label, onPress, disabled = false }: ButtonProps) {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <Text>{label}</Text>
    </Pressable>
  );
}
```

## Animations and Gestures

- Use **Reanimated 4** and **Gesture Handler**
- Keep animation logic on UI thread (never setState in a gesture)
- Extract reusable animation logic to `src/lib/animations/`
- Every worklet must declare `'worklet'` as first line
- Never animate layout properties — use `transform` and `opacity` only

```typescript
// Correct: Gesture on UI thread
const gesture = Gesture.Pan()
  .onUpdate((event) => {
    x.set(event.translationX);  // Shared value only
  })
  .onEnd(() => {
    x.set(0);
  });

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: x.value }],
}));
```

## Hooks

- Hook names start with `use${Purpose}`
- Return objects, not arrays (unless it's a clear tuple)
- Example: `const { values, errors, isSubmitting } = useForm(initial)`

## Testing

- Tests go in `__tests__/` at the same level as the code
- File naming: `${subject}.test.ts`
- Use Jest with Arrange-Act-Assert pattern
- One behavior per test, descriptive test names
- Run tests before commits: `npm run test`

```typescript
describe('calculateDaysUntilDeadline', () => {
  it('returns 0 for today', () => {
    const result = calculateDaysUntilDeadline(new Date());
    expect(result).toBe(0);
  });
});
```

## Error Handling

- **Never silently fail** — always log or throw
- **Validate at boundaries** — API responses, user input, external data
- Use typed errors for complex error handling

## Imports and Exports

- Use **named exports** for functions, components, types, constants
- Group imports: React/Expo → third-party → local (blank lines between groups)
- Use absolute imports: `import { X } from '@lib/api'` (via tsconfig paths)

```typescript
import React, { useState } from 'react';
import { View } from 'react-native';
import Reanimated from 'react-native-reanimated';

import { fetchClass } from '@lib/api';
import { BUTTON_HEIGHT } from '@constants/sizes';
import { ClassCard } from './ClassCard';
```

## TypeScript

- Use **strict mode** in tsconfig.json
- Type props, return values, and variables
- Avoid `any` — use `unknown` then narrow the type
- Use generics for reusable logic

## Comments

Only comment the **why**, not the **what**. Code shows what it does; comments explain why it must do it that way.

```typescript
// Good: Explains the why
function debounceSearch(query, delayMs = 300) {
  // iOS keyboard dismissal is slow; debouncing reduces network calls
  return search(query);
}

// Bad: Repeats the code
const userName = user.name; // Get the user's name
```

## Boundaries

### Always
- Run tests before commits
- Follow naming conventions
- Use constants instead of magic numbers
- Validate input at function boundaries
- Extract repeated logic

### Ask First
- Adding a new external dependency
- Changing the file structure
- Adding analytics or telemetry
- Changes to authentication logic

### Never
- Commit secrets or API keys
- Remove failing tests without documenting why
- Use `console.log` in production code
- Commit commented-out code
- Disable ESLint rules without explaining why
- Animate layout properties
- Call setState inside a gesture handler
