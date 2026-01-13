import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { colors, spacing, borderRadius, typography } from '@/constants';
import { supabase } from '@/services/supabase';
import type { MapItemType } from '@/types';

export interface MapFiltersState {
  city?: string;
  district?: string;
}

interface MapFiltersProps {
  type: MapItemType;
  filters: MapFiltersState;
  onFiltersChange: (filters: MapFiltersState) => void;
}

// Inline query for cities
function useCitiesForMap() {
  return useQuery({
    queryKey: ['map-cities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mechanic_services')
        .select('city')
        .not('city', 'is', null);

      if (error) throw error;

      const uniqueCities = [...new Set(data?.map((d) => d.city).filter(Boolean))] as string[];
      return uniqueCities.sort();
    },
  });
}

// Inline query for districts
function useDistrictsForMap(city?: string) {
  return useQuery({
    queryKey: ['map-districts', city],
    queryFn: async () => {
      let query = supabase
        .from('mechanic_services')
        .select('district')
        .not('district', 'is', null);

      if (city) {
        query = query.eq('city', city);
      }

      const { data, error } = await query;

      if (error) throw error;

      const uniqueDistricts = [...new Set(data?.map((d) => d.district).filter(Boolean))] as string[];
      return uniqueDistricts.sort();
    },
    enabled: !!city,
  });
}

export function MapFilters({ type, filters, onFiltersChange }: MapFiltersProps) {
  const [showCityModal, setShowCityModal] = useState(false);
  const [showDistrictModal, setShowDistrictModal] = useState(false);

  const { data: cities } = useCitiesForMap();
  const { data: districts } = useDistrictsForMap(filters.city);

  const handleCitySelect = (city: string | undefined) => {
    onFiltersChange({
      city,
      district: undefined,
    });
    setShowCityModal(false);
  };

  const handleDistrictSelect = (district: string | undefined) => {
    onFiltersChange({
      ...filters,
      district,
    });
    setShowDistrictModal(false);
  };

  const hasFilters = filters.city !== undefined || filters.district !== undefined;

  const clearFilters = () => {
    onFiltersChange({
      city: undefined,
      district: undefined,
    });
  };

  return (
    <View style={styles.container}>
      {/* City Filter */}
      <TouchableOpacity
        style={[styles.filterButton, filters.city && styles.filterButtonActive]}
        onPress={() => setShowCityModal(true)}
      >
        <Ionicons
          name="location"
          size={14}
          color={filters.city ? colors.primary[500] : colors.gray[500]}
        />
        <Text style={[styles.filterText, filters.city && styles.filterTextActive]}>
          {filters.city || 'ქალაქი'}
        </Text>
        <Ionicons
          name="chevron-down"
          size={14}
          color={filters.city ? colors.primary[500] : colors.gray[500]}
        />
      </TouchableOpacity>

      {/* District Filter */}
      <TouchableOpacity
        style={[
          styles.filterButton,
          filters.district && styles.filterButtonActive,
          !filters.city && styles.filterButtonDisabled,
        ]}
        onPress={() => filters.city && setShowDistrictModal(true)}
        disabled={!filters.city}
      >
        <Ionicons
          name="business"
          size={14}
          color={
            !filters.city
              ? colors.gray[300]
              : filters.district
              ? colors.primary[500]
              : colors.gray[500]
          }
        />
        <Text
          style={[
            styles.filterText,
            filters.district && styles.filterTextActive,
            !filters.city && styles.filterTextDisabled,
          ]}
        >
          {filters.district || 'რაიონი'}
        </Text>
        <Ionicons
          name="chevron-down"
          size={14}
          color={
            !filters.city
              ? colors.gray[300]
              : filters.district
              ? colors.primary[500]
              : colors.gray[500]
          }
        />
      </TouchableOpacity>

      {/* Clear Filters */}
      {hasFilters && (
        <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
          <Ionicons name="close-circle" size={20} color={colors.gray[400]} />
        </TouchableOpacity>
      )}

      {/* City Modal */}
      <FilterModal
        visible={showCityModal}
        title="აირჩიეთ ქალაქი"
        items={cities || []}
        selectedValue={filters.city}
        onSelect={handleCitySelect}
        onClose={() => setShowCityModal(false)}
      />

      {/* District Modal */}
      <FilterModal
        visible={showDistrictModal}
        title="აირჩიეთ რაიონი"
        items={districts || []}
        selectedValue={filters.district}
        onSelect={handleDistrictSelect}
        onClose={() => setShowDistrictModal(false)}
      />
    </View>
  );
}

interface FilterModalProps {
  visible: boolean;
  title: string;
  items: string[];
  selectedValue?: string;
  onSelect: (value: string | undefined) => void;
  onClose: () => void;
}

function FilterModal({
  visible,
  title,
  items,
  selectedValue,
  onSelect,
  onClose,
}: FilterModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalList}>
            <TouchableOpacity
              style={[styles.modalItem, !selectedValue && styles.modalItemSelected]}
              onPress={() => onSelect(undefined)}
            >
              <Text style={[styles.modalItemText, !selectedValue && styles.modalItemTextSelected]}>
                ყველა
              </Text>
              {!selectedValue && (
                <Ionicons name="checkmark" size={20} color={colors.primary[500]} />
              )}
            </TouchableOpacity>

            {items.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.modalItem, selectedValue === item && styles.modalItemSelected]}
                onPress={() => onSelect(item)}
              >
                <Text
                  style={[
                    styles.modalItemText,
                    selectedValue === item && styles.modalItemTextSelected,
                  ]}
                >
                  {item}
                </Text>
                {selectedValue === item && (
                  <Ionicons name="checkmark" size={20} color={colors.primary[500]} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    gap: 4,
  },
  filterButtonActive: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  filterButtonDisabled: {
    opacity: 0.5,
  },
  filterText: {
    ...typography.caption,
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
});
