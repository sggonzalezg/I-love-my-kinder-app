import { router } from 'expo-router';
import { ChevronRight, Clock } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Chip } from '@/components/chip';
import { Text } from '@/components/text';
import { childAuthorizationsHref } from '@/constants/routes';
import { fetchChildAuthorizationStates } from '@/data/child-authorizations';
import { fetchFamilyChildren } from '@/data/family-room';
import { useAsync } from '@/data/use-async';
import { useReloadOnRefocus } from '@/data/use-reload-on-refocus';
import { unansweredCountOf } from '@/lib/authorization-reminders';
import { unansweredChipLabel } from '@/lib/child-authorization-status';
import { initials } from '@/lib/format';
import { useColors } from '@/theme/use-theme';

import { CHEVRON_SIZE, useChildAuthorizationLinksStyles } from './child-authorization-links.styles';

const CHILD_AUTHORIZATION_LINKS_COPY = {
  title: 'Autorizaciones por niño',
  rowLabel: (firstName: string) => `Autorizaciones de ${firstName}`,
  summary: 'Redes y salud',
} as const;

async function fetchChildrenWithAuthorizations(userId: string) {
  const [children, authorizationStates] = await Promise.all([fetchFamilyChildren(userId), fetchChildAuthorizationStates()]);
  return { children, authorizationStates };
}

export function ChildAuthorizationLinks({ userId }: { userId: string }) {
  const colors = useColors();
  const styles = useChildAuthorizationLinksStyles();
  const load = useAsync(() => fetchChildrenWithAuthorizations(userId), userId, { keepDataOnReload: true });
  useReloadOnRefocus(load.reload);

  if (!load.data?.children.length) return null;
  const { children, authorizationStates } = load.data;

  return (
    <View style={styles.section}>
      <Text variant="section" color="muted">
        {CHILD_AUTHORIZATION_LINKS_COPY.title}
      </Text>
      <View style={styles.list}>
        {children.map((child, index) => {
          const unansweredCount = unansweredCountOf(authorizationStates, child.id);
          return (
            <Pressable
              key={child.id}
              accessibilityRole="button"
              accessibilityLabel={CHILD_AUTHORIZATION_LINKS_COPY.rowLabel(child.firstName)}
              onPress={() => router.push(childAuthorizationsHref(child.id, child.firstName))}
              style={({ pressed }) => [styles.row, index > 0 && styles.rowDivider, pressed && styles.rowPressed]}>
              <Avatar photoPath={child.photoPath} initials={initials(child.firstName)} />
              <View style={styles.rowText}>
                <Text variant="bodyStrong">{child.firstName}</Text>
                {unansweredCount > 0 ? (
                  <View style={styles.chip}>
                    <Chip variant="wait" icon={Clock} label={unansweredChipLabel(unansweredCount)} />
                  </View>
                ) : (
                  <Text variant="small" color="muted">
                    {CHILD_AUTHORIZATION_LINKS_COPY.summary}
                  </Text>
                )}
              </View>
              <ChevronRight size={CHEVRON_SIZE} color={colors.muted} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
