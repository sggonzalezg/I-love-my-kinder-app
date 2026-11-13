export const lightColors = {
  ground: '#F6F8FC',
  surface: '#FFFFFF',
  raised: '#EEF2FA',
  border: '#DCE3F0',
  ink: '#14213D',
  muted: '#5B6478',
  blue: '#1F47C4',
  bluePress: '#1A3BA3',
  blue50: '#EEF3FF',
  blue100: '#DCE6FF',
  blue200: '#BBCDFF',
  onBlue: '#FFFFFF',
  heart: '#EE0A0A',
  red: '#D90D12',
  red50: '#FDECEC',
  onRed: '#FFFFFF',
  ok: '#1A7046',
  ok50: '#E6F4EC',
  wait: '#9A5300',
  wait50: '#FFF3E0',
  scrim: 'rgba(13,20,38,0.56)',
  black: '#000000',
  white: '#FFFFFF',
};

export type ColorName = keyof typeof lightColors;
export type Colors = Record<ColorName, string>;

export const darkColors: Colors = {
  ground: '#0D1426',
  surface: '#161F36',
  raised: '#1E2944',
  border: '#2A3654',
  ink: '#E8ECF5',
  muted: '#9AA4BA',
  blue: '#8FB0FF',
  bluePress: '#A9C2FF',
  blue50: '#17234A',
  blue100: '#1B2A52',
  blue200: '#2A3F7A',
  onBlue: '#0D1426',
  heart: '#FF5A5A',
  red: '#FF6B6B',
  red50: '#3A1616',
  onRed: '#0D1426',
  ok: '#5FD49A',
  ok50: '#11301F',
  wait: '#F5B95C',
  wait50: '#33240C',
  scrim: 'rgba(0,0,0,0.64)',
  black: '#000000',
  white: '#FFFFFF',
};

export const space = { s1: 4, s2: 8, s3: 12, s4: 16, s5: 20, s6: 24, s8: 32, s10: 40, s12: 48 } as const;
export const screenMargin = 20;
export const iconStroke = { regular: 1.8, bold: 2 } as const;

export const radius = { sm: 8, md: 12, lg: 16, xl: 24, full: 999, sheet: 28 } as const;

export const size = {
  touch: 44,
  teacherChoice: 56,
  teacherAction: 60,
  timeButton: 64,
  button: 52,
  input: 56,
} as const;

// Font family names registered in the root layout with @expo-google-fonts.
export const fonts = {
  display900: 'Nunito_900Black',
  display800: 'Nunito_800ExtraBold',
  text400: 'DMSans_400Regular',
  text500: 'DMSans_500Medium',
  text600: 'DMSans_600SemiBold',
  text700: 'DMSans_700Bold',
} as const;

export const type = {
  display: { fontFamily: fonts.display900, fontSize: 32, lineHeight: 35, letterSpacing: -0.64 },
  title: { fontFamily: fonts.display800, fontSize: 24, lineHeight: 29, letterSpacing: -0.24 },
  section: { fontFamily: fonts.display800, fontSize: 18, lineHeight: 23 },
  childName: { fontFamily: fonts.display800, fontSize: 24, lineHeight: 28 },
  body: { fontFamily: fonts.text400, fontSize: 16, lineHeight: 24 },
  bodyStrong: { fontFamily: fonts.text600, fontSize: 16, lineHeight: 24 },
  button: { fontFamily: fonts.text700, fontSize: 16, lineHeight: 20 },
  small: { fontFamily: fonts.text400, fontSize: 14, lineHeight: 20 },
  smallStrong: { fontFamily: fonts.text600, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fonts.text500, fontSize: 13, lineHeight: 18 },
  label: { fontFamily: fonts.text600, fontSize: 15, lineHeight: 20 },
  tab: { fontFamily: fonts.text600, fontSize: 12, lineHeight: 14 },
} as const;

export const tabular = { fontVariant: ['tabular-nums' as const] };

export const shadow = {
  sheet: { shadowColor: '#0D1426', shadowOpacity: 0.18, shadowRadius: 16, shadowOffset: { width: 0, height: -8 }, elevation: 12 },
  toast: { shadowColor: '#0D1426', shadowOpacity: 0.2, shadowRadius: 16, shadowOffset: { width: 0, height: 12 }, elevation: 10 },
};
