import type { MapRegion } from '@/types';

// Georgia bounds
export const georgiaRegion: MapRegion = {
  latitude: 42.0,
  longitude: 43.5,
  latitudeDelta: 3.5,
  longitudeDelta: 3.5,
};

// Tbilisi center
export const tbilisiCenter: MapRegion = {
  latitude: 41.7151,
  longitude: 44.8271,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

// Default region (Tbilisi)
export const defaultRegion: MapRegion = tbilisiCenter;

// Map zoom levels
export const zoomLevels = {
  country: { latitudeDelta: 3.5, longitudeDelta: 3.5 },
  city: { latitudeDelta: 0.15, longitudeDelta: 0.15 },
  district: { latitudeDelta: 0.05, longitudeDelta: 0.05 },
  street: { latitudeDelta: 0.01, longitudeDelta: 0.01 },
} as const;

// OpenStreetMap tile URL
export const osmTileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
