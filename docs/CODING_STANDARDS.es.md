# Estándares de Código para la App Mobile i-Love-My-Kinder

**El archivo en inglés (CODING_STANDARDS.md) es la fuente de verdad. Este documento es su traducción.**

## Principios Fundamentales

1. **Legibilidad sobre brevedad** — Nombres claros valen más que abreviaturas inteligentes
2. **KISS** — Usa el enfoque más simple que funcione
3. **DRY** — Extrae la lógica repetida en utilidades
4. **SRP** — Una función, un componente, un trabajo
5. **Nombres descriptivos** — Los nombres explican el propósito
6. **Sin números mágicos** — Todas las constantes van en `src/constants/`
7. **Modular por feature** — Cada feature organiza sus pantallas, lógica y tests

## Estructura de Carpetas

```
src/
├── features/           # Por dominio (auth, calendar, profile, etc.)
│   └── [feature]/
│       ├── screens/
│       ├── components/
│       ├── hooks/
│       ├── types/
│       └── __tests__/
├── components/         # Componentes compartidos
├── lib/                # Utilidades compartidas
├── constants/          # Todos los valores hardcodeados
├── types/              # Tipos globales
└── app/                # Rutas de Expo Router
```

## Convenciones de Nombres

- **camelCase** para variables y funciones
- **PascalCase** para componentes y tipos
- **UPPER_SNAKE_CASE** para constantes en `src/constants/`

## Componentes React

- Un componente por archivo a menos que estén fuertemente acoplados
- Interface de props nombrada `${ComponentName}Props`
- Solo componentes funcionales (sin componentes de clase)
- Hooks al inicio, sin condicionales
- Destructuring de props en la firma de la función

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

## Animaciones y Gestos

- Usa **Reanimated 4** y **Gesture Handler**
- Mantén la lógica de animaciones en el hilo de UI (nunca setState en un gesto)
- Extrae lógica de animaciones reutilizable a `src/lib/animations/`
- Cada función worklet debe declarar `'worklet'` como primera línea
- Nunca animes propiedades de layout — usa solo `transform` y `opacity`

```typescript
// Correcto: Gesto en hilo de UI
const gesture = Gesture.Pan()
  .onUpdate((event) => {
    x.set(event.translationX);  // Solo shared value
  })
  .onEnd(() => {
    x.set(0);
  });

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: x.value }],
}));
```

## Hooks

- Los nombres de hooks empiezan con `use${Purpose}`
- Retorna objetos, no arrays (a menos que sea una tupla clara)
- Ejemplo: `const { values, errors, isSubmitting } = useForm(initial)`

## Testing

- Los tests van en `__tests__/` al mismo nivel que el código
- Nombres de archivos: `${subject}.test.ts`
- Usa Jest con patrón Arrange-Act-Assert
- Un comportamiento por test, nombres descriptivos
- Ejecuta tests antes de hacer commit: `npm run test`

```typescript
describe('calculateDaysUntilDeadline', () => {
  it('returns 0 for today', () => {
    const result = calculateDaysUntilDeadline(new Date());
    expect(result).toBe(0);
  });
});
```

## Manejo de Errores

- **Nunca falles en silencio** — siempre loga o lanza una excepción
- **Valida en los límites** — respuestas de API, entrada del usuario, datos externos
- Usa errores tipados para manejo de errores complejo

## Imports y Exports

- Usa **named exports** para funciones, componentes, tipos y constantes
- Agrupa imports: React/Expo → third-party → local (líneas en blanco entre grupos)
- Usa imports absolutos: `import { X } from '@lib/api'` (vía tsconfig paths)

```typescript
import React, { useState } from 'react';
import { View } from 'react-native';
import Reanimated from 'react-native-reanimated';

import { fetchClass } from '@lib/api';
import { BUTTON_HEIGHT } from '@constants/sizes';
import { ClassCard } from './ClassCard';
```

## TypeScript

- Usa **strict mode** en tsconfig.json
- Tipifica props, valores de retorno y variables
- Evita `any` — usa `unknown` y luego estrecha el tipo
- Usa genéricos para lógica reutilizable

## Comentarios

Solo comenta el **por qué**, no el **qué**. El código muestra qué hace; los comentarios explican por qué debe hacerlo de esa forma.

```typescript
// Correcto: Explica el por qué
function debounceSearch(query, delayMs = 300) {
  // El cierre del teclado en iOS es lento; el debouncing reduce
  // las llamadas de red durante la escritura activa
  return search(query);
}

// Incorrecto: Repite el código
const userName = user.name; // Obtén el nombre del usuario
```

## Límites

### Siempre
- Ejecuta tests antes de hacer commit
- Sigue las convenciones de nombres
- Usa constantes en lugar de números mágicos
- Valida input en los límites de funciones
- Extrae lógica repetida

### Pregunta Primero
- Añadir una nueva dependencia externa
- Cambiar la estructura de carpetas
- Añadir analytics o telemetría
- Cambios en lógica de autenticación

### Nunca
- Haz commit de secretos o claves de API
- Elimines tests fallidos sin documentar por qué
- Usa `console.log` en código de producción
- Hagas commit de código comentado
- Desactives reglas de ESLint sin explicar por qué
- Animes propiedades de layout
- Llames a setState dentro de un manejador de gesto
