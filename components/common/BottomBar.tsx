import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/constants';

type TabName = 'services' | 'map' | 'fuel';

interface BottomBarProps {
  activeTab?: TabName;
}

export function BottomBar({ activeTab }: BottomBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Determine active tab from pathname if not provided
  const currentTab: TabName = activeTab || (
    pathname.includes('/map') ? 'map' :
    pathname.includes('/fuel') ? 'fuel' : 'services'
  );

  const tabs: { name: TabName; label: string; icon: string; iconActive: string; route: string }[] = [
    { name: 'services', label: 'სერვისები', icon: 'construct-outline', iconActive: 'construct', route: '/' },
    { name: 'map', label: 'რუკა', icon: 'map-outline', iconActive: 'map', route: '/map' },
    { name: 'fuel', label: 'საწვავი', icon: 'speedometer-outline', iconActive: 'speedometer', route: '/fuel' },
  ];

  return (
    <View style={styles.bottomBar}>
      {tabs.map((tab) => {
        const isActive = currentTab === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabButton}
            onPress={() => router.push(tab.route as any)}
          >
            <Ionicons
              name={(isActive ? tab.iconActive : tab.icon) as any}
              size={24}
              color={isActive ? colors.primary[500] : colors.gray[500]}
            />
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  tabLabel: {
    ...typography.caption,
    color: colors.gray[500],
    marginTop: 2,
  },
  tabLabelActive: {
    color: colors.primary[500],
  },
});
