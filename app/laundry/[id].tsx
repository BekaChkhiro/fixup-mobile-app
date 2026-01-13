import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useLaundry } from '@/hooks';
import { Button, Card, Badge } from '@/components/ui';
import { LoadingState, ErrorState, Layout } from '@/components/common';
import { colors, spacing, borderRadius, typography } from '@/constants';
import {
  formatRating,
  formatAddress,
  callPhone,
  openInMaps,
  shareLaundry,
} from '@/utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_HEIGHT = 250;

export default function LaundryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();

  const { data: laundry, isLoading, isError, error, refetch } = useLaundry(Number(id));

  // Hide default header
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  if (isLoading) {
    return (
      <Layout title="სამრეცხაო" showBack showLogo={false} activeTab="map">
        <LoadingState message="იტვირთება..." />
      </Layout>
    );
  }

  if (isError || !laundry) {
    return (
      <Layout title="სამრეცხაო" showBack showLogo={false} activeTab="map">
        <ErrorState
          description={error?.message || 'სამრეცხაოს ჩატვირთვა ვერ მოხერხდა'}
          onRetry={refetch}
        />
      </Layout>
    );
  }

  const address = formatAddress(laundry.city, laundry.district, laundry.address);
  const hasCoordinates = laundry.latitude && laundry.longitude;

  const handleCall = () => {
    if (laundry.phone) {
      callPhone(laundry.phone);
    }
  };

  const handleOpenMaps = () => {
    if (hasCoordinates) {
      openInMaps({
        latitude: laundry.latitude!,
        longitude: laundry.longitude!,
        label: laundry.name,
      });
    }
  };

  const handleShare = () => {
    shareLaundry(laundry);
  };

  return (
    <Layout
      title={laundry.name}
      showBack
      showLogo={false}
      activeTab="map"
    >
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Image Gallery */}
        {laundry.photos && laundry.photos.length > 0 ? (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.imageContainer}
          >
            {laundry.photos.map((photo, index) => (
              <Image
                key={index}
                source={{ uri: photo }}
                style={styles.image}
                contentFit="cover"
                transition={200}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={[styles.imageContainer, styles.imagePlaceholder]}>
            <Ionicons name="image-outline" size={48} color={colors.gray[300]} />
          </View>
        )}

        <View style={styles.content}>
          {/* Title */}
          <View style={styles.header}>
            <Text style={styles.title}>{laundry.name}</Text>
            <Badge variant="info" size="sm">
              სამრეცხაო
            </Badge>
          </View>

          {/* Rating */}
          {laundry.rating && (
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={18} color={colors.warning[500]} />
              <Text style={styles.rating}>{formatRating(laundry.rating)}</Text>
              {laundry.review_count && (
                <Text style={styles.reviewCount}>
                  ({laundry.review_count} შეფასება)
                </Text>
              )}
            </View>
          )}

          {/* Working Hours */}
          {laundry.working_hours && (
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons name="time-outline" size={20} color={colors.primary[500]} />
                <Text style={styles.infoText}>{laundry.working_hours}</Text>
              </View>
            </View>
          )}

          {/* Description */}
          {laundry.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>აღწერა</Text>
              <Text style={styles.description}>{laundry.description}</Text>
            </View>
          )}

          {/* Address */}
          {address && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>მდებარეობა</Text>
              <Card padding="md" style={styles.addressCard}>
                <View style={styles.addressRow}>
                  <Ionicons name="location" size={20} color={colors.primary[500]} />
                  <Text style={styles.addressText}>{address}</Text>
                </View>
                {hasCoordinates && (
                  <Button
                    variant="outline"
                    size="sm"
                    icon="navigate-outline"
                    onPress={handleOpenMaps}
                    style={styles.mapsButton}
                  >
                    რუკაზე ნახვა
                  </Button>
                )}
              </Card>
            </View>
          )}

          {/* Phone */}
          {laundry.phone && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>საკონტაქტო</Text>
              <Card padding="md">
                <View style={styles.phoneRow}>
                  <Ionicons name="call" size={20} color={colors.primary[500]} />
                  <Text style={styles.phoneText}>{laundry.phone}</Text>
                </View>
              </Card>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Button
          variant="primary"
          size="lg"
          icon="call"
          onPress={handleCall}
          disabled={!laundry.phone}
          style={styles.callButton}
        >
          დარეკვა
        </Button>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  imageContainer: {
    height: IMAGE_HEIGHT,
  },
  image: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
  },
  imagePlaceholder: {
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  rating: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    marginLeft: 4,
  },
  reviewCount: {
    ...typography.body,
    color: colors.text.secondary,
    marginLeft: 4,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  infoText: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    marginLeft: spacing.xs,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  addressCard: {
    marginTop: spacing.xs,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  addressText: {
    ...typography.body,
    color: colors.text.primary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  mapsButton: {
    alignSelf: 'flex-start',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneText: {
    ...typography.body,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  shareButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  callButton: {
    flex: 1,
  },
});
