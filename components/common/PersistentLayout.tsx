import React, { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from './Header';
import { BottomBar } from './BottomBar';
import { useLayout } from '@/providers/LayoutProvider';
import { colors } from '@/constants';

interface PersistentLayoutProps {
  children: ReactNode;
}

export function PersistentLayout({ children }: PersistentLayoutProps) {
  const { config } = useLayout();

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Header
        title={config.title}
        showBack={config.showBack}
        showLogo={config.showLogo}
        showWhatsApp={config.showWhatsApp}
      />
      {children}
      <BottomBar activeTab={config.activeTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
