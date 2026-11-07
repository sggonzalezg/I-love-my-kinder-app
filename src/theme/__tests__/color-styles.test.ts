import { styleEachColor } from '../color-styles';
import { lightColors } from '../tokens';

describe('styleEachColor', () => {
  it('builds one style per color name', () => {
    const textStyles = styleEachColor(lightColors, (color) => ({ color }));
    expect(Object.keys(textStyles)).toEqual(Object.keys(lightColors));
  });

  it('gives each style the color of its name', () => {
    const backgroundStyles = styleEachColor(lightColors, (color) => ({ backgroundColor: color }));
    expect(backgroundStyles.blue50.backgroundColor).toBe(lightColors.blue50);
  });
});
