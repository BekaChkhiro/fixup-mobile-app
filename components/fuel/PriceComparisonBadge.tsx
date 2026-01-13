import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/constants';

interface PriceComparisonBadgeProps {
  currentPrice: number;
  cheapestPrice: number;
}

export function PriceComparisonBadge({ currentPrice, cheapestPrice }: PriceComparisonBadgeProps) {
  const isCheapest = currentPrice === cheapestPrice;
  const difference = currentPrice - cheapestPrice;
  const percentDiff = ((difference / cheapestPrice) * 100).toFixed(1);

  if (isCheapest) {
    return (
      <View style={[styles.badge, styles.cheapestBadge]}>
        <Ionicons name="checkmark-circle" size={12} color={colors.success[600]} />
        <Text style={[styles.badgeText, styles.cheapestText]}>ყველაზე იაფი</Text>
      </View>
    );
  }

  return (
    <View style={[styles.badge, styles.expensiveBadge]}>
      <Ionicons name="arrow-up" size={12} color={colors.error[600]} />
      <Text style={[styles.badgeText, styles.expensiveText]}>
        +{difference.toFixed(2)} ₾ ({percentDiff}%)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    gap: 4,
  },
  cheapestBadge: {
    backgroundColor: colors.success[50],
  },
  expensiveBadge: {
    backgroundColor: colors.error[50],
  },
  badgeText: {
    ...typography.caption,
    fontWeight: '500',
  },
  cheapestText: {
    color: colors.success[600],
  },
  expensiveText: {
    color: colors.error[600],
  },
});
