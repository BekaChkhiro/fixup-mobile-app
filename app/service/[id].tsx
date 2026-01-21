import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  Platform,
  Linking,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useService } from '@/hooks';
import { Button, Card, Badge, Avatar } from '@/components/ui';
import { LoadingState, ErrorState, Layout } from '@/components/common';
import { colors, spacing, borderRadius, typography } from '@/constants';
import {
  formatPrice,
  formatRating,
  formatEstimatedTime,
  formatAddress,
  callPhone,
  getImageHeight,
} from '@/utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_HEIGHT = getImageHeight();

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const router = useRouter();

  const { data: service, isLoading, isError, error, refetch } = useService(Number(id));
  const [showMapModal, setShowMapModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageScrollRef = useRef<ScrollView>(null);

  // Hide default header
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  if (isLoading) {
    return (
      <Layout title="სერვისი" showBack showLogo={false} activeTab="services">
        <LoadingState message="იტვირთება..." />
      </Layout>
    );
  }

  if (isError || !service) {
    return (
      <Layout title="სერვისი" showBack showLogo={false} activeTab="services">
        <ErrorState
          description={error?.message || 'სერვისის ჩატვირთვა ვერ მოხერხდა'}
          onRetry={refetch}
        />
      </Layout>
    );
  }

  const address = formatAddress(service.city, service.district, service.address);
  const price = formatPrice(service.price_from, service.price_to);
  const estimatedTime = formatEstimatedTime(service.estimated_hours);
  const hasCoordinates = service.latitude && service.longitude;

  // Profile contains name and phone, mechanic_profiles contains specialization etc.
  const profile = service.profiles;
  const mechanic = service.mechanic_profiles;

  // Get phone from profile
  const phone = profile?.phone;

  const handleCall = () => {
    if (phone) {
      callPhone(phone);
    }
  };

  const handleOpenMaps = () => {
    if (hasCoordinates) {
      setShowMapModal(true);
    }
  };

  const openInMapApp = (mapType: 'google' | 'apple' | 'waze' | 'yandex') => {
    if (!hasCoordinates) return;

    const latitude = service.latitude!;
    const longitude = service.longitude!;
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
      Linking.openURL(
        `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`
      );
    });
    setShowMapModal(false);
  };

  const handleMechanicPress = () => {
    if (profile?.id) {
      router.push(`/mechanic/${profile.id}`);
    }
  };

  const handleImageScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentImageIndex(index);
  };

  const goToPreviousImage = () => {
    if (currentImageIndex > 0) {
      const newIndex = currentImageIndex - 1;
      imageScrollRef.current?.scrollTo({ x: newIndex * SCREEN_WIDTH, animated: true });
      setCurrentImageIndex(newIndex);
    }
  };

  const goToNextImage = () => {
    const photosLength = service.photos?.length || 0;
    if (currentImageIndex < photosLength - 1) {
      const newIndex = currentImageIndex + 1;
      imageScrollRef.current?.scrollTo({ x: newIndex * SCREEN_WIDTH, animated: true });
      setCurrentImageIndex(newIndex);
    }
  };

  return (
    <Layout
      title={service.name}
      showBack
      showLogo={false}
      activeTab="services"
    >
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Image Gallery */}
        {service.photos && service.photos.length > 0 ? (
          <View style={styles.carouselContainer}>
            <ScrollView
              ref={imageScrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleImageScroll}
              scrollEventThrottle={16}
              style={styles.imageContainer}
            >
              {service.photos.map((photo, index) => (
                <Image
                  key={index}
                  source={{ uri: photo }}
                  style={styles.image}
                  contentFit="cover"
                  transition={200}
                />
              ))}
            </ScrollView>

            {/* Arrow Buttons */}
            {service.photos.length > 1 && (
              <>
                <TouchableOpacity
                  style={[styles.arrowButton, styles.arrowLeft]}
                  onPress={goToPreviousImage}
                  disabled={currentImageIndex === 0}
                >
                  <Ionicons
                    name="chevron-back"
                    size={24}
                    color={currentImageIndex === 0 ? colors.gray[400] : colors.white}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.arrowButton, styles.arrowRight]}
                  onPress={goToNextImage}
                  disabled={currentImageIndex === service.photos.length - 1}
                >
                  <Ionicons
                    name="chevron-forward"
                    size={24}
                    color={currentImageIndex === service.photos.length - 1 ? colors.gray[400] : colors.white}
                  />
                </TouchableOpacity>
              </>
            )}

            {/* Pagination Dots */}
            {service.photos.length > 1 && (
              <View style={styles.pagination}>
                {service.photos.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      currentImageIndex === index && styles.paginationDotActive,
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={[styles.imageContainer, styles.imagePlaceholder]}>
            <Ionicons name="image-outline" size={48} color={colors.gray[300]} />
          </View>
        )}

        <View style={styles.content}>
          {/* Title & Category */}
          <View style={styles.header}>
            <Text style={styles.title}>{service.name}</Text>
            {service.service_categories?.name && (
              <Badge variant="primary" size="sm">
                {service.service_categories.name}
              </Badge>
            )}
          </View>

          {/* Rating & Reviews */}
          {service.rating && (
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={18} color={colors.warning[500]} />
              <Text style={styles.rating}>{formatRating(service.rating)}</Text>
              {service.review_count && (
                <Text style={styles.reviewCount}>
                  ({service.review_count} შეფასება)
                </Text>
              )}
            </View>
          )}

          {/* Price & Time */}
          <View style={styles.infoRow}>
            {price && (
              <View style={styles.infoItem}>
                <Ionicons name="cash-outline" size={20} color={colors.primary[500]} />
                <Text style={styles.infoText}>{price}</Text>
              </View>
            )}
            {estimatedTime && (
              <View style={styles.infoItem}>
                <Ionicons name="time-outline" size={20} color={colors.primary[500]} />
                <Text style={styles.infoText}>{estimatedTime}</Text>
              </View>
            )}
          </View>

          {/* Description */}
          {service.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>აღწერა</Text>
              <Text style={styles.description}>{service.description}</Text>
            </View>
          )}

          {/* Location Block */}
          {hasCoordinates && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>მდებარეობა</Text>
              <View style={styles.mapCard}>
                {/* Address Info */}
                <View style={styles.addressContainer}>
                  <View style={styles.addressInfo}>
                    <View style={styles.addressIconContainer}>
                      <Ionicons name="location" size={20} color={colors.white} />
                    </View>
                    <View style={styles.addressTextContainer}>
                      <Text style={styles.addressLabel}>მისამართი</Text>
                      <Text style={styles.addressValue}>{address}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.navigateButton}
                    onPress={handleOpenMaps}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="navigate" size={20} color={colors.white} />
                    <Text style={styles.navigateButtonText}>მარშრუტი</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Address without coordinates */}
          {!hasCoordinates && address && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>მდებარეობა</Text>
              <Card padding="md">
                <View style={styles.addressRow}>
                  <Ionicons name="location" size={20} color={colors.primary[500]} />
                  <Text style={styles.addressText}>{address}</Text>
                </View>
              </Card>
            </View>
          )}

          {/* Mechanic */}
          {profile && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>მექანიკოსი</Text>
              <Card padding="md" onPress={handleMechanicPress}>
                <View style={styles.mechanicRow}>
                  <Avatar
                    source={profile.avatar_url}
                    name={profile.full_name || undefined}
                    size="lg"
                  />
                  <View style={styles.mechanicInfo}>
                    <Text style={styles.mechanicName}>{profile.full_name || 'მექანიკოსი'}</Text>
                    {mechanic?.rating && (
                      <View style={styles.mechanicRating}>
                        <Ionicons name="star" size={14} color={colors.warning[500]} />
                        <Text style={styles.mechanicRatingText}>
                          {formatRating(mechanic.rating)}
                        </Text>
                      </View>
                    )}
                    {mechanic?.experience_years && (
                      <Text style={styles.mechanicExperience}>
                        {mechanic.experience_years} წლის გამოცდილება
                      </Text>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
                </View>
              </Card>
            </View>
          )}

          {/* Additional Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>დამატებითი ინფორმაცია</Text>
            <View style={styles.additionalInfo}>
              {service.on_site_service && (
                <View style={styles.additionalItem}>
                  <Ionicons name="car" size={18} color={colors.success[500]} />
                  <Text style={styles.additionalText}>ადგილზე მომსახურება</Text>
                </View>
              )}
              {service.accepts_card_payment && (
                <View style={styles.additionalItem}>
                  <Ionicons name="card" size={18} color={colors.success[500]} />
                  <Text style={styles.additionalText}>ბარათით გადახდა</Text>
                </View>
              )}
              {service.accepts_cash_payment && (
                <View style={styles.additionalItem}>
                  <Ionicons name="cash" size={18} color={colors.success[500]} />
                  <Text style={styles.additionalText}>ნაღდით გადახდა</Text>
                </View>
              )}
            </View>
          </View>

          {/* Car Brands */}
          {service.car_brands && service.car_brands.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>მანქანის ბრენდები</Text>
              <View style={styles.brandsContainer}>
                {service.car_brands.map((brand, index) => (
                  <Badge key={index} variant="default" size="sm">
                    {brand}
                  </Badge>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.actionBar}>
        {hasCoordinates && (
          <Button
            variant="outline"
            size="md"
            icon="navigate"
            onPress={handleOpenMaps}
            style={styles.routeButton}
          >
            მარშრუტი
          </Button>
        )}
        <Button
          variant="primary"
          size="md"
          icon="call"
          onPress={handleCall}
          disabled={!phone}
          style={styles.callButton}
        >
          დარეკვა
        </Button>
      </View>

      {/* Map Choice Modal */}
      <Modal
        visible={showMapModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMapModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMapModal(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>აირჩიეთ აპლიკაცია</Text>
              <TouchableOpacity onPress={() => setShowMapModal(false)}>
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.mapOptions}>
              <TouchableOpacity
                style={styles.mapOption}
                onPress={() => openInMapApp('google')}
              >
                <View style={[styles.mapOptionIcon, { backgroundColor: '#4285F4' }]}>
                  <Ionicons name="logo-google" size={24} color={colors.white} />
                </View>
                <Text style={styles.mapOptionText}>Google Maps</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
              </TouchableOpacity>

              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  style={styles.mapOption}
                  onPress={() => openInMapApp('apple')}
                >
                  <View style={[styles.mapOptionIcon, { backgroundColor: '#000' }]}>
                    <Ionicons name="logo-apple" size={24} color={colors.white} />
                  </View>
                  <Text style={styles.mapOptionText}>Apple Maps</Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.mapOption}
                onPress={() => openInMapApp('waze')}
              >
                <View style={[styles.mapOptionIcon, { backgroundColor: '#33CCFF' }]}>
                  <Ionicons name="navigate" size={24} color={colors.white} />
                </View>
                <Text style={styles.mapOptionText}>Waze</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mapOption}
                onPress={() => openInMapApp('yandex')}
              >
                <View style={[styles.mapOptionIcon, { backgroundColor: '#FC3F1D' }]}>
                  <Ionicons name="compass" size={24} color={colors.white} />
                </View>
                <Text style={styles.mapOptionText}>Yandex Navigator</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </Layout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  carouselContainer: {
    position: 'relative',
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
  arrowButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowLeft: {
    left: spacing.sm,
  },
  arrowRight: {
    right: spacing.sm,
  },
  pagination: {
    position: 'absolute',
    bottom: spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  paginationDotActive: {
    backgroundColor: colors.white,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h3,
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
  mechanicRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mechanicInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  mechanicName: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  mechanicRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  mechanicRatingText: {
    ...typography.bodySmall,
    color: colors.text.primary,
    marginLeft: 4,
  },
  mechanicExperience: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  additionalInfo: {
    gap: spacing.sm,
  },
  additionalItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  additionalText: {
    ...typography.body,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  brandsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
    gap: spacing.sm,
  },
  routeButton: {
    flex: 1,
  },
  callButton: {
    flex: 1,
  },
  // Map Block Styles
  mapCard: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mapTouchable: {
    position: 'relative',
  },
  map: {
    width: '100%',
    height: 160,
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.primary[500],
    marginTop: -4,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  addressInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  addressIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressTextContainer: {
    flex: 1,
  },
  addressLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  addressValue: {
    ...typography.bodySmall,
    color: colors.text.primary,
    fontWeight: '500',
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  navigateButtonText: {
    ...typography.buttonSmall,
    color: colors.white,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
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
  mapOptions: {
    paddingVertical: spacing.sm,
  },
  mapOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  mapOptionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapOptionText: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
    flex: 1,
    marginLeft: spacing.md,
  },
});
