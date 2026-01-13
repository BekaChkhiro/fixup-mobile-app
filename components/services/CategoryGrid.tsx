import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { CategoryCard } from './CategoryCard';
import { SkeletonCard } from '@/components/ui';
import { EmptyState, ErrorState, LoadingState } from '@/components/common';
import { colors, spacing } from '@/constants';
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

  if (isLoading && !categories?.length) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.row}>
          <View style={styles.skeletonItem}><SkeletonCard /></View>
          <View style={styles.skeletonItem}><SkeletonCard /></View>
        </View>
        <View style={styles.row}>
          <View style={styles.skeletonItem}><SkeletonCard /></View>
          <View style={styles.skeletonItem}><SkeletonCard /></View>
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
      data={categories}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
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
        <View style={styles.item}>
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
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  item: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  loadingContainer: {
    padding: spacing.md,
  },
  skeletonItem: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
});
