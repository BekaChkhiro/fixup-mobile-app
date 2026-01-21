import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Modal,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useMechanic, useMechanicServices } from '@/hooks';
import { Avatar, Card, Button } from '@/components/ui';
import { LoadingState, ErrorState, Layout } from '@/components/common';
import { colors, spacing, borderRadius, typography } from '@/constants';
import { callPhone, formatRating, formatPrice, formatAddress } from '@/utils';

export default function MechanicProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const router = useRouter();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useMechanic(id || '');

  const {
    data: services,
    isLoading: servicesLoading,
  } = useMechanicServices(id || '');

  const [showMapModal, setShowMapModal] = useState(false);

  // Get location from first service that has coordinates
  const location = useMemo(() => {
    if (!services || services.length === 0) return null;

    const serviceWithLocation = services.find(
      (s) => s.latitude && s.longitude
    );

    if (!serviceWithLocation) return null;

    return {
      latitude: serviceWithLocation.latitude!,
      longitude: serviceWithLocation.longitude!,
      address: formatAddress(
        serviceWithLocation.city,
        serviceWithLocation.district,
        serviceWithLocation.address
      ),
      city: serviceWithLocation.city,
      district: serviceWithLocation.district,
    };
  }, [services]);

  // Hide default header
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  if (isLoading) {
    return (
      <Layout title="მექანიკოსი" showBack showLogo={false} activeTab="services">
        <LoadingState message="იტვირთება..." />
      </Layout>
    );
  }

  if (isError || !data) {
    return (
      <Layout title="მექანიკოსი" showBack showLogo={false} activeTab="services">
        <ErrorState
          description={error?.message || 'მექანიკოსის ჩატვირთვა ვერ მოხერხდა'}
          onRetry={refetch}
        />
      </Layout>
    );
  }

  const { profile, mechanic } = data;
  const phone = profile.phone;

  const handleCall = () => {
    if (phone) {
      callPhone(phone);
    }
  };

  const handleServicePress = (serviceId: number) => {
    router.push(`/service/${serviceId}`);
  };

  const handleOpenMaps = () => {
    if (location) {
      setShowMapModal(true);
    }
  };

  const openInMapApp = (mapType: 'google' | 'apple' | 'waze' | 'yandex') => {
    if (!location) return;

    const { latitude, longitude } = location;
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

  return (
    <Layout
      title={profile.full_name || 'მექანიკოსი'}
      showBack
      showLogo={false}
      activeTab="services"
    >
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Header Section */}
        <View style={styles.header}>
          <Avatar
            source={profile.avatar_url}
            name={profile.full_name || undefined}
            size="xl"
          />
          <Text style={styles.name}>{profile.full_name || 'მექანიკოსი'}</Text>

          {mechanic.specialization && (
            <Text style={styles.specialization}>{mechanic.specialization}</Text>
          )}

          {/* Rating & Experience */}
          <View style={styles.statsRow}>
            {mechanic.rating && (
              <View style={styles.statItem}>
                <Ionicons name="star" size={18} color={colors.warning[500]} />
                <Text style={styles.statValue}>{formatRating(mechanic.rating)}</Text>
                {mechanic.review_count && (
                  <Text style={styles.statLabel}>({mechanic.review_count})</Text>
                )}
              </View>
            )}
            {mechanic.experience_years && (
              <View style={styles.statItem}>
                <Ionicons name="briefcase-outline" size={18} color={colors.primary[500]} />
                <Text style={styles.statValue}>{mechanic.experience_years}</Text>
                <Text style={styles.statLabel}>წელი</Text>
              </View>
            )}
          </View>

          {/* Location */}
          {(profile.city || profile.district) && (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={16} color={colors.text.secondary} />
              <Text style={styles.locationText}>
                {[profile.city, profile.district].filter(Boolean).join(', ')}
              </Text>
            </View>
          )}
        </View>

        {/* Info Cards */}
        <View style={styles.content}>
          {/* Description */}
          {mechanic.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>შესახებ</Text>
              <Text style={styles.description}>{mechanic.description}</Text>
            </View>
          )}

          {/* Working Hours */}
          {mechanic.working_hours && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>სამუშაო საათები</Text>
              <Card padding="md">
                <View style={styles.infoRow}>
                  <Ionicons name="time-outline" size={20} color={colors.primary[500]} />
                  <Text style={styles.infoText}>{mechanic.working_hours}</Text>
                </View>
              </Card>
            </View>
          )}

          {/* Features */}
          {(mechanic.is_mobile || mechanic.accepts_card_payment || mechanic.hourly_rate) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>მომსახურება</Text>
              <View style={styles.featuresGrid}>
                {mechanic.is_mobile && (
                  <View style={styles.featureItem}>
                    <Ionicons name="car" size={20} color={colors.success[500]} />
                    <Text style={styles.featureText}>ადგილზე მომსახურება</Text>
                  </View>
                )}
                {mechanic.accepts_card_payment && (
                  <View style={styles.featureItem}>
                    <Ionicons name="card" size={20} color={colors.success[500]} />
                    <Text style={styles.featureText}>ბარათით გადახდა</Text>
                  </View>
                )}
                {mechanic.hourly_rate && (
                  <View style={styles.featureItem}>
                    <Ionicons name="cash-outline" size={20} color={colors.primary[500]} />
                    <Text style={styles.featureText}>{mechanic.hourly_rate}₾/საათი</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Location */}
          {location && (
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
                      <Text style={styles.addressText}>{location.address}</Text>
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

          {/* Services */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              სერვისები {services && services.length > 0 ? `(${services.length})` : ''}
            </Text>
            {servicesLoading ? (
              <View style={styles.servicesLoading}>
                <Text style={styles.loadingText}>იტვირთება...</Text>
              </View>
            ) : services && services.length > 0 ? (
              services.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  style={styles.serviceCard}
                  onPress={() => handleServicePress(service.id)}
                  activeOpacity={0.7}
                >
                  {service.photos?.[0] ? (
                    <Image
                      source={{ uri: service.photos[0] }}
                      style={styles.serviceImage}
                      contentFit="cover"
                    />
                  ) : (
                    <View style={[styles.serviceImage, styles.serviceImagePlaceholder]}>
                      <Ionicons name="construct" size={24} color={colors.gray[400]} />
                    </View>
                  )}
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName} numberOfLines={1}>
                      {service.name}
                    </Text>
                    {service.service_categories?.name && (
                      <Text style={styles.serviceCategory}>
                        {service.service_categories.name}
                      </Text>
                    )}
                    {(service.price_from || service.price_to) && (
                      <Text style={styles.servicePrice}>
                        {formatPrice(service.price_from, service.price_to)}
                      </Text>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyServices}>
                <Ionicons name="construct-outline" size={32} color={colors.gray[300]} />
                <Text style={styles.emptyText}>სერვისები არ მოიძებნა</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.actionBar}>
        {location && (
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
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  name: {
    ...typography.h2,
    color: colors.text.primary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  specialization: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.lg,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  statLabel: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: 4,
  },
  locationText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  content: {
    padding: spacing.md,
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoText: {
    ...typography.body,
    color: colors.text.primary,
  },
  featuresGrid: {
    gap: spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureText: {
    ...typography.body,
    color: colors.text.primary,
  },
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
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: spacing.sm,
  },
  mapHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  mapHintText: {
    ...typography.caption,
    color: colors.white,
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
  addressText: {
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
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  serviceImage: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.sm,
  },
  serviceImagePlaceholder: {
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceInfo: {
    flex: 1,
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
  },
  serviceName: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  serviceCategory: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  servicePrice: {
    ...typography.bodySmall,
    color: colors.primary[500],
    fontWeight: '600',
    marginTop: 2,
  },
  actionBar: {
    flexDirection: 'row',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
    gap: spacing.sm,
  },
  callButton: {
    flex: 1,
  },
  routeButton: {
    flex: 1,
  },
  servicesLoading: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  emptyServices: {
    padding: spacing.xl,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.sm,
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
