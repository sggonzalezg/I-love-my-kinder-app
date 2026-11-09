# I Love My Kinder: mobile app

Expo app for the families and teachers of a nursery: the child's day, the room, gallery, calendar, notices, chat with the teachers and outing permissions. Data and auth come from the Supabase backend ([I-love-my-kinder-be](https://github.com/sggonzalezg/I-love-my-kinder-be)); the director works from the web panel ([I-love-my-kinder-web](https://github.com/sggonzalezg/I-love-my-kinder-web)).

## Stack

- Expo SDK 58 with Expo Router, React Native 0.88, React 19, TypeScript
- Supabase (`@supabase/supabase-js`) with the session stored on the device
- Reanimated and Gesture Handler for motion, `expo-image` and `expo-video` for media, `expo-notifications` for push
- Jest with `jest-expo`

## Requirements

- Node.js 22+
- Expo Go on a phone on the same network, or an iOS simulator / Android emulator
- The backend running locally (`npm run dev` in the backend repo) or a Supabase test project

## Getting started

```bash
npm install
cp .env.example .env   # fill in the Supabase URL and anon key
npm start              # Expo dev server on port 8081, scan the QR with Expo Go
```

`npm run ios`, `npm run android` and `npm run web` open the app on a simulator, emulator or browser. Add packages with `npx expo install <package>` so versions match the SDK.

## Environment variables

| Variable | Purpose |
|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase API URL (local stack: `http://127.0.0.1:54321`, or your LAN IP when testing on a phone) |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |

Both are public and end up in the app bundle. The service role key never goes in this repo.

## Scripts

| Script | What it does |
|---|---|
| `npm start` | Expo dev server |
| `npm run ios` / `android` / `web` | Open on a simulator, emulator or browser |
| `npm test` | Jest tests |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | `expo lint` |
| `npm run sync-legal` | Copy the legal documents into `src/legal/documents.generated.ts` (reads `../../legal`, or `LEGAL_DIR`) |

## Structure

```
src/
├── app/          Expo Router routes only
│   ├── (auth)/   Sign-in, consent, push permission
│   └── (app)/    (tabs) Hoy · Sala · Galería · Calendario · Perfil, plus chat, notices,
│                 day, event, permission, authorizations, legal, delete-account
├── features/     Feature modules: chat, family, gallery, outing-permission
├── components/   Shared UI components, each with its own *.styles.ts
├── data/         Supabase client, queries and data hooks
├── lib/          Pure logic, tested in __tests__/
├── constants/    Named constants
├── legal/        Consent texts and the generated legal documents
└── theme/        Design and motion tokens
```

## Status

Sign-in in the app still uses a phone code. It is moving to Google, Apple and an email code, which the backend already supports (sign-in spec, phase 6b).

## Contributing

- Follow [`docs/CODING_STANDARDS.md`](docs/CODING_STANDARDS.md), [`CLAUDE.md`](CLAUDE.md) and [`AGENTS.md`](AGENTS.md).
- Component state uses `useReducer`; styles live in separate style files, never inline.
- Every change goes in a `feature/*` branch created from `develop`, with a pull request to `develop`. Never push to `main` or `develop`.
- Never delete or skip a test to get green.
