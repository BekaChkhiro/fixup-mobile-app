import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import type { Coordinates } from '@/types';

interface UseLocationResult {
  location: Coordinates | null;
  isLoading: boolean;
  error: string | null;
  requestPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<Coordinates | null>;
}

export function useLocation(): UseLocationResult {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setError('მდებარეობის ნებართვა არ არის მოცემული');
        Alert.alert(
          'ნებართვა საჭიროა',
          'აპლიკაციას სჭირდება მდებარეობის ნებართვა ახლომდებარე სერვისების საჩვენებლად.',
          [{ text: 'კარგი' }]
        );
        return false;
      }

      return true;
    } catch (err) {
      setError('მდებარეობის ნებართვის მოთხოვნა ვერ მოხერხდა');
      return false;
    }
  };

  const getCurrentLocation = async (): Promise<Coordinates | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        setIsLoading(false);
        return null;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords: Coordinates = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      setLocation(coords);
      setIsLoading(false);
      return coords;
    } catch (err) {
      setError('მდებარეობის მიღება ვერ მოხერხდა');
      setIsLoading(false);
      return null;
    }
  };

  return {
    location,
    isLoading,
    error,
    requestPermission,
    getCurrentLocation,
  };
}

// Hook for watching location updates
export function useWatchLocation(enabled: boolean = false) {
  const [location, setLocation] = useState<Coordinates | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let subscription: Location.LocationSubscription | null = null;

    const startWatching = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 100, // Update every 100 meters
        },
        (newLocation) => {
          setLocation({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          });
        }
      );
    };

    startWatching();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [enabled]);

  return location;
}
