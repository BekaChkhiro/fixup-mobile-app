import * as Linking from 'expo-linking';
import { Platform, Alert } from 'react-native';

interface OpenMapsParams {
  latitude: number;
  longitude: number;
  label?: string;
}

export async function openInMaps({ latitude, longitude, label = '' }: OpenMapsParams): Promise<void> {
  const encodedLabel = encodeURIComponent(label);

  // Try Google Maps first on Android, Apple Maps on iOS
  const googleMapsUrl = Platform.select({
    ios: `comgooglemaps://?q=${encodedLabel}&center=${latitude},${longitude}`,
    android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodedLabel})`,
  });

  const appleMapsUrl = `maps:?q=${encodedLabel}&ll=${latitude},${longitude}`;

  // Web fallback
  const webMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  try {
    if (Platform.OS === 'ios') {
      // Try Apple Maps first on iOS
      const canOpenApple = await Linking.canOpenURL(appleMapsUrl);
      if (canOpenApple) {
        await Linking.openURL(appleMapsUrl);
        return;
      }
    }

    // Try Google Maps
    if (googleMapsUrl) {
      const canOpenGoogle = await Linking.canOpenURL(googleMapsUrl);
      if (canOpenGoogle) {
        await Linking.openURL(googleMapsUrl);
        return;
      }
    }

    // Fallback to web
    await Linking.openURL(webMapsUrl);
  } catch (error) {
    Alert.alert(
      'შეცდომა',
      'რუკის გახსნა ვერ მოხერხდა',
      [{ text: 'კარგი' }]
    );
  }
}

export function formatAddress(
  city?: string | null,
  district?: string | null,
  address?: string | null
): string {
  const parts = [address, district, city].filter(Boolean);
  return parts.join(', ');
}
