import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/constants';

const logo = require('@/assets/fixup.png');

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showLogo?: boolean;
  showWhatsApp?: boolean;
}

export function Header({
  title,
  showBack = false,
  showLogo = true,
  showWhatsApp = true,
}: HeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      {/* Left side */}
      {showBack ? (
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      ) : showLogo ? (
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      ) : (
        <View style={styles.iconButton} />
      )}

      {/* Title */}
      <Text style={styles.title} numberOfLines={1}>{title}</Text>

      {/* Right side */}
      {showWhatsApp ? (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => Linking.openURL('https://wa.me/995574047994')}
        >
          <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconButton} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  logo: {
    width: 56,
    height: 56,
  },
  iconButton: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.h4,
    color: colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
});
