import type { ServiceCategory, MechanicService, MechanicProfile, Profile, Laundry, Drive, FuelImporter } from '@/types';

// Demo categories for fallback when Supabase is unavailable
export const DEMO_CATEGORIES: ServiceCategory[] = [
  {
    id: 1,
    name: 'ძრავი',
    description: 'ძრავის შეკეთება და მომსახურება',
    icon: 'engine',
    slug: 'engine',
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'ტრანსმისია',
    description: 'გადაცემათა კოლოფის შეკეთება',
    icon: 'cog',
    slug: 'transmission',
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'მუხრუჭები',
    description: 'სამუხრუჭე სისტემის მომსახურება',
    icon: 'disc',
    slug: 'brakes',
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'ელექტრონიკა',
    description: 'ავტომობილის ელექტრონიკის შეკეთება',
    icon: 'flash',
    slug: 'electronics',
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: 'საბურავები',
    description: 'საბურავების მომსახურება და გამოცვლა',
    icon: 'tire',
    slug: 'tires',
    created_at: new Date().toISOString(),
  },
  {
    id: 6,
    name: 'ზეთის გამოცვლა',
    description: 'ზეთის და ფილტრების გამოცვლა',
    icon: 'oil',
    slug: 'oil-change',
    created_at: new Date().toISOString(),
  },
  {
    id: 7,
    name: 'კონდიციონერი',
    description: 'კონდიციონერის მომსახურება',
    icon: 'snowflake',
    slug: 'ac',
    created_at: new Date().toISOString(),
  },
  {
    id: 8,
    name: 'დიაგნოსტიკა',
    description: 'კომპიუტერული დიაგნოსტიკა',
    icon: 'search',
    slug: 'diagnostics',
    created_at: new Date().toISOString(),
  },
];

// Demo cities for fallback
export const DEMO_CITIES: string[] = [
  'თბილისი',
  'ბათუმი',
  'ქუთაისი',
  'რუსთავი',
  'გორი',
  'ზუგდიდი',
  'ფოთი',
  'თელავი',
];

// Demo districts by city for fallback
export const DEMO_DISTRICTS: Record<string, string[]> = {
  'თბილისი': [
    'ვაკე',
    'საბურთალო',
    'დიდუბე',
    'გლდანი',
    'ნაძალადევი',
    'ისანი',
    'სამგორი',
    'ვარკეთილი',
    'კრწანისი',
    'მთაწმინდა',
  ],
  'ბათუმი': [
    'ძველი ბათუმი',
    'ახალი ბათუმი',
    'ხელვაჩაური',
  ],
  'ქუთაისი': [
    'ცენტრი',
    'ბალახვანი',
    'რიონი',
  ],
  'რუსთავი': [
    'ცენტრი',
    'მე-3 მიკრო',
    'მე-4 მიკრო',
  ],
};

// Demo mechanic profile for fallback
export const DEMO_MECHANIC_PROFILE: MechanicProfile & { profiles: Profile } = {
  id: 'demo-mechanic-1',
  description: 'პროფესიონალი მექანიკოსი 15 წლიანი გამოცდილებით. სპეციალიზაცია: ევროპული და იაპონური ავტომობილები.',
  specialization: 'ევროპული და იაპონური ავტომობილები',
  experience_years: 15,
  hourly_rate: 50,
  is_mobile: true,
  rating: 4.8,
  review_count: 124,
  working_hours: '09:00 - 19:00',
  accepts_card_payment: true,
  profiles: {
    id: 'demo-mechanic-1',
    full_name: 'გიორგი მექანიკოსი',
    phone: '+995599123456',
    avatar_url: null,
    city: 'თბილისი',
    district: 'საბურთალო',
  },
};

// Demo services for fallback
export const DEMO_SERVICES: MechanicService[] = [
  {
    id: 1,
    mechanic_id: 'demo-mechanic-1',
    category_id: 1,
    name: 'ძრავის კაპიტალური შეკეთება',
    description: 'სრული ძრავის აღდგენა და შეკეთება პროფესიონალი ოსტატების მიერ',
    price_from: 500,
    price_to: 2000,
    estimated_hours: 24,
    city: 'თბილისი',
    district: 'საბურთალო',
    address: 'ვაჟა-ფშაველას გამზირი 71',
    latitude: 41.7151,
    longitude: 44.7493,
    car_brands: ['BMW', 'Mercedes', 'Audi'],
    on_site_service: false,
    accepts_card_payment: true,
    accepts_cash_payment: true,
    photos: null,
    videos: null,
    rating: 4.8,
    review_count: 124,
    is_active: true,
    created_at: new Date().toISOString(),
    profiles: {
      id: 'demo-mechanic-1',
      full_name: 'გიორგი მექანიკოსი',
      phone: '+995599123456',
      avatar_url: null,
      city: 'თბილისი',
      district: 'საბურთალო',
    },
  },
  {
    id: 2,
    mechanic_id: 'demo-mechanic-2',
    category_id: 3,
    name: 'სამუხრუჭე სისტემის შეკეთება',
    description: 'მუხრუჭების შემოწმება და გამოცვლა',
    price_from: 80,
    price_to: 300,
    estimated_hours: 2,
    city: 'თბილისი',
    district: 'ვაკე',
    address: 'ჭავჭავაძის გამზირი 45',
    latitude: 41.7086,
    longitude: 44.7628,
    car_brands: null,
    on_site_service: true,
    accepts_card_payment: true,
    accepts_cash_payment: true,
    photos: null,
    videos: null,
    rating: 4.5,
    review_count: 89,
    is_active: true,
    created_at: new Date().toISOString(),
    profiles: {
      id: 'demo-mechanic-2',
      full_name: 'ავტო სერვისი',
      phone: '+995599654321',
      avatar_url: null,
      city: 'თბილისი',
      district: 'ვაკე',
    },
  },
  {
    id: 3,
    mechanic_id: 'demo-mechanic-1',
    category_id: 6,
    name: 'ზეთის გამოცვლა',
    description: 'ზეთის და ფილტრების გამოცვლა ყველა მარკის ავტომობილისთვის',
    price_from: 30,
    price_to: 80,
    estimated_hours: 1,
    city: 'თბილისი',
    district: 'დიდუბე',
    address: 'წერეთლის გამზირი 50',
    latitude: 41.7280,
    longitude: 44.7750,
    car_brands: null,
    on_site_service: true,
    accepts_card_payment: true,
    accepts_cash_payment: true,
    photos: null,
    videos: null,
    rating: 4.6,
    review_count: 210,
    is_active: true,
    created_at: new Date().toISOString(),
    profiles: {
      id: 'demo-mechanic-1',
      full_name: 'გიორგი მექანიკოსი',
      phone: '+995599123456',
      avatar_url: null,
      city: 'თბილისი',
      district: 'საბურთალო',
    },
  },
  {
    id: 4,
    mechanic_id: 'demo-mechanic-3',
    category_id: 8,
    name: 'კომპიუტერული დიაგნოსტიკა',
    description: 'ავტომობილის სრული კომპიუტერული დიაგნოსტიკა თანამედროვე აპარატურით',
    price_from: 20,
    price_to: 50,
    estimated_hours: 1,
    city: 'ბათუმი',
    district: 'ძველი ბათუმი',
    address: 'რუსთაველის 25',
    latitude: 41.6458,
    longitude: 41.6419,
    car_brands: null,
    on_site_service: false,
    accepts_card_payment: true,
    accepts_cash_payment: true,
    photos: null,
    videos: null,
    rating: 4.9,
    review_count: 56,
    is_active: true,
    created_at: new Date().toISOString(),
    profiles: {
      id: 'demo-mechanic-3',
      full_name: 'ბათუმი ავტო დიაგნოსტიკა',
      phone: '+995599999888',
      avatar_url: null,
      city: 'ბათუმი',
      district: 'ძველი ბათუმი',
    },
  },
];

// Demo laundries for fallback
export const DEMO_LAUNDRIES: Laundry[] = [
  {
    id: 1,
    name: 'ავტო სპა',
    description: 'პროფესიონალური ავტო რეცხვა',
    city: 'თბილისი',
    district: 'დიდუბე',
    address: 'წერეთლის გამზირი 116',
    latitude: 41.7327,
    longitude: 44.7890,
    phone: '+995599111222',
    working_hours: '09:00 - 21:00',
    photos: null,
    rating: 4.7,
    review_count: 256,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'კარვოშ',
    description: 'სწრაფი და ხარისხიანი რეცხვა',
    city: 'თბილისი',
    district: 'გლდანი',
    address: 'ხიზანიშვილის 18',
    latitude: 41.7645,
    longitude: 44.8234,
    phone: '+995599333444',
    working_hours: '08:00 - 22:00',
    photos: null,
    rating: 4.3,
    review_count: 128,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'ავტო რეცხვა პლუს',
    description: 'ხელით რეცხვა და პოლირება',
    city: 'თბილისი',
    district: 'ვაკე',
    address: 'ჭავჭავაძის 80',
    latitude: 41.7120,
    longitude: 44.7550,
    phone: '+995599444555',
    working_hours: '09:00 - 20:00',
    photos: null,
    rating: 4.5,
    review_count: 89,
    created_at: new Date().toISOString(),
  },
];

// Demo drives for fallback
export const DEMO_DRIVES: Drive[] = [
  {
    id: 1,
    name: 'ავტო ნაწილები - ვარკეთილი',
    description: 'ახალი და მეორადი ავტო ნაწილები',
    city: 'თბილისი',
    district: 'ვარკეთილი',
    address: 'ჯავახეთის 88',
    latitude: 41.6958,
    longitude: 44.8765,
    phone: '+995599555666',
    photos: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'იაპონური ავტო ნაწილები',
    description: 'იაპონური მანქანების ნაწილები',
    city: 'თბილისი',
    district: 'ისანი',
    address: 'ნავთლუღის 12',
    latitude: 41.6890,
    longitude: 44.8321,
    phone: '+995599777888',
    photos: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'ევროპული ავტო ნაწილები',
    description: 'BMW, Mercedes, Audi ნაწილები',
    city: 'თბილისი',
    district: 'საბურთალო',
    address: 'პეკინის 45',
    latitude: 41.7200,
    longitude: 44.7600,
    phone: '+995599888999',
    photos: null,
    created_at: new Date().toISOString(),
  },
];

// Demo fuel importers for fallback
export const DEMO_FUEL_IMPORTERS: FuelImporter[] = [
  {
    id: 1,
    name: 'SOCAR',
    logo: null,
    regular_ron_93_price: 2.79,
    premium_ron_96_price: 2.99,
    super_ron_98_price: 3.19,
    diesel_price: 2.89,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Gulf',
    logo: null,
    regular_ron_93_price: 2.75,
    premium_ron_96_price: 2.95,
    super_ron_98_price: 3.15,
    diesel_price: 2.85,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Rompetrol',
    logo: null,
    regular_ron_93_price: 2.77,
    premium_ron_96_price: 2.97,
    super_ron_98_price: 3.17,
    diesel_price: 2.87,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'Wissol',
    logo: null,
    regular_ron_93_price: 2.78,
    premium_ron_96_price: 2.98,
    super_ron_98_price: 3.18,
    diesel_price: 2.88,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Helper function to get demo services for map (only those with coordinates)
export function getDemoServicesForMap() {
  return DEMO_SERVICES
    .filter(s => s.latitude !== null && s.longitude !== null)
    .map(s => ({
      id: s.id,
      name: s.name,
      latitude: s.latitude,
      longitude: s.longitude,
      address: s.address,
      rating: s.rating,
      photos: s.photos,
      category_id: s.category_id,
    }));
}

// Helper function to get demo laundries for map (only those with coordinates)
export function getDemoLaundriesForMap() {
  return DEMO_LAUNDRIES
    .filter(l => l.latitude !== null && l.longitude !== null)
    .map(l => ({
      id: l.id,
      name: l.name,
      latitude: l.latitude,
      longitude: l.longitude,
      address: l.address,
      rating: l.rating,
      photos: l.photos,
    }));
}

// Helper function to get demo drives for map (only those with coordinates)
export function getDemoDrivesForMap() {
  return DEMO_DRIVES
    .filter(d => d.latitude !== null && d.longitude !== null)
    .map(d => ({
      id: d.id,
      name: d.name,
      latitude: d.latitude,
      longitude: d.longitude,
      address: d.address,
      photos: d.photos,
    }));
}

// Helper function to get demo mechanic services by mechanic id
export function getDemoMechanicServices(mechanicId: string) {
  return DEMO_SERVICES.filter(s => s.mechanic_id === mechanicId);
}
