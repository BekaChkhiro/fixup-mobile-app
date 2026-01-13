import { Slot } from 'expo-router';
import { PersistentLayout } from '@/components/common';

export default function TabLayout() {
  return (
    <PersistentLayout>
      <Slot />
    </PersistentLayout>
  );
}
