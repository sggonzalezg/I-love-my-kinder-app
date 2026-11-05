import { Stack } from 'expo-router';

// Screens pushed here sit outside (tabs), so the tab bar leaves with the push (design.md section 4, round 8).
export default function AppLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
