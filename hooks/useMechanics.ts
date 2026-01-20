import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
import { DEMO_MECHANIC_PROFILE, getDemoMechanicServices } from '@/constants/demoData';
import type { MechanicProfile, MechanicService, Profile } from '@/types';

// Combined mechanic data from both tables
export interface MechanicData {
  profile: Profile;
  mechanic: MechanicProfile;
}

export function useMechanic(id: string) {
  return useQuery({
    queryKey: ['mechanic', id],
    queryFn: async () => {
      try {
        // Fetch profile data (name, phone, avatar)
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, phone, avatar_url, city, district')
          .eq('id', id)
          .single();

        if (profileError) {
          console.warn('Failed to fetch mechanic profile, using demo data:', profileError.message);
          return {
            profile: DEMO_MECHANIC_PROFILE.profiles,
            mechanic: DEMO_MECHANIC_PROFILE,
          };
        }

        // Fetch mechanic-specific data
        const { data: mechanicData, error: mechanicError } = await supabase
          .from('mechanic_profiles')
          .select('*')
          .eq('id', id)
          .single();

        if (mechanicError) {
          console.warn('Failed to fetch mechanic data, using demo data:', mechanicError.message);
          return {
            profile: profileData as Profile,
            mechanic: DEMO_MECHANIC_PROFILE,
          };
        }

        return {
          profile: profileData as Profile,
          mechanic: mechanicData as MechanicProfile,
        };
      } catch (err) {
        console.warn('Network error fetching mechanic, using demo data:', err);
        return {
          profile: DEMO_MECHANIC_PROFILE.profiles,
          mechanic: DEMO_MECHANIC_PROFILE,
        };
      }
    },
    enabled: !!id,
    retry: false,
  });
}

export function useMechanicServices(mechanicId: string) {
  return useQuery({
    queryKey: ['mechanic', mechanicId, 'services'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('mechanic_services')
          .select(`
            *,
            service_categories (
              id,
              name,
              icon
            )
          `)
          .eq('mechanic_id', mechanicId)
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Failed to fetch mechanic services, using demo data:', error.message);
          return getDemoMechanicServices(mechanicId);
        }

        if (!data || data.length === 0) {
          return getDemoMechanicServices(mechanicId);
        }

        return data as MechanicService[];
      } catch (err) {
        console.warn('Network error fetching mechanic services, using demo data:', err);
        return getDemoMechanicServices(mechanicId);
      }
    },
    enabled: !!mechanicId,
    retry: false,
  });
}
