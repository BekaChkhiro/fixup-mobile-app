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
import { useDrive } from '@/hooks';
import { Button, Card, Badge } from '@/components/ui';
import { LoadingState, ErrorState, Layout } from '@/components/common';
import { colors, spacing, borderRadius, typography } from '@/constants';
import {
  formatAddress,
  callPhone,
  openInMaps,
  shareDrive,
  getImageHeight,
} from '@/utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_HEIGHT = getImageHeight();

export default function DriveDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();

  const { data: drive, isLoading, isError, error, refetch } = useDrive(Number(id));

  // Hide default header
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  if (isLoading) {
    return (
      <Layout title="დრაივი" showBack showLogo={false} activeTab="map">
        <LoadingState message="იტვირთება..." />
      </Layout>
    );
  }

  if (isError || !drive) {
    return (
      <Layout title="დრაივი" showBack showLogo={false} activeTab="map">
        <ErrorState
          description={error?.message || 'დრაივის ჩატვირთვა ვერ მოხერხდა'}
          onRetry={refetch}
        />
      </Layout>
    );
  }

  const address = formatAddress(drive.city, drive.district, drive.address);
  const hasCoordinates = drive.latitude && drive.longitude;

  const handleCall = () => {
    if (drive.phone) {
      callPhone(drive.phone);
    }
  };

  const handleOpenMaps = () => {
    if (hasCoordinates) {
      openInMaps({
        latitude: drive.latitude!,
        longitude: drive.longitude!,
        label: drive.name,
      });
    }
  };

  const handleShare = () => {
    shareDrive(drive);
  };

  return (
    <Layout
      title={drive.name}
      showBack
      showLogo={false}
      activeTab="map"
    >
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Image Gallery */}
        {drive.photos && drive.photos.length > 0 ? (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.imageContainer}
          >
            {drive.photos.map((photo, index) => (
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
            <Text style={styles.title}>{drive.name}</Text>
            <Badge variant="success" size="sm">
              დრაივი
            </Badge>
          </View>

          {/* Description */}
          {drive.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>აღწერა</Text>
              <Text style={styles.description}>{drive.description}</Text>
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
          {drive.phone && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>საკონტაქტო</Text>
              <Card padding="md">
                <View style={styles.phoneRow}>
                  <Ionicons name="call" size={20} color={colors.primary[500]} />
                  <Text style={styles.phoneText}>{drive.phone}</Text>
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
          disabled={!drive.phone}
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
