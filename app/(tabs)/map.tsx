import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLayoutConfig } from '@/hooks';
import { colors, spacing, typography, borderRadius } from '@/constants';

export default function MapScreen() {
  useLayoutConfig({
    title: 'რუკა',
    activeTab: 'map',
  });

  const openGoogleMaps = () => {
    // Open Google Maps centered on Tbilisi
    Linking.openURL('https://www.google.com/maps/search/auto+service/@41.7151,44.8271,12z');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="map-outline" size={64} color={colors.primary[500]} />
        </View>

        <Text style={styles.title}>რუკა მალე დაემატება</Text>

        <Text style={styles.description}>
          რუკის ფუნქციონალი დროებით მიუწვდომელია.
          გამოიყენეთ Google Maps სერვისების მოსაძებნად.
        </Text>

        <TouchableOpacity style={styles.button} onPress={openGoogleMaps}>
          <Ionicons name="open-outline" size={20} color={colors.white} />
          <Text style={styles.buttonText}>Google Maps-ში გახსნა</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  content: {
    alignItems: 'center',
    maxWidth: 320,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h3,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  buttonText: {
    ...typography.button,
    color: colors.white,
  },
});
