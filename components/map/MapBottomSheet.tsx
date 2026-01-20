import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius, typography } from '@/constants';
import { formatRating, formatAddress } from '@/utils';
import type { MapItemType } from '@/types';

interface MapItem {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address?: string | null;
  rating?: number | null;
  photos?: string[] | null;
}

interface MapBottomSheetProps {
  items: MapItem[];
  type: MapItemType;
  selectedId?: number | null;
  onItemSelect: (item: MapItem) => void;
  isLoading?: boolean;
}

export function MapBottomSheet({
  items,
  type,
  selectedId,
  onItemSelect,
  isLoading = false,
}: MapBottomSheetProps) {
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['15%', '40%', '80%'], []);

  const handleItemPress = useCallback(
    (item: MapItem) => {
      onItemSelect(item);
      // Navigate to detail page
      const route =
        type === 'service'
          ? `/service/${item.id}`
          : type === 'laundry'
          ? `/laundry/${item.id}`
          : `/drive/${item.id}`;
      router.push(route as any);
    },
    [type, router, onItemSelect]
  );

  const handleItemFocus = useCallback(
    (item: MapItem) => {
      onItemSelect(item);
    },
    [onItemSelect]
  );

  const getTypeLabel = (): string => {
    switch (type) {
      case 'service':
        return 'სერვისი';
      case 'laundry':
        return 'სამრეცხაო';
      case 'drive':
        return 'დრაივი';
    }
  };

  const renderItem = useCallback(
    ({ item }: { item: MapItem }) => {
      const isSelected = selectedId === item.id;
      const imageUrl = item.photos?.[0];

      return (
        <TouchableOpacity
          style={[styles.item, isSelected && styles.itemSelected]}
          onPress={() => handleItemPress(item)}
          onLongPress={() => handleItemFocus(item)}
          activeOpacity={0.7}
        >
          {/* Image */}
          <View style={styles.imageContainer}>
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                style={styles.image}
                contentFit="cover"
                transition={200}
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image-outline" size={24} color={colors.gray[300]} />
              </View>
            )}
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>

            {item.rating && (
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={12} color={colors.warning[500]} />
                <Text style={styles.rating}>{formatRating(item.rating)}</Text>
              </View>
            )}

            {item.address && (
              <View style={styles.addressRow}>
                <Ionicons name="location-outline" size={12} color={colors.gray[400]} />
                <Text style={styles.address} numberOfLines={1}>
                  {item.address}
                </Text>
              </View>
            )}
          </View>

          {/* Arrow */}
          <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
        </TouchableOpacity>
      );
    },
    [selectedId, handleItemPress, handleItemFocus]
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.indicator}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {items.length} {getTypeLabel()} ნაპოვნია
        </Text>
      </View>

      <BottomSheetFlatList
        data={items}
        keyExtractor={(item: MapItem) => `${type}-${item.id}`}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },
  indicator: {
    backgroundColor: colors.gray[300],
    width: 40,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemSelected: {
    backgroundColor: colors.primary[50],
    marginHorizontal: -spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  imageContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
  },
  name: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  rating: {
    ...typography.caption,
    color: colors.text.primary,
    marginLeft: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  address: {
    ...typography.caption,
    color: colors.text.secondary,
    marginLeft: 4,
    flex: 1,
  },
});
