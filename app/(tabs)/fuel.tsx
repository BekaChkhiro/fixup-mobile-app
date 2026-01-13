import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFuelImporters, useCheapestFuelPrices, useLayoutConfig } from '@/hooks';
import { FuelImporterList } from '@/components/fuel';
import { colors, spacing, typography } from '@/constants';

export default function FuelScreen() {
  useLayoutConfig({
    title: 'საწვავის ფასები',
    activeTab: 'fuel',
  });

  const {
    data: importers,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useFuelImporters();

  const { data: cheapestPrices } = useCheapestFuelPrices();

  return (
    <>
      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <Ionicons name="information-circle-outline" size={18} color={colors.primary[600]} />
        <Text style={styles.infoText}>
          ფასები განახლებულია მთავარი იმპორტერების მიხედვით
        </Text>
      </View>

      {/* Importer List */}
      <FuelImporterList
        importers={importers}
        cheapestPrices={cheapestPrices}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRefresh={refetch}
        isRefreshing={isRefetching}
      />
    </>
  );
}

const styles = StyleSheet.create({
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  infoText: {
    ...typography.bodySmall,
    color: colors.primary[700],
    flex: 1,
  },
});
