import { StyleSheet } from 'react-native';

export const colors = {
  bg: '#0A0A0A',
  card: '#151515', // or #18181B
  card2: '#101010',
  yellow: '#FFD60A', // Main primary accent
  lightYellow: '#FDE68A',
  darkYellow: '#CA8A04',
  green: '#4ADE80',
  darkGreen: '#16A34A',
  red: '#EF4444',
  textMain: '#FFFFFF',
  textSec: '#A1A1AA',
  borderBase: '#27272A', // Subtle border for segments
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.borderBase,
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  miniCard: {
    backgroundColor: colors.card,
    borderColor: colors.borderBase,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    flex: 1,
  },
});
