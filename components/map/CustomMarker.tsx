import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { colors, categoryMarkerColors, laundryMarkerColor, driveMarkerColor } from '@/constants';
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

function getMarkerColor(type: MapItemType, categorySlug?: string): string {
  if (type === 'laundry') return laundryMarkerColor;
  if (type === 'drive') return driveMarkerColor;

  if (categorySlug && categoryMarkerColors[categorySlug]) {
    return categoryMarkerColors[categorySlug];
  }

  return categoryMarkerColors.default;
}

function getMarkerIcon(type: MapItemType): keyof typeof Ionicons.glyphMap {
  switch (type) {
    case 'service':
      return 'construct';
    case 'laundry':
      return 'water';
    case 'drive':
      return 'car';
    default:
      return 'location';
  }
}

export function CustomMarker({
  id,
  type,
  latitude,
  longitude,
  categorySlug,
  isSelected = false,
  onPress,
}: CustomMarkerProps) {
  const markerColor = getMarkerColor(type, categorySlug);
  const iconName = getMarkerIcon(type);

  return (
    <Marker
      identifier={`${type}-${id}`}
      coordinate={{ latitude, longitude }}
      onPress={onPress}
      tracksViewChanges={false}
    >
      <View style={[styles.container, isSelected && styles.containerSelected]}>
        <View
          style={[
            styles.marker,
            { backgroundColor: markerColor },
            isSelected && styles.markerSelected,
          ]}
        >
          <Ionicons name={iconName} size={16} color={colors.white} />
        </View>
        <View style={[styles.arrow, { borderTopColor: markerColor }]} />
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  containerSelected: {
    transform: [{ scale: 1.2 }],
  },
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  markerSelected: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -2,
  },
});
