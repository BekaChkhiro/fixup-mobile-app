import React from 'react';
import { View, Text, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  source?: string | null;
  name?: string;
  size?: AvatarSize;
  style?: ViewStyle;
}

const sizeMap: Record<AvatarSize, { container: number; fontSize: number; iconSize: number }> = {
  xs: { container: 24, fontSize: 10, iconSize: 14 },
  sm: { container: 32, fontSize: 12, iconSize: 18 },
  md: { container: 48, fontSize: 16, iconSize: 24 },
  lg: { container: 64, fontSize: 20, iconSize: 32 },
  xl: { container: 96, fontSize: 28, iconSize: 48 },
};

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function Avatar({ source, name, size = 'md', style }: AvatarProps) {
  const sizeStyle = sizeMap[size];

  const containerStyle: ViewStyle = {
    width: sizeStyle.container,
    height: sizeStyle.container,
    borderRadius: sizeStyle.container / 2,
  };

  if (source) {
    return (
      <View style={[containerStyle, style]}>
        <Image
          source={{ uri: source }}
          style={[
            styles.image,
            {
              width: sizeStyle.container,
              height: sizeStyle.container,
              borderRadius: sizeStyle.container / 2,
            } as ImageStyle,
          ]}
          contentFit="cover"
          transition={200}
        />
      </View>
    );
  }

  if (name) {
    return (
      <View style={[styles.placeholder, containerStyle, style]}>
        <Text style={[styles.initials, { fontSize: sizeStyle.fontSize }]}>
          {getInitials(name)}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.placeholder, containerStyle, style]}>
      <Ionicons name="person" size={sizeStyle.iconSize} color={colors.gray[400]} />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.gray[100],
  },
  placeholder: {
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: colors.gray[600],
    fontWeight: '600',
  },
});
