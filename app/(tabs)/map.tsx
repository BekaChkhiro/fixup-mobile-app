import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform,
  Linking,
  Modal,
  ScrollView,
} from 'react-native';
import MapView, { Marker, Region, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useQuery } from '@tanstack/react-query';
import { colors, spacing, borderRadius, typography } from '@/constants';
import { defaultRegion, zoomLevels } from '@/constants/mapConfig';
import { useServicesForMap, useLaundriesForMap, useDrivesForMap, useLocation, useLayoutConfig } from '@/hooks';
import { supabase } from '@/services/supabase';
import type { MapItemType } from '@/types';

// Filter state type
interface MapFiltersState {
  categoryIds: number[];
  city?: string;
}

const { width, height } = Dimensions.get('window');
const MAP_HEIGHT = height * 0.55;

// Tab button component
function TabButton({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.tab, isActive && styles.tabActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

// Map marker colors
const markerColors: Record<MapItemType, string> = {
  service: colors.primary[500],
  laundry: colors.secondary[500],
  drive: colors.success[500],
};

// Map marker icons
const markerIcons: Record<MapItemType, keyof typeof Ionicons.glyphMap> = {
  service: 'construct',
  laundry: 'water',
  drive: 'car',
};

// Inline hook for cities (based on active tab)
function useCitiesForMap(type: MapItemType) {
  return useQuery({
    queryKey: ['map-cities', type],
    queryFn: async () => {
      const table = type === 'service' ? 'mechanic_services' : type === 'laundry' ? 'laundries' : 'drives';
      const { data, error } = await supabase
        .from(table)
        .select('city')
        .not('city', 'is', null);

      if (error) throw error;

      const uniqueCities = [...new Set(data?.map((d: any) => d.city).filter(Boolean))] as string[];
      return uniqueCities.sort();
    },
  });
}

// Inline hook for districts
function useDistrictsForMap(type: MapItemType, city?: string) {
  return useQuery({
    queryKey: ['map-districts', type, city],
    queryFn: async () => {
      const table = type === 'service' ? 'mechanic_services' : type === 'laundry' ? 'laundries' : 'drives';
      let query = supabase
        .from(table)
        .select('district')
        .not('district', 'is', null);

      if (city) {
        query = query.eq('city', city);
      }

      const { data, error } = await query;

      if (error) throw error;

      const uniqueDistricts = [...new Set(data?.map((d: any) => d.district).filter(Boolean))] as string[];
      return uniqueDistricts.sort();
    },
    enabled: !!city,
  });
}

// Inline hook for service categories
function useCategoriesForMap() {
  return useQuery({
    queryKey: ['map-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_categories')
        .select('id, name')
        .order('name');

      if (error) throw error;
      return data || [];
    },
  });
}

// Category type for filter
interface CategoryOption {
  id: number;
  name: string;
}

// Single-select City Modal component
function CityFilterModal({
  visible,
  items,
  selectedValue,
  onSelect,
  onClose,
}: {
  visible: boolean;
  items: string[];
  selectedValue?: string;
  onSelect: (value: string | undefined) => void;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={filterStyles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} style={filterStyles.modalContent}>
          <View style={filterStyles.modalHeader}>
            <Text style={filterStyles.modalTitle}>აირჩიეთ ქალაქი</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={filterStyles.modalList}>
            <TouchableOpacity
              style={[filterStyles.modalItem, !selectedValue && filterStyles.modalItemSelected]}
              onPress={() => onSelect(undefined)}
            >
              <Text style={[filterStyles.modalItemText, !selectedValue && filterStyles.modalItemTextSelected]}>
                ყველა ქალაქი
              </Text>
              {!selectedValue && (
                <Ionicons name="checkmark" size={20} color={colors.primary[500]} />
              )}
            </TouchableOpacity>

            {items.map((item) => {
              const isSelected = selectedValue === item;
              return (
                <TouchableOpacity
                  key={item}
                  style={[filterStyles.modalItem, isSelected && filterStyles.modalItemSelected]}
                  onPress={() => onSelect(item)}
                >
                  <Text
                    style={[
                      filterStyles.modalItemText,
                      isSelected && filterStyles.modalItemTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark" size={20} color={colors.primary[500]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

// Multi-select Category Filter Modal component
function CategoryFilterModal({
  visible,
  categories,
  selectedIds,
  onToggle,
  onClear,
  onClose,
}: {
  visible: boolean;
  categories: CategoryOption[];
  selectedIds: number[];
  onToggle: (id: number) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={filterStyles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} style={filterStyles.modalContent}>
          <View style={filterStyles.modalHeader}>
            <Text style={filterStyles.modalTitle}>აირჩიეთ კატეგორია</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={filterStyles.modalList}>
            {categories.map((category) => {
              const isSelected = selectedIds.includes(category.id);
              return (
                <TouchableOpacity
                  key={category.id}
                  style={[filterStyles.modalItem, isSelected && filterStyles.modalItemSelected]}
                  onPress={() => onToggle(category.id)}
                >
                  <Text
                    style={[
                      filterStyles.modalItemText,
                      isSelected && filterStyles.modalItemTextSelected,
                    ]}
                  >
                    {category.name}
                  </Text>
                  <View style={[filterStyles.checkbox, isSelected && filterStyles.checkboxSelected]}>
                    {isSelected && <Ionicons name="checkmark" size={14} color={colors.white} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Bottom Buttons */}
          <View style={filterStyles.modalFooter}>
            <TouchableOpacity
              style={[filterStyles.footerButton, filterStyles.footerButtonOutline]}
              onPress={onClear}
            >
              <Text style={filterStyles.footerButtonTextOutline}>გასუფთავება</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[filterStyles.footerButton, filterStyles.footerButtonPrimary]}
              onPress={onClose}
            >
              <Text style={filterStyles.footerButtonText}>გაფილტვრა</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

// Filter styles (defined separately to avoid issues)
const filterStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
    gap: spacing.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    gap: 6,
  },
  filterButtonActive: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  filterButtonDisabled: {
    opacity: 0.5,
  },
  filterText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  filterTextActive: {
    color: colors.primary[500],
    fontWeight: '500',
  },
  filterTextDisabled: {
    color: colors.gray[400],
  },
  clearButton: {
    padding: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...typography.h4,
    color: colors.text.primary,
  },
  modalList: {
    paddingVertical: spacing.sm,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  modalItemSelected: {
    backgroundColor: colors.primary[50],
  },
  modalItemText: {
    ...typography.body,
    color: colors.text.primary,
  },
  modalItemTextSelected: {
    color: colors.primary[500],
    fontWeight: '500',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerButtonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.gray[300],
  },
  footerButtonPrimary: {
    backgroundColor: colors.primary[500],
  },
  footerButtonText: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.white,
  },
  footerButtonTextOutline: {
    ...typography.bodySmall,
    fontWeight: '500',
    color: colors.text.secondary,
  },
});

// Polyline დეკოდერი (Google's encoded polyline algorithm)
function decodePolyline(encoded: string): Array<{ latitude: number; longitude: number }> {
  const points: Array<{ latitude: number; longitude: number }> = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte: number;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push({
      latitude: lat / 1e5,
      longitude: lng / 1e5,
    });
  }

  return points;
}

// კილომეტრების გამოთვლა (Haversine formula)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function MapScreen() {
  useLayoutConfig({
    title: 'რუკა',
    activeTab: 'map',
  });

  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const [activeTab, setActiveTab] = useState<MapItemType>('service');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [mapRegion, setMapRegion] = useState<Region>(defaultRegion);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<Array<{ latitude: number; longitude: number }>>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [drivingDistance, setDrivingDistance] = useState<number | null>(null);
  const [isLoadingDistance, setIsLoadingDistance] = useState(false);
  const [filters, setFilters] = useState<MapFiltersState>({ categoryIds: [], city: undefined });
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [showMapChoiceModal, setShowMapChoiceModal] = useState(false);
  const [pendingCityZoom, setPendingCityZoom] = useState<string | null>(null);

  const { getCurrentLocation, isLoading: isLocationLoading } = useLocation();

  // Filter data queries
  const { data: categories } = useCategoriesForMap();
  const { data: cities } = useCitiesForMap(activeTab);

  // მომხმარებლის ლოკაციის მიღება აპის გახსნისას
  React.useEffect(() => {
    getCurrentLocation().then((coords) => {
      if (coords) {
        setUserLocation(coords);
      }
    });
  }, []);

  // Map data queries with filters
  const servicesQuery = useServicesForMap({
    categoryIds: filters.categoryIds.length > 0 ? filters.categoryIds : undefined,
    city: filters.city
  });
  const laundriesQuery = useLaundriesForMap({
    city: filters.city
  });
  const drivesQuery = useDrivesForMap({
    city: filters.city
  });

  // Get current query based on active tab
  const currentQuery = useMemo(() => {
    switch (activeTab) {
      case 'service':
        return servicesQuery;
      case 'laundry':
        return laundriesQuery;
      case 'drive':
        return drivesQuery;
    }
  }, [activeTab, servicesQuery, laundriesQuery, drivesQuery]);

  const isLoading = currentQuery.isLoading;
  const isError = currentQuery.isError;
  const error = currentQuery.error;
  const items = currentQuery.data || [];

  // Filter items with valid coordinates
  const markersData = useMemo(() => {
    return items.filter(
      (item: any) =>
        item.latitude !== null &&
        item.longitude !== null &&
        typeof item.latitude === 'number' &&
        typeof item.longitude === 'number'
    );
  }, [items]);

  // Center map on city markers when city is selected
  React.useEffect(() => {
    if (pendingCityZoom && markersData.length > 0 && mapRef.current && !isLoading) {
      const coordinates = markersData.map((item: any) => ({
        latitude: item.latitude,
        longitude: item.longitude,
      }));

      if (coordinates.length === 1) {
        // Single marker - animate to it
        mapRef.current.animateToRegion(
          {
            latitude: coordinates[0].latitude,
            longitude: coordinates[0].longitude,
            ...zoomLevels.district,
          },
          500
        );
      } else if (coordinates.length > 1) {
        // Multiple markers - fit to show all
        mapRef.current.fitToCoordinates(coordinates, {
          edgePadding: { top: 100, right: 50, bottom: 200, left: 50 },
          animated: true,
        });
      }
      setPendingCityZoom(null);
    }
  }, [pendingCityZoom, markersData, isLoading]);

  // Handle marker press
  const handleMarkerPress = useCallback(
    (id: number) => {
      setSelectedId(id);
      setRouteCoordinates([]); // Clear route when selecting new marker
      setDrivingDistance(null); // Clear previous distance
      const item = markersData.find((m: any) => m.id === id);
      if (item && mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: item.latitude,
            longitude: item.longitude,
            ...zoomLevels.district,
          },
          300
        );
        // Fetch driving distance if user location is available
        if (userLocation) {
          fetchDrivingDistance(userLocation, {
            latitude: item.latitude,
            longitude: item.longitude,
          });
        }
      }
    },
    [markersData, userLocation, fetchDrivingDistance]
  );

  // Handle item press (navigate to detail)
  const handleItemPress = useCallback(
    (id: number) => {
      const route =
        activeTab === 'service'
          ? `/service/${id}`
          : activeTab === 'laundry'
          ? `/laundry/${id}`
          : `/drive/${id}`;
      router.push(route as any);
    },
    [activeTab, router]
  );

  // Handle my location button
  const handleMyLocation = useCallback(async () => {
    const coords = await getCurrentLocation();
    if (coords && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: coords.latitude,
          longitude: coords.longitude,
          ...zoomLevels.district,
        },
        500
      );
    }
  }, [getCurrentLocation]);

  // Handle tab change
  const handleTabChange = useCallback((tab: MapItemType) => {
    setActiveTab(tab);
    setSelectedId(null);
    setRouteCoordinates([]);
    setDrivingDistance(null);
    setFilters({ categoryIds: [], city: undefined }); // Reset filters when changing tab
  }, []);

  // Toggle category selection (multi-select)
  const handleCategoryToggle = useCallback((categoryId: number) => {
    setFilters(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId]
    }));
    setSelectedId(null);
    setRouteCoordinates([]);
  }, []);

  // Clear category filter
  const handleCategoryClear = useCallback(() => {
    setFilters(prev => ({ ...prev, categoryIds: [] }));
    setSelectedId(null);
    setRouteCoordinates([]);
  }, []);

  // Handle city selection (single-select) - will center map after data loads
  const handleCitySelect = useCallback((city: string | undefined) => {
    setFilters(prev => ({ ...prev, city }));
    setSelectedId(null);
    setRouteCoordinates([]);
    setShowCityModal(false);
    if (city) {
      setPendingCityZoom(city);
    }
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({ categoryIds: [], city: undefined });
    setSelectedId(null);
    setRouteCoordinates([]);
  }, []);

  const hasFilters = filters.categoryIds.length > 0 || filters.city !== undefined;

  // Get selected categories text
  const selectedCategoriesText = useMemo(() => {
    if (filters.categoryIds.length === 0 || !categories) return 'კატეგორია';
    if (filters.categoryIds.length === 1) {
      return categories.find(c => c.id === filters.categoryIds[0])?.name || 'კატეგორია';
    }
    return `${filters.categoryIds.length} კატეგორია`;
  }, [filters.categoryIds, categories]);

  // Get selected item details
  const selectedItem = useMemo(() => {
    if (!selectedId) return null;
    return markersData.find((item: any) => item.id === selectedId);
  }, [selectedId, markersData]);

  // გზის მანძილის გამოთვლა OSRM API-დან
  const fetchDrivingDistance = useCallback(async (
    from: { latitude: number; longitude: number },
    to: { latitude: number; longitude: number }
  ) => {
    setIsLoadingDistance(true);
    setDrivingDistance(null);
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${from.longitude},${from.latitude};${to.longitude},${to.latitude}?overview=false`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.code === 'Ok' && data.routes?.[0]?.distance) {
        // distance is in meters, convert to km
        setDrivingDistance(data.routes[0].distance / 1000);
      }
    } catch (error) {
      console.log('Distance fetch error:', error);
    } finally {
      setIsLoadingDistance(false);
    }
  }, []);

  // მარშრუტის მიღება OSRM API-დან
  const fetchRoute = useCallback(async (
    from: { latitude: number; longitude: number },
    to: { latitude: number; longitude: number }
  ) => {
    setIsLoadingRoute(true);
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${from.longitude},${from.latitude};${to.longitude},${to.latitude}?overview=full&geometries=polyline`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.code === 'Ok' && data.routes?.[0]?.geometry) {
        const decodedRoute = decodePolyline(data.routes[0].geometry);
        setRouteCoordinates(decodedRoute);
      }
    } catch (error) {
      console.log('Route fetch error:', error);
    } finally {
      setIsLoadingRoute(false);
    }
  }, []);

  // მარშრუტის გასუფთავება
  const clearRoute = useCallback(() => {
    setRouteCoordinates([]);
  }, []);

  // ნავიგაციის გახსნა (გარე აპში)
  const openInMapApp = useCallback((mapType: 'google' | 'apple' | 'waze' | 'yandex') => {
    if (!selectedItem) return;
    const { latitude, longitude } = selectedItem;

    let url: string;
    switch (mapType) {
      case 'google':
        url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
        break;
      case 'apple':
        url = `maps://app?daddr=${latitude},${longitude}&dirflg=d`;
        break;
      case 'waze':
        url = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
        break;
      case 'yandex':
        url = `yandexnavi://build_route_on_map?lat_to=${latitude}&lon_to=${longitude}`;
        break;
    }

    Linking.openURL(url).catch(() => {
      // Fallback to Google Maps web if app not installed
      Linking.openURL(
        `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`
      );
    });
    setShowMapChoiceModal(false);
  }, [selectedItem]);

  // მარშრუტის ჩვენება აპში
  const handleShowRoute = useCallback(() => {
    if (!selectedItem || !userLocation) return;
    fetchRoute(userLocation, {
      latitude: selectedItem.latitude,
      longitude: selectedItem.longitude,
    });

    // რუკის zoom მარშრუტზე
    if (mapRef.current) {
      mapRef.current.fitToCoordinates(
        [userLocation, { latitude: selectedItem.latitude, longitude: selectedItem.longitude }],
        {
          edgePadding: { top: 100, right: 50, bottom: 200, left: 50 },
          animated: true,
        }
      );
    }
  }, [selectedItem, userLocation, fetchRoute]);

  return (
    <>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TabButton
          label="სერვისები"
          isActive={activeTab === 'service'}
          onPress={() => handleTabChange('service')}
        />
        <TabButton
          label="სამრეცხაოები"
          isActive={activeTab === 'laundry'}
          onPress={() => handleTabChange('laundry')}
        />
        <TabButton
          label="დრაივები"
          isActive={activeTab === 'drive'}
          onPress={() => handleTabChange('drive')}
        />
      </View>

      {/* Filters */}
      <View style={filterStyles.container}>
        {/* Category Filter (only for services) */}
        {activeTab === 'service' && (
          <TouchableOpacity
            style={[filterStyles.filterButton, filters.categoryIds.length > 0 && filterStyles.filterButtonActive]}
            onPress={() => setShowCategoryModal(true)}
          >
            <Ionicons
              name="construct"
              size={18}
              color={filters.categoryIds.length > 0 ? colors.primary[500] : colors.gray[500]}
            />
            <Text style={[filterStyles.filterText, filters.categoryIds.length > 0 && filterStyles.filterTextActive]} numberOfLines={1}>
              {selectedCategoriesText}
            </Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color={filters.categoryIds.length > 0 ? colors.primary[500] : colors.gray[500]}
            />
          </TouchableOpacity>
        )}

        {/* City Filter */}
        <TouchableOpacity
          style={[filterStyles.filterButton, filters.city && filterStyles.filterButtonActive]}
          onPress={() => setShowCityModal(true)}
        >
          <Ionicons
            name="location"
            size={18}
            color={filters.city ? colors.primary[500] : colors.gray[500]}
          />
          <Text style={[filterStyles.filterText, filters.city && filterStyles.filterTextActive]}>
            {filters.city || 'ქალაქი'}
          </Text>
          <Ionicons
            name="chevron-down"
            size={16}
            color={filters.city ? colors.primary[500] : colors.gray[500]}
          />
        </TouchableOpacity>

        {/* Clear Filters */}
        {hasFilters && (
          <TouchableOpacity style={filterStyles.clearButton} onPress={clearFilters}>
            <Ionicons name="close-circle" size={24} color={colors.gray[400]} />
          </TouchableOpacity>
        )}
      </View>

      {/* City Modal */}
      <CityFilterModal
        visible={showCityModal}
        items={cities || []}
        selectedValue={filters.city}
        onSelect={handleCitySelect}
        onClose={() => setShowCityModal(false)}
      />

      {/* Category Modal (only for services) */}
      <CategoryFilterModal
        visible={showCategoryModal}
        categories={categories || []}
        selectedIds={filters.categoryIds}
        onToggle={handleCategoryToggle}
        onClear={handleCategoryClear}
        onClose={() => setShowCategoryModal(false)}
      />

      {/* Map Choice Modal */}
      <Modal
        visible={showMapChoiceModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMapChoiceModal(false)}
      >
        <TouchableOpacity
          style={filterStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMapChoiceModal(false)}
        >
          <TouchableOpacity activeOpacity={1} style={[filterStyles.modalContent, { maxHeight: '50%' }]}>
            <View style={filterStyles.modalHeader}>
              <Text style={filterStyles.modalTitle}>აირჩიეთ აპლიკაცია</Text>
              <TouchableOpacity onPress={() => setShowMapChoiceModal(false)}>
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <View style={{ paddingVertical: spacing.sm }}>
              <TouchableOpacity
                style={styles.mapChoiceItem}
                onPress={() => openInMapApp('google')}
              >
                <View style={[styles.mapChoiceIcon, { backgroundColor: '#4285F4' }]}>
                  <Ionicons name="logo-google" size={24} color={colors.white} />
                </View>
                <Text style={styles.mapChoiceText}>Google Maps</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
              </TouchableOpacity>

              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  style={styles.mapChoiceItem}
                  onPress={() => openInMapApp('apple')}
                >
                  <View style={[styles.mapChoiceIcon, { backgroundColor: '#000' }]}>
                    <Ionicons name="logo-apple" size={24} color={colors.white} />
                  </View>
                  <Text style={styles.mapChoiceText}>Apple Maps</Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.mapChoiceItem}
                onPress={() => openInMapApp('waze')}
              >
                <View style={[styles.mapChoiceIcon, { backgroundColor: '#33CCFF' }]}>
                  <Ionicons name="navigate" size={24} color={colors.white} />
                </View>
                <Text style={styles.mapChoiceText}>Waze</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mapChoiceItem}
                onPress={() => openInMapApp('yandex')}
              >
                <View style={[styles.mapChoiceIcon, { backgroundColor: '#FC3F1D' }]}>
                  <Ionicons name="compass" size={24} color={colors.white} />
                </View>
                <Text style={styles.mapChoiceText}>Yandex Navigator</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          initialRegion={defaultRegion}
          onRegionChangeComplete={setMapRegion}
          showsUserLocation
          showsMyLocationButton={false}
          showsCompass={false}
        >
          {markersData.map((item: any) => {
            const isSelected = selectedId === item.id;
            return (
              <Marker
                key={`${activeTab}-${item.id}`}
                identifier={`${activeTab}-${item.id}`}
                coordinate={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                }}
                onPress={() => handleMarkerPress(item.id)}
                tracksViewChanges={Platform.OS === 'android' ? isSelected : false}
                anchor={{ x: 0.5, y: 1 }}
              >
                <View style={styles.markerContainer}>
                  <View
                    style={[
                      styles.marker,
                      { backgroundColor: markerColors[activeTab] },
                      isSelected && styles.markerSelected,
                    ]}
                  >
                    <Ionicons
                      name={markerIcons[activeTab]}
                      size={isSelected ? 18 : 14}
                      color={colors.white}
                    />
                  </View>
                  <View
                    style={[styles.markerArrow, { borderTopColor: markerColors[activeTab] }]}
                  />
                </View>
              </Marker>
            );
          })}

          {/* მარშრუტის ხაზი */}
          {routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor={colors.primary[500]}
              strokeWidth={4}
            />
          )}
        </MapView>

        {/* My Location Button */}
        <TouchableOpacity
          style={styles.myLocationButton}
          onPress={handleMyLocation}
          activeOpacity={0.8}
          disabled={isLocationLoading}
        >
          {isLocationLoading ? (
            <ActivityIndicator size="small" color={colors.primary[500]} />
          ) : (
            <Ionicons name="locate" size={24} color={colors.primary[500]} />
          )}
        </TouchableOpacity>

        {/* Loading overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary[500]} />
            <Text style={styles.loadingText}>იტვირთება...</Text>
          </View>
        )}

        {/* Item count badge */}
        <View style={styles.countBadge}>
          <Ionicons name="location" size={14} color={colors.white} />
          <Text style={styles.countText}>
            {markersData.length}/{items.length}
          </Text>
        </View>

        {/* Error display */}
        {isError && (
          <View style={styles.errorBadge}>
            <Ionicons name="alert-circle" size={14} color={colors.white} />
            <Text style={styles.errorText}>
              {error?.message || 'შეცდომა მონაცემების ჩატვირთვისას'}
            </Text>
          </View>
        )}
      </View>

      {/* Selected Item Card */}
      {selectedItem && (
        <View style={styles.selectedCard}>
          <TouchableOpacity
            style={styles.selectedCardContent}
            onPress={() => handleItemPress(selectedItem.id)}
            activeOpacity={0.7}
          >
            <View style={styles.selectedCardImageContainer}>
              {selectedItem.photos?.[0] ? (
                <Image
                  source={{ uri: selectedItem.photos[0] }}
                  style={styles.selectedCardImage}
                  contentFit="cover"
                  transition={200}
                />
              ) : (
                <View style={styles.selectedCardIcon}>
                  <Ionicons
                    name={markerIcons[activeTab]}
                    size={24}
                    color={markerColors[activeTab]}
                  />
                </View>
              )}
            </View>
            <View style={styles.selectedCardInfo}>
              <Text style={styles.selectedCardName} numberOfLines={1}>
                {selectedItem.name}
              </Text>
              {userLocation && (
                <View style={styles.selectedCardRow}>
                  <Ionicons name="navigate-outline" size={14} color={colors.primary[500]} />
                  {isLoadingDistance ? (
                    <Text style={styles.selectedCardDistance}>იტვირთება...</Text>
                  ) : drivingDistance !== null ? (
                    <Text style={styles.selectedCardDistance}>
                      {drivingDistance < 1
                        ? `${Math.round(drivingDistance * 1000)} მ`
                        : `${drivingDistance.toFixed(1)} კმ`}
                    </Text>
                  ) : null}
                </View>
              )}
              {selectedItem.address && (
                <View style={styles.selectedCardRow}>
                  <Ionicons name="location-outline" size={14} color={colors.gray[500]} />
                  <Text style={styles.selectedCardAddress} numberOfLines={1}>
                    {selectedItem.address}
                  </Text>
                </View>
              )}
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
          </TouchableOpacity>
          <View style={styles.buttonRow}>
            {routeCoordinates.length > 0 ? (
              <>
                <TouchableOpacity
                  style={[styles.navigationButton, styles.navigationButtonOutline]}
                  onPress={clearRoute}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={20} color={colors.primary[500]} />
                  <Text style={styles.navigationButtonTextOutline}>დახურვა</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.navigationButton, styles.navigationButtonFlex]}
                  onPress={() => setShowMapChoiceModal(true)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="open-outline" size={20} color={colors.white} />
                  <Text style={styles.navigationButtonText}>Maps-ში გახსნა</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[styles.navigationButton, styles.navigationButtonFlex]}
                onPress={handleShowRoute}
                activeOpacity={0.7}
                disabled={isLoadingRoute || !userLocation}
              >
                {isLoadingRoute ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <>
                    <Ionicons name="navigate" size={20} color={colors.white} />
                    <Text style={styles.navigationButtonText}>მარშრუტის ჩვენება</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Empty state hint */}
      {!isLoading && markersData.length === 0 && (
        <View style={styles.emptyHint}>
          <Ionicons name="information-circle" size={20} color={colors.gray[500]} />
          <Text style={styles.emptyHintText}>
            {activeTab === 'service' && 'სერვისები არ მოიძებნა'}
            {activeTab === 'laundry' && 'სამრეცხაოები არ მოიძებნა'}
            {activeTab === 'drive' && 'დრაივები არ მოიძებნა'}
          </Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLogo: {
    width: 56,
    height: 56,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  whatsappButton: {
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.lg,
    padding: 4,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
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
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerContainerSelected: {
    transform: [{ scale: 1.1 }],
  },
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  markerSelected: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
  },
  markerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -2,
  },
  myLocationButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  countBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  countText: {
    ...typography.bodySmall,
    color: colors.white,
    fontWeight: '600',
    marginLeft: 4,
  },
  errorBadge: {
    position: 'absolute',
    top: spacing.md + 44,
    left: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error[500],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    maxWidth: '80%',
  },
  errorText: {
    ...typography.caption,
    color: colors.white,
    marginLeft: 4,
    flexShrink: 1,
  },
  selectedCard: {
    position: 'absolute',
    bottom: 120,
    left: spacing.md,
    right: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  selectedCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  selectedCardImageContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  selectedCardImage: {
    width: '100%',
    height: '100%',
  },
  selectedCardIcon: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCardInfo: {
    flex: 1,
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
  },
  selectedCardName: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    fontWeight: '600',
  },
  selectedCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  selectedCardAddress: {
    ...typography.caption,
    color: colors.text.secondary,
    marginLeft: 4,
    flex: 1,
  },
  selectedCardRating: {
    ...typography.caption,
    color: colors.text.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  selectedCardDistance: {
    ...typography.caption,
    color: colors.primary[500],
    fontWeight: '600',
    marginLeft: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  navigationButtonFlex: {
    flex: 1,
  },
  navigationButtonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary[500],
  },
  navigationButtonText: {
    ...typography.bodySmall,
    color: colors.white,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  navigationButtonTextOutline: {
    ...typography.bodySmall,
    color: colors.primary[500],
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  emptyHint: {
    position: 'absolute',
    bottom: 120,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  emptyHintText: {
    ...typography.body,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
  mapChoiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  mapChoiceIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapChoiceText: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
    flex: 1,
    marginLeft: spacing.md,
  },
});
