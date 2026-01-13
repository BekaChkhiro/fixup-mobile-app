import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useCategoryById, useServices } from '@/hooks';
import { ServiceList, ServiceFilters } from '@/components/services';
import { Layout } from '@/components/common';
import type { ServiceFilters as ServiceFiltersType } from '@/types';

export default function CategoryScreen() {
  const params = useLocalSearchParams();
  const categoryId = params.id ? Number(params.id) : undefined;
  const navigation = useNavigation();

  const [filters, setFilters] = useState<ServiceFiltersType>({});

  // Fetch category info
  const { data: category } = useCategoryById(categoryId);

  // Hide default header
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // Fetch services with category filter (only when category is loaded)
  const {
    data: services,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useServices(
    { ...filters, categoryId: category?.id },
    { enabled: !!category?.id }
  );

  const handleFiltersChange = (newFilters: ServiceFiltersType) => {
    setFilters(newFilters);
  };

  return (
    <Layout
      title={category?.name || 'სერვისები'}
      showBack
      showLogo={false}
      activeTab="services"
    >
      <ServiceList
        services={services}
        isLoading={isLoading || !category}
        isError={isError}
        error={error}
        onRefresh={refetch}
        isRefreshing={isRefetching}
        ListHeaderComponent={
          <View style={styles.filtersContainer}>
            <ServiceFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </View>
        }
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  filtersContainer: {
    marginHorizontal: -16,
    marginBottom: 8,
  },
});
