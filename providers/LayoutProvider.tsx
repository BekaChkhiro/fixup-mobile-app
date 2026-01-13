import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LayoutConfig {
  title: string;
  showBack: boolean;
  showLogo: boolean;
  showWhatsApp: boolean;
  activeTab: 'services' | 'map' | 'fuel';
}

interface LayoutContextType {
  config: LayoutConfig;
  setConfig: (config: Partial<LayoutConfig>) => void;
}

const defaultConfig: LayoutConfig = {
  title: 'სერვისები',
  showBack: false,
  showLogo: true,
  showWhatsApp: true,
  activeTab: 'services',
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<LayoutConfig>(defaultConfig);

  const setConfig = (newConfig: Partial<LayoutConfig>) => {
    setConfigState((prev) => ({ ...prev, ...newConfig }));
  };

  return (
    <LayoutContext.Provider value={{ config, setConfig }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
