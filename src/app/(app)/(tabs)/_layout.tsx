import { Tabs } from 'expo-router/tabs';

import { TabBar } from '@/components/tab-bar';

// Hoy · Sala · Galería · Calendario · Perfil for every role; what each tab shows depends on the role (step 2+).
export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false, animation: 'none' }}>
      <Tabs.Screen name="index" options={{ title: 'Hoy' }} />
      <Tabs.Screen name="room" options={{ title: 'Sala' }} />
      <Tabs.Screen name="gallery" options={{ title: 'Galería' }} />
      <Tabs.Screen name="calendar" options={{ title: 'Calendario' }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
