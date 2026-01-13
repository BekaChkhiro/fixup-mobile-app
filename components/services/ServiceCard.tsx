import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/constants';
import { Badge } from '@/components/ui';
import { formatPrice, formatRating, formatAddress } from '@/utils';
import type { MechanicService } from '@/types';

interface ServiceCardProps {
  service: MechanicService;
  onPress: () => void;
}

export function ServiceCard({ service, onPress }: ServiceCardProps) {
  const imageUrl = service.photos?.[0];
  const address = formatAddress(service.city, service.district);
  const price = formatPrice(service.price_from, service.price_to);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
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
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={32} color={colors.gray[300]} />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {service.name}
        </Text>

        {/* Rating */}
        {service.rating && (
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color={colors.warning[500]} />
            <Text style={styles.rating}>{formatRating(service.rating)}</Text>
            {service.review_count && (
              <Text style={styles.reviewCount}>({service.review_count})</Text>
            )}
          </View>
        )}

        {/* Address */}
        {address && (
          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={14} color={colors.gray[400]} />
            <Text style={styles.address} numberOfLines={1}>
              {address}
            </Text>
          </View>
        )}

        {/* Price */}
        {price && (
          <View style={styles.priceRow}>
            <Badge variant="primary" size="sm">
              {price}
            </Badge>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  imageContainer: {
    width: 100,
    height: 100,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: spacing.sm,
    justifyContent: 'center',
  },
  name: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  rating: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 4,
  },
  reviewCount: {
    ...typography.caption,
    color: colors.text.secondary,
    marginLeft: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  address: {
    ...typography.caption,
    color: colors.text.secondary,
    marginLeft: 4,
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
  },
});
