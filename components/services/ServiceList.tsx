import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ServiceCard } from './ServiceCard';
import { SkeletonCard } from '@/components/ui';
import { EmptyState, ErrorState } from '@/components/common';
import { colors, spacing } from '@/constants';
import type { MechanicService } from '@/types';

interface ServiceListProps {
  services: MechanicService[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  ListHeaderComponent?: React.ReactElement;
}

export function ServiceList({
  services,
  isLoading,
  isError,
  error,
  onRefresh,
  isRefreshing = false,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
  ListHeaderComponent,
}: ServiceListProps) {
  const router = useRouter();

  if (isLoading && !services?.length) {
    return (
      <View style={styles.loadingContainer}>
        {ListHeaderComponent}
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={styles.skeletonItem}>
            <SkeletonCard />
          </View>
        ))}
      </View>
    );
  }

  if (isError) {
    return (
      <ErrorState
        description={error?.message || 'სერვისების ჩატვირთვა ვერ მოხერხდა'}
        onRetry={onRefresh}
      />
    );
  }

  if (!services?.length) {
    return (
      <View style={styles.emptyContainer}>
        {ListHeaderComponent}
        <EmptyState
          icon="construct-outline"
          title="სერვისები არ მოიძებნა"
          description="სცადეთ სხვა ფილტრები ან მოძებნეთ სხვა კატეგორიაში"
        />
      </View>
    );
  }

  const handleServicePress = (service: MechanicService) => {
    router.push(`/service/${service.id}`);
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.primary[500]} />
      </View>
    );
  };

  return (
    <FlatList
      data={services}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={renderFooter}
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
      onEndReached={() => {
        if (hasMore && onLoadMore) {
          onLoadMore();
        }
      }}
      onEndReachedThreshold={0.5}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <ServiceCard
            service={item}
            onPress={() => handleServicePress(item)}
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
  item: {
    marginBottom: spacing.md,
  },
  loadingContainer: {
    padding: spacing.md,
  },
  skeletonItem: {
    marginBottom: spacing.md,
  },
  emptyContainer: {
    flex: 1,
  },
  footer: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
});
