import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui';
import { colors, spacing, borderRadius, typography } from '@/constants';
import type { FuelImporter } from '@/types';

interface CheapestPrices {
  regular: number;
  premium: number;
  super: number;
  diesel: number;
}

interface FuelPriceCardProps {
  importer: FuelImporter;
  cheapestPrices?: CheapestPrices | null;
}

interface FuelRowProps {
  label: string;
  shortLabel: string;
  price: number | null;
  cheapestPrice?: number;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
}

function FuelRow({ label, shortLabel, price, cheapestPrice, color, icon }: FuelRowProps) {
  if (price === null) return null;

  const isCheapest = cheapestPrice ? price === cheapestPrice : false;

  return (
    <View style={[styles.fuelRow, isCheapest && styles.fuelRowCheapest]}>
      <View style={styles.fuelLeft}>
        <View style={[styles.fuelIconContainer, { backgroundColor: color }]}>
          <Ionicons name={icon} size={16} color={colors.white} />
        </View>
        <View style={styles.fuelLabelContainer}>
          <Text style={styles.fuelShortLabel}>{shortLabel}</Text>
          <Text style={styles.fuelLabel}>{label}</Text>
        </View>
      </View>
      <View style={styles.fuelRight}>
        <Text style={[styles.price, isCheapest && styles.priceCheapest]}>
          {price.toFixed(2)}
        </Text>
        <Text style={styles.currency}>₾</Text>
      </View>
    </View>
  );
}

export function FuelPriceCard({ importer, cheapestPrices }: FuelPriceCardProps) {
  const hasAnyPrice =
    importer.regular_ron_93_price ||
    importer.premium_ron_96_price ||
    importer.super_ron_98_price ||
    importer.diesel_price;

  // Get company initial for placeholder
  const initial = importer.name.charAt(0).toUpperCase();

  // Company colors
  const companyColors: Record<string, string> = {
    'Wissol': '#E31E24',
    'Portal': '#1E3A8A',
    'Socar': '#00A651',
    'Gulf': '#FF6B00',
    'Rompetrol': '#FFD700',
    'Connect': '#6366F1',
  };

  const companyColor = companyColors[importer.name] || colors.primary[500];

  return (
    <Card style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.logoContainer, { backgroundColor: companyColor }]}>
          {importer.logo ? (
            <Image
              source={{ uri: importer.logo }}
              style={styles.logo}
              contentFit="contain"
              transition={200}
            />
          ) : (
            <Text style={styles.logoInitial}>{initial}</Text>
          )}
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{importer.name}</Text>
          <View style={styles.updateInfo}>
            <Ionicons name="time-outline" size={12} color={colors.text.tertiary} />
            <Text style={styles.updatedAt}>
              {new Date(importer.updated_at).toLocaleTimeString('ka-GE', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </View>
      </View>

      {/* Prices Grid */}
      {hasAnyPrice ? (
        <View style={styles.pricesGrid}>
          <FuelRow
            label="RON 93"
            shortLabel="რეგულარი"
            price={importer.regular_ron_93_price}
            cheapestPrice={cheapestPrices?.regular}
            color={colors.success[500]}
            icon="leaf-outline"
          />
          <FuelRow
            label="RON 96"
            shortLabel="პრემიუმი"
            price={importer.premium_ron_96_price}
            cheapestPrice={cheapestPrices?.premium}
            color={colors.primary[500]}
            icon="flash-outline"
          />
          <FuelRow
            label="RON 98"
            shortLabel="სუპერი"
            price={importer.super_ron_98_price}
            cheapestPrice={cheapestPrices?.super}
            color={colors.warning[500]}
            icon="rocket-outline"
          />
          <FuelRow
            label="ევრო"
            shortLabel="დიზელი"
            price={importer.diesel_price}
            cheapestPrice={cheapestPrices?.diesel}
            color={colors.gray[600]}
            icon="water-outline"
          />
        </View>
      ) : (
        <View style={styles.noPrices}>
          <Ionicons name="alert-circle-outline" size={24} color={colors.gray[300]} />
          <Text style={styles.noPricesText}>ფასები მიუწვდომელია</Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    padding: 0,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.gray[50],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logoContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    width: 32,
    height: 32,
  },
  logoInitial: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: 0.3,
  },
  updateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  updatedAt: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  pricesGrid: {
    padding: spacing.sm,
  },
  fuelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    marginVertical: 2,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
  },
  fuelRowCheapest: {
    backgroundColor: colors.success[50],
  },
  fuelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fuelIconContainer: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fuelLabelContainer: {
    marginLeft: spacing.sm,
  },
  fuelShortLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  fuelLabel: {
    fontSize: 11,
    color: colors.text.tertiary,
    marginTop: 1,
  },
  fuelRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  priceCheapest: {
    color: colors.success[600],
  },
  currency: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
    marginLeft: 2,
  },
  noPrices: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  noPricesText: {
    ...typography.body,
    color: colors.text.tertiary,
  },
});
