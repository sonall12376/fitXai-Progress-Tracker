// Theme Tokens matching 0_style_guide.html

export const C = {
  bg: '#0A0A0A',
  card: '#161616',
  card2: '#101010',
  purple: '#F5C400',
  violet: '#FFD60A',
  pink: '#FFB300',
  blue: '#CA8A04',
  cyan: '#FDE68A',
  green: '#A3E635',
  amber: '#F59E0B',
  red: '#EF4444',
  text: '#FFFFFF',
  text2: '#B0AA9A',
  border: 'rgba(255,214,10,0.09)',
};

// Spacing scale (8pt grid)
export const S = {
  xs: 4,
  sm: 8,
  base: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

// Radius scale
export const R = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 9999,
};

// Shadow for main frame (similar to HTML)
export const cardShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.5,
  shadowRadius: 15,
  elevation: 5,
};

// We don't have CSS variables in React Native natively, so we use this C object.
