import { buildSchemeStyles } from '../themed-styles';
import { darkColors, lightColors } from '../tokens';

describe('buildSchemeStyles', () => {
  it('builds the light styles with the light colors', () => {
    const styles = buildSchemeStyles((colors) => ({ card: { backgroundColor: colors.surface } }));
    expect(styles.light.card.backgroundColor).toBe(lightColors.surface);
  });

  it('builds the dark styles with the dark colors', () => {
    const styles = buildSchemeStyles((colors) => ({ card: { backgroundColor: colors.surface } }));
    expect(styles.dark.card.backgroundColor).toBe(darkColors.surface);
  });
});
