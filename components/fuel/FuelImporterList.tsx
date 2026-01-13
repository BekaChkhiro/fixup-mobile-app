import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { FuelPriceCard } from './FuelPriceCard';
import { SkeletonCard } from '@/components/ui';
import { EmptyState, ErrorState } from '@/components/common';
import { colors, spacing } from '@/constants';
import type { FuelImporter } from '@/types';

interface CheapestPrices {
  regular: number;
  premium: number;
  super: number;
  diesel: number;
}

interface FuelImporterListProps {
  importers: FuelImporter[] | undefined;
  cheapestPrices?: CheapestPrices | null;
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function FuelImporterList({
  importers,
  cheapestPrices,
  isLoading,
  isError,
  error,
  onRefresh,
  isRefreshing = false,
}: FuelImporterListProps) {
  if (isLoading && !importers?.length) {
    return (
      <View style={styles.loadingContainer}>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.stateContainer}>
        <ErrorState
          description={error?.message || 'საწვავის ფასების ჩატვირთვა ვერ მოხერხდა'}
          onRetry={onRefresh}
        />
      </View>
    );
  }

  if (!importers?.length) {
    return (
      <View style={styles.stateContainer}>
        <EmptyState
          icon="water-outline"
          title="საწვავის ფასები არ მოიძებნა"
        />
      </View>
    );
  }

  return (
    <FlatList
      data={importers}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[colors.primary[500]]}
            tintColor={colors.primary[500]}
          />
        ) : undefined
      }
      renderItem={({ item }) => (
        <FuelPriceCard importer={item} cheapestPrices={cheapestPrices} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.md,
  },
  stateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
