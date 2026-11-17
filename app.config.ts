import type { ConfigContext, ExpoConfig } from 'expo/config';

const GOOGLE_SIGN_IN_PLUGIN = '@react-native-google-signin/google-signin';
const GOOGLE_CLIENT_ID_SUFFIX = '.apps.googleusercontent.com';
const GOOGLE_URL_SCHEME_PREFIX = 'com.googleusercontent.apps.';

function googleIosUrlScheme(iosClientId: string): string {
  return GOOGLE_URL_SCHEME_PREFIX + iosClientId.replace(GOOGLE_CLIENT_ID_SUFFIX, '');
}

// The Google plugin fails the native build without the iOS client id, so it is added only when release sets it.
export default function appConfig({ config }: ConfigContext): ExpoConfig {
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
  if (!iosClientId) return config as ExpoConfig;
  return {
    ...(config as ExpoConfig),
    plugins: [...(config.plugins ?? []), [GOOGLE_SIGN_IN_PLUGIN, { iosUrlScheme: googleIosUrlScheme(iosClientId) }]],
  };
}
