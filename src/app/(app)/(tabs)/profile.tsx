import { router } from 'expo-router';
import { LogOut, Monitor, Trash2 } from 'lucide-react-native';
import { Linking, StyleSheet, View } from 'react-native';
import { NURSERY_WHATSAPP_URL } from '@/constants/nursery';
import { supabase } from '@/data/supabase';
import { useSession } from '@/data/session';
import { Button } from '@/components/button';
import { Chip } from '@/components/chip';
import { Screen } from '@/components/screen';
import { Text } from '@/components/text';
import { space, radius, screenMargin } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

export default function ProfileTab() {
  const { session } = useSession();
  const c = useColors();

  if (!session) return null;

  const isTeacher = session.active_role === 'teacher';
  const isDirector = session.active_role === 'director';
  const isFamily = session.active_role === 'family';

  const roleLabel = isDirector ? 'Dirección' : isTeacher ? 'Maestra' : 'Familia';

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  function handleOpenDocument(docKey: string) {
    router.push(`../legal/${docKey}`);
  }

  return (
    <Screen scroll>
      {/* Profile header */}
      <View style={[styles.profileCard, { backgroundColor: c.surface }]}>
        <View style={styles.profileRow}>
          <View style={styles.profileContent}>
            <Text variant="title" style={{ color: c.ink }}>
              {session.person_name}
            </Text>
            <Text style={{ color: c.muted, marginTop: space.s1 }}>
              {session.phone}
            </Text>
          </View>
          <Chip label={roleLabel} />
        </View>
      </View>

      {/* My data section */}
      <SectionHeader title="Mis datos" />
      <View style={[styles.section, { backgroundColor: c.surface }]}>
        <Row label="Nombre" value={session.person_name} />
        <Row label="Teléfono" value={session.phone} />
        <Row label="Jardín" value={session.nursery_name} />
      </View>

      {/* Role-specific rows */}
      {isTeacher && (
        <>
          <SectionHeader title="Mi cuenta" />
          <View style={[styles.section, { backgroundColor: c.surface }]}>
            <Row label="Mi rol" value="Maestra" />
            <Row label="Mis salas" value="Cargando…" note="Para cambiar tus salas, hablá con la dirección" />
            <Row label="Sociedad médica" value="Cargando…" />
            <Row label="Horario de trabajo" value="Cargando…" note="Lo carga la dirección" />
          </View>
        </>
      )}

      {isDirector && (
        <>
          <SectionHeader title="Dirección" />
          <View style={[styles.panelCard, { backgroundColor: c.blue50 }]}>
            <Monitor size={24} color={c.blue} strokeWidth={1.8} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: c.blue }}>Panel de dirección</Text>
              <Text variant="small" style={{ color: c.blue }}>
                Entrá desde tu computadora
              </Text>
              <Text variant="small" style={{ color: c.muted }}>
                panel.ilovemykinder.uy
              </Text>
            </View>
            <Button
              title="Copiar enlace"
              variant="soft"
              onPress={() => {
                // TODO: copy to clipboard
              }}
              style={styles.copyButton}
            />
          </View>
        </>
      )}

      {/* Legal documents */}
      <SectionHeader title="Documentos legales" />
      <View style={[styles.section, { backgroundColor: c.surface }]}>
        <LinkRow
          label="Términos y condiciones"
          onPress={() => handleOpenDocument('terms')}
        />
        <LinkRow
          label="Política de privacidad"
          onPress={() => handleOpenDocument('privacy')}
        />
        <LinkRow
          label="Cookies"
          onPress={() => handleOpenDocument('cookies')}
        />
      </View>

      {/* Help */}
      <SectionHeader title="Ayuda" />
      <View style={[styles.section, { backgroundColor: c.surface }]}>
        <LinkRow
          label="Escribirle al jardín por WhatsApp"
          onPress={() => Linking.openURL(NURSERY_WHATSAPP_URL)}
        />
      </View>

      {/* Sign out */}
      <Button
        label="Cerrar sesión"
        icon={LogOut}
        variant="plain"
        block
        onPress={handleSignOut}
      />

      {/* Delete account */}
      <SectionHeader title="Privacidad" />
      <Button
        label="Eliminar mi cuenta"
        icon={Trash2}
        variant="danger-soft"
        block
        onPress={() => router.push('../delete-account')}
      />
      <Text variant="small" style={{ color: c.red, textAlign: 'center' }}>
        No se puede deshacer. Se conservan los mensajes del chat.
      </Text>
    </Screen>
  );
}

function SectionHeader({ title }: { title: string }) {
  const c = useColors();
  return (
    <Text variant="section" style={{ color: c.muted, marginTop: space.s2 }}>
      {title}
    </Text>
  );
}

function Row({ label, value, note }: { label: string; value: string; note?: string }) {
  const c = useColors();
  return (
    <View style={styles.row}>
      <Text style={{ color: c.muted, flex: 1 }}>
        {label}
      </Text>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ color: c.ink }}>
          {value}
        </Text>
        {note && (
          <Text variant="small" style={{ color: c.muted }}>
            {note}
          </Text>
        )}
      </View>
    </View>
  );
}

function LinkRow({ label, onPress }: { label: string; onPress: () => void }) {
  const c = useColors();
  return (
    <Button
      label={label}
      variant="plain"
      onPress={onPress}
      style={{ alignSelf: 'flex-start' }}
    />
  );
}

const styles = StyleSheet.create({
  profileCard: {
    padding: space.s4,
    borderRadius: radius.lg,
    marginBottom: space.s4,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.s2,
  },
  profileContent: {
    flex: 1,
  },
  section: {
    borderRadius: radius.lg,
    padding: space.s4,
    gap: space.s3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: space.s2,
  },
  panelCard: {
    flexDirection: 'row',
    borderRadius: radius.lg,
    padding: space.s4,
    gap: space.s3,
    alignItems: 'center',
  },
  copyButton: {
    paddingHorizontal: space.s3,
    minHeight: 40,
  },
});

