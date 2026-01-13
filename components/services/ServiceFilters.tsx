import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/constants';
import { useServiceCities, useServiceDistricts } from '@/hooks';
import type { ServiceFilters as ServiceFiltersType } from '@/types';

interface ServiceFiltersProps {
  filters: ServiceFiltersType;
  onFiltersChange: (filters: ServiceFiltersType) => void;
}

export function ServiceFilters({ filters, onFiltersChange }: ServiceFiltersProps) {
  const [showCityModal, setShowCityModal] = useState(false);
  const [showDistrictModal, setShowDistrictModal] = useState(false);

  const { data: cities } = useServiceCities();
  const { data: districts } = useServiceDistricts(filters.city);

  const handleCitySelect = (city: string | undefined) => {
    onFiltersChange({
      ...filters,
      city,
      district: undefined, // Reset district when city changes
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
      ...filters,
      city: undefined,
      district: undefined,
    });
  };

  return (
    <View style={styles.container}>
      {/* City Filter */}
      <TouchableOpacity
        style={[styles.filterButton, filters.city !== undefined && styles.filterButtonActive]}
        onPress={() => setShowCityModal(true)}
      >
        <Text style={[styles.filterText, filters.city !== undefined && styles.filterTextActive]}>
          {filters.city || 'ქალაქი'}
        </Text>
        <Ionicons
          name="chevron-down"
          size={16}
          color={filters.city ? colors.primary[500] : colors.gray[500]}
        />
      </TouchableOpacity>

      {/* District Filter */}
      <TouchableOpacity
        style={[
          styles.filterButton,
          filters.district !== undefined && styles.filterButtonActive,
          filters.city === undefined && styles.filterButtonDisabled,
        ]}
        onPress={() => filters.city !== undefined && setShowDistrictModal(true)}
        disabled={filters.city === undefined}
      >
        <Text
          style={[
            styles.filterText,
            filters.district !== undefined && styles.filterTextActive,
            filters.city === undefined && styles.filterTextDisabled,
          ]}
        >
          {filters.district || 'რაიონი'}
        </Text>
        <Ionicons
          name="chevron-down"
          size={16}
          color={
            filters.city === undefined
              ? colors.gray[300]
              : filters.district !== undefined
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
      <StringFilterModal
        visible={showCityModal}
        title="აირჩიეთ ქალაქი"
        items={cities || []}
        selectedValue={filters.city}
        onSelect={handleCitySelect}
        onClose={() => setShowCityModal(false)}
      />

      {/* District Modal */}
      <StringFilterModal
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

interface StringFilterModalProps {
  visible: boolean;
  title: string;
  items: string[];
  selectedValue?: string;
  onSelect: (value: string | undefined) => void;
  onClose: () => void;
}

function StringFilterModal({
  visible,
  title,
  items,
  selectedValue,
  onSelect,
  onClose,
}: StringFilterModalProps) {
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
            {/* All option */}
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
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    gap: spacing.xs,
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
});
