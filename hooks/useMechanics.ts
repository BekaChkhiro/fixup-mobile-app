import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
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
      // Fetch profile data (name, phone, avatar)
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, phone, avatar_url, city, district')
        .eq('id', id)
        .single();

      if (profileError) {
        throw new Error(profileError.message);
      }

      // Fetch mechanic-specific data
      const { data: mechanicData, error: mechanicError } = await supabase
        .from('mechanic_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (mechanicError) {
        throw new Error(mechanicError.message);
      }

      return {
        profile: profileData as Profile,
        mechanic: mechanicData as MechanicProfile,
      };
    },
    enabled: !!id,
  });
}

export function useMechanicServices(mechanicId: string) {
  return useQuery({
    queryKey: ['mechanic', mechanicId, 'services'],
    queryFn: async () => {
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
        throw new Error(error.message);
      }

      return data as MechanicService[];
    },
    enabled: !!mechanicId,
  });
}
