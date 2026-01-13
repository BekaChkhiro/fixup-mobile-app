import React, { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from './Header';
import { BottomBar } from './BottomBar';
import { colors } from '@/constants';

type TabName = 'services' | 'map' | 'fuel';

interface LayoutProps {
  children: ReactNode;
  title: string;
  showBack?: boolean;
  showLogo?: boolean;
  showWhatsApp?: boolean;
  showBottomBar?: boolean;
  activeTab?: TabName;
}

export function Layout({
  children,
  title,
  showBack = false,
  showLogo = true,
  showWhatsApp = true,
  showBottomBar = true,
  activeTab,
}: LayoutProps) {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Header
        title={title}
        showBack={showBack}
        showLogo={showLogo}
        showWhatsApp={showWhatsApp}
      />
      {children}
      {showBottomBar && <BottomBar activeTab={activeTab} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
