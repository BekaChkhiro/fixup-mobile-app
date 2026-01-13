import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, typography } from '@/constants';
import type { MapItemType } from '@/types';

interface Tab {
  key: MapItemType;
  label: string;
}

const tabs: Tab[] = [
  { key: 'service', label: 'სერვისები' },
  { key: 'laundry', label: 'სამრეცხაოები' },
  { key: 'drive', label: 'დრაივები' },
];

interface MapSegmentedTabsProps {
  activeTab: MapItemType;
  onTabChange: (tab: MapItemType) => void;
}

export function MapSegmentedTabs({ activeTab, onTabChange }: MapSegmentedTabsProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, activeTab === tab.key && styles.tabActive]}
          onPress={() => onTabChange(tab.key)}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.lg,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  tabTextActive: {
    color: colors.text.primary,
    fontWeight: '600',
  },
});
