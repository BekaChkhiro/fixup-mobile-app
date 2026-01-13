import React from 'react';
import { useCategories, useLayoutConfig } from '@/hooks';
import { CategoryGrid } from '@/components/services';

export default function ServicesScreen() {
  useLayoutConfig({
    title: 'სერვისები',
    activeTab: 'services',
  });

  const {
    data: categories,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useCategories();

  return (
    <CategoryGrid
      categories={categories}
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRefresh={refetch}
      isRefreshing={isRefetching}
    />
  );
}
