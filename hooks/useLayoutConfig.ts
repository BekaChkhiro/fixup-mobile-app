import { useEffect } from 'react';
import { useLayout } from '@/providers/LayoutProvider';

interface LayoutConfigOptions {
  title: string;
  showBack?: boolean;
  showLogo?: boolean;
  showWhatsApp?: boolean;
  activeTab?: 'services' | 'map' | 'fuel';
}

export function useLayoutConfig(options: LayoutConfigOptions) {
  const { setConfig } = useLayout();

  useEffect(() => {
    setConfig({
      title: options.title,
      showBack: options.showBack ?? false,
      showLogo: options.showLogo ?? true,
      showWhatsApp: options.showWhatsApp ?? true,
      activeTab: options.activeTab ?? 'services',
    });
  }, [options.title, options.showBack, options.showLogo, options.showWhatsApp, options.activeTab]);
}
