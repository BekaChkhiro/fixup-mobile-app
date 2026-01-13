import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, typography } from '@/constants';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  default: {
    bg: colors.gray[100],
    text: colors.gray[700],
  },
  primary: {
    bg: colors.primary[100],
    text: colors.primary[700],
  },
  success: {
    bg: colors.success[100],
    text: colors.success[700],
  },
  warning: {
    bg: colors.warning[100],
    text: colors.warning[700],
  },
  error: {
    bg: colors.error[100],
    text: colors.error[700],
  },
  info: {
    bg: colors.secondary[100],
    text: colors.secondary[700],
  },
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  style,
}: BadgeProps) {
  const variantStyle = variantStyles[variant];
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: variantStyle.bg },
        isSmall && styles.containerSmall,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: variantStyle.text },
          isSmall && styles.textSmall,
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  containerSmall: {
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
  },
  text: {
    ...typography.caption,
    fontWeight: '500',
  },
  textSmall: {
    fontSize: 10,
  },
});
