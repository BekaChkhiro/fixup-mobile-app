import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { CategoryCard } from './CategoryCard';
import { SkeletonCard } from '@/components/ui';
import { EmptyState, ErrorState } from '@/components/common';
import { colors, spacing } from '@/constants';
import { getGridColumns } from '@/utils';
import type { ServiceCategory } from '@/types';

interface CategoryGridProps {
  categories: ServiceCategory[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function CategoryGrid({
  categories,
  isLoading,
  isError,
  error,
  onRefresh,
  isRefreshing = false,
}: CategoryGridProps) {
  const router = useRouter();
  // Use window dimensions to trigger re-render on orientation change
  const { width } = useWindowDimensions();
  const numColumns = getGridColumns();

  if (isLoading && !categories?.length) {
    const skeletonItems = Array.from({ length: numColumns * 2 }, (_, i) => i);
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.skeletonRow}>
          {skeletonItems.slice(0, numColumns).map((i) => (
            <View key={i} style={[styles.skeletonItem, { flex: 1 / numColumns }]}>
              <SkeletonCard />
            </View>
          ))}
        </View>
        <View style={styles.skeletonRow}>
          {skeletonItems.slice(numColumns, numColumns * 2).map((i) => (
            <View key={i} style={[styles.skeletonItem, { flex: 1 / numColumns }]}>
              <SkeletonCard />
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <ErrorState
        description={error?.message || 'კატეგორიების ჩატვირთვა ვერ მოხერხდა'}
        onRetry={onRefresh}
      />
    );
  }

  if (!categories?.length) {
    return (
      <EmptyState
        icon="folder-open-outline"
        title="კატეგორიები არ მოიძებნა"
      />
    );
  }

  const handleCategoryPress = (category: ServiceCategory) => {
    router.push(`/category/${category.id}`);
  };

  return (
    <FlatList
      key={`grid-${numColumns}`} // Force re-render when columns change
      data={categories}
      keyExtractor={(item) => item.id.toString()}
      numColumns={numColumns}
      columnWrapperStyle={styles.row}
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
        <View style={[styles.item, { flex: 1 / numColumns }]}>
          <CategoryCard
            category={item}
            onPress={() => handleCategoryPress(item)}
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.md,
  },
  row: {
    justifyContent: 'flex-start',
    marginBottom: spacing.md,
  },
  item: {
    paddingHorizontal: spacing.xs,
  },
  loadingContainer: {
    padding: spacing.md,
  },
  skeletonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: spacing.md,
  },
  skeletonItem: {
    paddingHorizontal: spacing.xs,
  },
});
