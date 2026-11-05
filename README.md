# I Love My Kinder: mobile app

Expo (SDK 58) + Expo Router app for families, teachers and the direction of the nursery.
Design: `docs/design/design.md` and the plan in `docs/development/sdd/mobile.md` (agency folder `projects/i-love-my-kinder/`).

## Run

```bash
cp .env.example .env        # Supabase URL and anon key (local stack: repos/backend, `supabase start`)
npm install
npm start                   # Expo Go on the LAN, port 8081
```

## Check

```bash
npm test                    # jest-expo, pure logic in src/lib
npm run typecheck           # tsc --noEmit
npm run sync-legal          # copy projects/i-love-my-kinder/legal/*.md into src/legal/documents.generated.ts
```

## Layout

- `src/app/` routes only: `(app)/(tabs)` with Hoy · Sala · Galería · Calendario · Perfil
- `src/components/` design.md section 6 components
- `src/lib/` pure logic with tests in `__tests__/`
- `src/legal/` verbatim consent texts and the generated legal documents
- `src/theme/` design tokens and motion tokens
- `src/data/` Supabase client
