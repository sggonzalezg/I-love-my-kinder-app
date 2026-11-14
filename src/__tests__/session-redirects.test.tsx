import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderRouter, screen } from 'expo-router/testing-library';
import { Text } from 'react-native';

import AppLayout from '@/app/(app)/_layout';
import AuthLayout from '@/app/(auth)/_layout';
import { RootStackLayout } from '@/app/_layout';
import { SESSION_STORAGE_KEY } from '@/constants/storage';
import { SessionProvider } from '@/data/session';

type AuthListener = (event: string) => Promise<void>;

let authListener: AuthListener | null = null;

// expo-router/testing-library mocks Reanimated with this module, whose real copy cannot load under Jest.
jest.mock('react-native-reanimated/mock', () => ({ default: {}, useReducedMotion: () => false }));
jest.mock('react-native-safe-area-context', () => jest.requireActual('react-native-safe-area-context/jest/mock').default);
jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@/data/supabase', () => ({
  invoke: jest.fn(),
  supabase: {
    auth: {
      onAuthStateChange: (listener: AuthListener) => {
        authListener = listener;
        return { data: { subscription: { unsubscribe: jest.fn() } } };
      },
    },
  },
}));

const STORED_SESSION = { user_id: 'user-1', nursery_id: 'nursery-1', roles: ['family'], active_role: 'family' };

function HomeScreen() {
  return <Text>Hoy</Text>;
}

function LoginScreen() {
  return <Text>Ingresar</Text>;
}

function renderApp() {
  return renderRouter(
    {
      _layout: RootStackLayout,
      '(app)/_layout': AppLayout,
      '(app)/index': HomeScreen,
      '(auth)/_layout': AuthLayout,
      '(auth)/phone': LoginScreen,
    },
    { initialUrl: '/', wrapper: SessionProvider },
  );
}

function storedSession(session: object | null) {
  jest.mocked(AsyncStorage.getItem).mockImplementation(async (key: string) =>
    key === SESSION_STORAGE_KEY && session ? JSON.stringify(session) : null,
  );
}

beforeEach(() => {
  authListener = null;
  jest.mocked(AsyncStorage.getItem).mockReset();
});

describe('session redirects', () => {
  it('sends a user with no session to the login', async () => {
    storedSession(null);
    await renderApp();
    expect(await screen.findByText('Ingresar')).toBeTruthy();
    expect(screen).toHavePathname('/phone');
  });

  it('opens the app for a stored session', async () => {
    storedSession(STORED_SESSION);
    await renderApp();
    expect(await screen.findByText('Hoy')).toBeTruthy();
    expect(screen).toHavePathname('/');
  });

  it('sends the user back to the login when the session ends', async () => {
    storedSession(STORED_SESSION);
    await renderApp();
    await screen.findByText('Hoy');

    await act(async () => {
      await authListener?.('SIGNED_OUT');
    });

    expect(await screen.findByText('Ingresar')).toBeTruthy();
    expect(screen).toHavePathname('/phone');
  });
});
