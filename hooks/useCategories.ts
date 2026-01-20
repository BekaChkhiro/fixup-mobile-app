import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
import { DEMO_CATEGORIES } from '@/constants/demoData';
import type { ServiceCategory } from '@/types';

async function fetchCategories(): Promise<ServiceCategory[]> {
  try {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .order('name');

    if (error) {
      console.warn('Failed to fetch categories from Supabase, using demo data:', error.message);
      return DEMO_CATEGORIES;
    }

    // If data is empty, use demo data
    if (!data || data.length === 0) {
      return DEMO_CATEGORIES;
    }

    return data;
  } catch (err) {
    console.warn('Network error fetching categories, using demo data:', err);
    return DEMO_CATEGORIES;
  }
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    // Don't retry on failure since we have fallback data
    retry: false,
  });
}

export function useCategoryById(id: number | undefined) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('service_categories')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.warn('Failed to fetch category, using demo data:', error.message);
          const demoCategory = DEMO_CATEGORIES.find(c => c.id === id);
          if (demoCategory) return demoCategory;
          return DEMO_CATEGORIES[0];
        }

        return data as ServiceCategory;
      } catch (err) {
        console.warn('Network error fetching category, using demo data:', err);
        const demoCategory = DEMO_CATEGORIES.find(c => c.id === id);
        if (demoCategory) return demoCategory;
        return DEMO_CATEGORIES[0];
      }
    },
    enabled: !!id,
    retry: false,
  });
}
