import React from 'react';
import type { MapItemType } from '@/types';

interface CustomMarkerProps {
  id: number;
  type: MapItemType;
  latitude: number;
  longitude: number;
  categorySlug?: string;
  isSelected?: boolean;
  onPress: () => void;
}

// Temporarily disabled - react-native-maps removed to fix crash
export function CustomMarker(_props: CustomMarkerProps) {
  return null;
}
