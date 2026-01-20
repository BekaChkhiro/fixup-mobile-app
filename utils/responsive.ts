import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

/**
 * Check if the current device is a tablet
 * Based on the shorter dimension being >= 600dp (typical tablet threshold)
 */
export function isTablet(): boolean {
  const shortDimension = Math.min(width, height);
  return shortDimension >= 600;
}

/**
 * Get a responsive value based on device type
 * Returns tablet value for tablets, phone value for phones
 */
export function getResponsiveValue<T>(phone: T, tablet: T): T {
  return isTablet() ? tablet : phone;
}

/**
 * Get the bottom offset for floating cards/buttons
 * Accounts for tab bar height differences on tablets
 */
export function getBottomOffset(): number {
  return isTablet() ? 140 : 120;
}

/**
 * Get the image height for detail screens
 * Larger on tablets for better visual presentation
 */
export function getImageHeight(): number {
  return isTablet() ? 350 : 250;
}

/**
 * Get the number of columns for grid layouts
 * Based on screen width:
 * - >= 1024px: 4 columns (large iPad landscape)
 * - >= 768px: 3 columns (iPad portrait / small landscape)
 * - < 768px: 2 columns (phones)
 */
export function getGridColumns(): number {
  const currentWidth = Dimensions.get('window').width;
  if (currentWidth >= 1024) return 4;
  if (currentWidth >= 768) return 3;
  return 2;
}

/**
 * Get edge padding for map fit operations
 * Larger on tablets to account for bigger screens
 */
export function getMapEdgePadding(): {
  top: number;
  right: number;
  bottom: number;
  left: number;
} {
  if (isTablet()) {
    return { top: 120, right: 80, bottom: 240, left: 80 };
  }
  return { top: 100, right: 50, bottom: 200, left: 50 };
}

/**
 * Get card/item width for list items
 * Useful for horizontal lists or grids
 */
export function getCardWidth(columns: number = 2, padding: number = 16): number {
  const screenWidth = Dimensions.get('window').width;
  const totalPadding = padding * (columns + 1);
  return (screenWidth - totalPadding) / columns;
}

/**
 * Scale a value based on screen width
 * Useful for responsive font sizes or dimensions
 */
export function scaleSize(size: number, baseWidth: number = 375): number {
  const currentWidth = Dimensions.get('window').width;
  const scale = currentWidth / baseWidth;
  // Clamp scale between 1 and 1.5 to prevent extreme scaling
  const clampedScale = Math.min(Math.max(scale, 1), 1.5);
  return Math.round(size * clampedScale);
}
