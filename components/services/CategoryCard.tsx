import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/constants';
import type { ServiceCategory } from '@/types';

interface CategoryCardProps {
  category: ServiceCategory;
  onPress: () => void;
}

// Map category slugs to icons
const categoryIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  oil_engine: 'cog',
  tire: 'ellipse-outline',
  brake: 'stop-circle-outline',
  repair: 'build',
  gas: 'flame',
  electrical: 'flash',
  body: 'car-sport',
  ac: 'snow',
  mobile: 'location',
  default: 'construct',
};

// Map category slugs to colors
const categoryColors: Record<string, string> = {
  oil_engine: colors.success[500],
  tire: colors.primary[800],
  brake: colors.error[500],
  repair: colors.primary[500],
  gas: colors.warning[500],
  electrical: colors.secondary[500],
  body: '#ec4899',
  ac: '#06b6d4',
  mobile: '#14b8a6',
  default: colors.gray[500],
};

export function CategoryCard({ category, onPress }: CategoryCardProps) {
  const iconName = categoryIcons[category.slug] || categoryIcons.default;
  const iconColor = categoryColors[category.slug] || categoryColors.default;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
        <Ionicons name={iconName} size={28} color={iconColor} />
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 120,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  name: {
    ...typography.bodySmall,
    fontWeight: '500',
    color: colors.text.primary,
    textAlign: 'center',
  },
});
