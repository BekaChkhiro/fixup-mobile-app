import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { colors, spacing, typography } from '@/constants';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'large';
  style?: ViewStyle;
}

export function LoadingState({
  message,
  size = 'large',
  style,
}: LoadingStateProps) {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={colors.primary[500]} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

// Full screen loading overlay
export function LoadingOverlay({ message }: { message?: string }) {
  return (
    <View style={styles.overlay}>
      <View style={styles.overlayContent}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        {message && <Text style={styles.overlayMessage}>{message}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  message: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  overlayContent: {
    alignItems: 'center',
  },
  overlayMessage: {
    ...typography.body,
    color: colors.text.primary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
