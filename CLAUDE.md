# Fix My Ride Georgia - Mobile App Development Guide

## Quick Reference

```
Project: Fix My Ride Georgia Mobile
Tech Stack: React Native + Expo SDK 54 + TypeScript + Supabase
Current Phase: 6 - Testing & Polish
Last Updated: 2026-01-12
Last Session: Phase 5 Complete - Fuel Module
```

---

## Session Workflow

### Before Starting a Session
1. Read this file completely
2. Check current phase and pending tasks
3. Review "Next Session Should" section
4. Continue from where last session stopped

### During Session
1. Mark tasks as `[x]` when completed
2. Add notes in "Session Notes" if needed
3. Update "Current Progress" percentage

### After Session / Before Closing
**IMPORTANT: Always update this file before ending session!**

1. Mark completed tasks with `[x]`
2. Update "Last Updated" date
3. Update "Current Phase" if changed
4. Fill "Last Session Summary"
5. Write "Next Session Should" instructions
6. Add any blockers or issues found

---

## Project Status

### Current Progress: 85%

### Phase Status
| Phase | Name | Status | Progress |
|-------|------|--------|----------|
| 1 | Foundation Setup | `COMPLETED` | 100% |
| 2 | UI Components | `COMPLETED` | 100% |
| 3 | Services Module | `COMPLETED` | 100% |
| 4 | Map Module | `COMPLETED` | 100% |
| 5 | Fuel Module | `COMPLETED` | 100% |
| 6 | Testing & Polish | `NOT_STARTED` | 0% |

---

## Implementation Tasks

### Phase 1: Foundation Setup

#### 1.1 Project Initialization
- [x] Create Expo project with TypeScript template
- [x] Configure `app.json` (name, slug, version, icons, permissions)
- [x] Setup `.gitignore` properly
- [x] Initialize git repository

#### 1.2 Dependencies Installation
- [x] Install all dependencies via package.json
  - expo-router, react-native-screens, react-native-safe-area-context
  - react-native-paper, react-native-vector-icons
  - @tanstack/react-query, @supabase/supabase-js
  - react-native-maps, expo-location
  - expo-linking, expo-image, expo-constants, expo-status-bar
  - react-hook-form, zod, @hookform/resolvers, date-fns
  - react-native-reanimated, react-native-gesture-handler
  - @gorhom/bottom-sheet

#### 1.3 Folder Structure
- [x] Create folder structure:
  ```
  app/
  ├── (tabs)/
  │   ├── _layout.tsx
  │   ├── index.tsx
  │   ├── map.tsx
  │   └── fuel.tsx
  ├── service/[id].tsx
  ├── category/[slug].tsx
  ├── mechanic/[id].tsx
  ├── laundry/[id].tsx
  ├── drive/[id].tsx
  └── _layout.tsx
  ```
- [x] Create components folder structure (ui, services, map, fuel, common)
- [x] Create hooks folder
- [x] Create services folder
- [x] Create types folder
- [x] Create utils folder
- [x] Create constants folder
- [x] Create providers folder

#### 1.4 Configuration Files
- [x] Setup `tsconfig.json` with path aliases (@components, @hooks, @services, etc.)
- [x] Configure `babel.config.js` with reanimated plugin
- [x] Create `.env.example` with required environment variables

#### 1.5 Supabase Setup
- [x] Create `services/supabase.ts` with client configuration
- [x] Add environment variables template (`.env.example`)

#### 1.6 React Query Setup
- [x] Create `providers/QueryProvider.tsx`
- [x] Wrap app in QueryClientProvider (in _layout.tsx)

#### 1.7 Navigation Setup
- [x] Configure root `_layout.tsx` with Stack navigator
- [x] Configure tabs `_layout.tsx` with bottom navigation
- [x] Setup tab icons and labels (Georgian)
- [x] Create placeholder screens for all routes

#### 1.8 Design System
- [x] Create `constants/colors.ts` with full color palette
- [x] Create `constants/spacing.ts` with typography and spacing
- [x] Create `constants/mapConfig.ts` with Georgia/Tbilisi regions
- [x] Create `types/index.ts` with all TypeScript interfaces

---

### Phase 2: UI Components

#### 2.1 Base Components
- [x] Create `components/ui/Button.tsx`
  - Variants: primary, secondary, outline, ghost
  - Sizes: sm, md, lg
  - Loading state, icon support
- [x] Create `components/ui/Card.tsx`
  - Pressable option, padding variants, shadow
- [x] Create `components/ui/Badge.tsx`
  - Variants: default, primary, success, warning, error
  - Sizes: sm, md
- [x] Create `components/ui/Input.tsx`
  - Left/right icons, error state, label
- [x] Create `components/ui/Skeleton.tsx`
  - Animated loading placeholder
  - SkeletonText, SkeletonCard, SkeletonAvatar variants
- [x] Create `components/ui/Avatar.tsx`
  - Image, initials, or icon fallback
  - Sizes: xs, sm, md, lg, xl
- [x] Create `components/ui/index.ts` (barrel export)

#### 2.2 Common Components
- [x] Create `components/common/SearchBar.tsx`
  - Search icon, clear button, submit handling
- [x] Create `components/common/EmptyState.tsx`
  - Icon, title, description, action button
- [x] Create `components/common/ErrorState.tsx`
  - Georgian error messages, retry button
- [x] Create `components/common/LoadingState.tsx`
  - LoadingState and LoadingOverlay variants
- [x] Create `components/common/index.ts` (barrel export)

#### 2.3 Types (COMPLETED in Phase 1)
- [x] Create `types/index.ts` with all interfaces:
  - ServiceCategory
  - MechanicService
  - MechanicProfile
  - Laundry
  - Drive
  - FuelImporter
  - City, District
  - Filter types
  - Map types

---

### Phase 3: Services Module

#### 3.1 Data Hooks
- [x] Create `hooks/useCategories.ts` - Categories list + by slug
- [x] Create `hooks/useServices.ts` - Services list with filters + infinite
- [x] Create `hooks/useService.ts` (single service) - Included in useServices
- [x] Create `hooks/useMechanics.ts` - Mechanic profile + services
- [x] Create `hooks/useCities.ts` - Cities list
- [x] Create `hooks/useDistricts.ts` - Districts by city (included in useCities)
- [x] Create `hooks/index.ts` - Barrel export

#### 3.2 Service Components
- [x] Create `components/services/CategoryCard.tsx` - With icons and colors
- [x] Create `components/services/CategoryGrid.tsx` - 2-column grid
- [x] Create `components/services/ServiceCard.tsx` - Image, rating, price
- [x] Create `components/services/ServiceList.tsx` - With infinite scroll
- [x] Create `components/services/ServiceFilters.tsx` - City/district modals
- [x] Create `components/services/index.ts` - Barrel export

#### 3.3 Service Screens
- [x] Implement `app/(tabs)/index.tsx` - Categories home with real data
- [x] Implement `app/category/[slug].tsx` - Services list with filters
- [x] Implement `app/service/[id].tsx` - Full service detail page
  - Image gallery, rating, price, description
  - Address with maps button
  - Mechanic card
  - Call & share buttons

#### 3.4 Utility Functions
- [x] Create `utils/phoneHelpers.ts` - Phone call + format
- [x] Create `utils/mapHelpers.ts` - Open in maps (Google/Apple)
- [x] Create `utils/shareHelpers.ts` - Share service/laundry/drive
- [x] Create `utils/formatters.ts` - Price, rating, time, date
- [x] Create `utils/index.ts` - Barrel export

---

### Phase 4: Map Module

#### 4.1 Map Setup
- [x] Create `constants/mapConfig.ts` (COMPLETED in Phase 1)
  - Initial region (Georgia)
  - Tbilisi center
  - Marker colors per category
- [x] Create `hooks/useLocation.ts`

#### 4.2 Map Components
- [x] Create `components/map/CustomMarker.tsx`
- [x] Create `components/map/MapBottomSheet.tsx`
- [x] Create `components/map/MapSegmentedTabs.tsx`
- [x] Create `components/map/index.ts` (barrel export)

#### 4.3 Additional Hooks
- [x] Create `hooks/useLaundries.ts` (list, single, map queries)
- [x] Create `hooks/useDrives.ts` (list, single, map queries)

#### 4.4 Map Screens
- [x] Implement `app/(tabs)/map.tsx` - Main map with markers
  - MapView with services/laundries/drives markers
  - Segmented tabs to switch between types
  - Bottom sheet with item list
  - My location button
  - Marker selection and animation
- [x] Implement `app/laundry/[id].tsx` - Full laundry detail
  - Image gallery, rating, working hours
  - Address with maps integration
  - Phone call & share buttons
- [x] Implement `app/drive/[id].tsx` - Full drive detail
  - Image gallery, description
  - Address with maps integration
  - Phone call & share buttons

---

### Phase 5: Fuel Module

#### 5.1 Fuel Data
- [x] Create `hooks/useFuelImporters.ts`
  - useFuelImporters hook for all importers
  - useCheapestFuelPrices hook for price comparison

#### 5.2 Fuel Components
- [x] Create `components/fuel/FuelPriceCard.tsx`
  - Importer logo and name
  - All fuel types with prices
  - Price comparison badges
- [x] Create `components/fuel/FuelImporterList.tsx`
  - FlatList with refresh control
  - Loading, error, empty states
- [x] Create `components/fuel/PriceComparisonBadge.tsx`
  - "ყველაზე იაფი" badge for cheapest
  - Price difference badge for others

#### 5.3 Fuel Screen
- [x] Implement `app/(tabs)/fuel.tsx` - Fuel prices (with real data)
  - Header with icon and title
  - Info banner
  - Importer list with price comparison

---

### Phase 6: Testing & Polish

#### 6.1 Testing
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Test on physical iOS device
- [ ] Test on physical Android device
- [ ] Test all navigation flows
- [ ] Test phone call integration
- [ ] Test maps integration
- [ ] Test share functionality
- [ ] Test location permissions

#### 6.2 Performance
- [ ] Optimize images with expo-image
- [ ] Implement list virtualization
- [ ] Add loading skeletons
- [ ] Optimize React Query caching

#### 6.3 Polish
- [ ] Add haptic feedback
- [ ] Add smooth animations
- [ ] Handle edge cases
- [ ] Add proper error messages (Georgian)

#### 6.4 Build
- [ ] Configure app icons
- [ ] Configure splash screen
- [ ] Build for iOS (eas build)
- [ ] Build for Android (eas build)
- [ ] Test production builds

---

## Technical Specifications

### Supabase Tables Used
```
- service_categories (id, name, description, icon, slug)
- mechanic_services (id, mechanic_id, category_id, name, description, price_from, price_to, ...)
- mechanic_profiles (id, user_id, full_name, phone, experience_years, ...)
- laundries (id, name, description, city, district, address, latitude, longitude, phone, ...)
- drives (id, name, description, city, district, address, latitude, longitude, phone, ...)
- fuel_importers (id, name, logo, regular_ron_93_price, premium_ron_96_price, super_ron_98_price, ...)
- cities (id, name)
- districts (id, name, city_id)
```

### Environment Variables
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Key Commands
```bash
# Start development
npx expo start

# Start with clear cache
npx expo start --clear

# Run on iOS
npx expo run:ios

# Run on Android
npx expo run:android

# Type check
npm run typecheck

# Build for production
eas build --platform all

# Update OTA
eas update
```

---

## Session Log

### Session 1 - 2026-01-12
**Focus:** Initial planning and CLAUDE.md setup
**Completed:**
- [x] Created CLAUDE.md with workflow
- [x] Reviewed MOBILE_APP_PLAN.md

**Notes:**
- Project folder exists but is empty
- Need to start with Expo initialization

---

### Session 2 - 2026-01-12
**Focus:** Phase 1 - Foundation Setup
**Completed:**
- [x] Created Expo project with TypeScript (SDK 54)
- [x] Configured app.json with proper app details, permissions
- [x] Installed all dependencies
- [x] Created complete folder structure
- [x] Setup tsconfig.json with path aliases
- [x] Created babel.config.js
- [x] Created Supabase client
- [x] Created React Query provider
- [x] Created root layout with providers
- [x] Created tab navigation with 3 tabs
- [x] Created placeholder screens for all routes
- [x] Created design system (colors, spacing, typography)
- [x] Created all TypeScript types
- [x] Created map configuration

**Notes:**
- Using Expo SDK 54 (latest)
- TypeScript type checking passes
- App is ready to run with `npx expo start`
- Need to add .env file with Supabase credentials before testing data

---

### Session 3 - 2026-01-12
**Focus:** Phase 2 - UI Components
**Completed:**
- [x] Created Button component (variants, sizes, loading, icons)
- [x] Created Card component (pressable, padding, shadow)
- [x] Created Badge component (5 variants, 2 sizes)
- [x] Created Input component (icons, error, label)
- [x] Created Skeleton component (animated, 3 variants)
- [x] Created Avatar component (image/initials/icon, 5 sizes)
- [x] Created EmptyState component
- [x] Created ErrorState component (Georgian text)
- [x] Created LoadingState component (+ overlay variant)
- [x] Created SearchBar component
- [x] Created barrel export files

**Notes:**
- All components use design system constants
- TypeScript type checking passes
- Components ready for use in screens

---

### Session 4 - 2026-01-12
**Focus:** Phase 3 - Services Module
**Completed:**
- [x] Created data hooks (useCategories, useServices, useCities, useMechanics)
- [x] Created utility functions (phone, maps, share, formatters)
- [x] Created CategoryCard with icons and colors
- [x] Created CategoryGrid with 2-column layout
- [x] Created ServiceCard with image, rating, price
- [x] Created ServiceList with infinite scroll support
- [x] Created ServiceFilters with city/district modals
- [x] Implemented Services home screen with categories
- [x] Implemented Category services screen with filters
- [x] Implemented Service detail screen with full functionality:
  - Image gallery
  - Rating & reviews
  - Price & estimated time
  - Description
  - Address with maps integration
  - Mechanic card
  - Call & share buttons

**Notes:**
- All hooks use React Query with proper caching
- Services connect to Supabase (needs .env credentials)
- TypeScript type checking passes
- Georgian text throughout

---

### Session 5 - 2026-01-12
**Focus:** Phase 4 - Map Module
**Completed:**
- [x] Created useLocation hook (permission request, getCurrentLocation, watchLocation)
- [x] Created useLaundries hook (list, single, forMap queries)
- [x] Created useDrives hook (list, single, forMap queries)
- [x] Created CustomMarker component with category colors and icons
- [x] Created MapSegmentedTabs for switching between services/laundries/drives
- [x] Created MapBottomSheet with item list using @gorhom/bottom-sheet
- [x] Implemented full Map screen with:
  - MapView with markers for services, laundries, drives
  - Segmented tabs to switch between types
  - Bottom sheet with scrollable item list
  - My location button with loading state
  - Marker selection with map animation
- [x] Implemented Laundry detail screen with:
  - Image gallery, rating, working hours
  - Address with maps integration
  - Phone call & share functionality
- [x] Implemented Drive detail screen with:
  - Image gallery, description
  - Address with maps integration
  - Phone call & share functionality

**Notes:**
- Map uses react-native-maps with custom markers
- Bottom sheet uses @gorhom/bottom-sheet
- All screens have Georgian text
- TypeScript type checking passes

---

### Session 6 - 2026-01-12
**Focus:** Phase 5 - Fuel Module + Bug Fixes
**Completed:**
- [x] Fixed category page navigation (slug → id)
- [x] Fixed city/district filters to use string-based values from mechanic_services
- [x] Created useServiceCities and useServiceDistricts hooks
- [x] Created useFuelImporters hook with price comparison
- [x] Created FuelPriceCard component with price display
- [x] Created PriceComparisonBadge component
- [x] Created FuelImporterList component
- [x] Implemented Fuel screen with real data

**Bug Fixes:**
- Fixed category/[slug] → category/[id] (database has no slug column)
- Fixed city filters (cities table was empty, now using unique values from mechanic_services)
- Updated ServiceFilters type from cityId/districtId to city/district strings

**Notes:**
- All fuel components show price comparison
- "ყველაზე იაფი" badge for cheapest prices
- Percentage difference shown for more expensive options
- TypeScript type checking passes

---

## Last Session Summary
```
Date: 2026-01-12
Phase: 5 - Fuel Module (COMPLETED)
Tasks Completed: All Phase 5 tasks
Files Created: 5 files (hook, 3 components, screen)
TypeScript: Passes type check
Blockers: None
```

## Next Session Should
```
1. Start Phase 6: Testing & Polish
   - Test on iOS and Android simulators/emulators
   - Test on physical devices
   - Test all navigation flows
   - Test phone call, maps, share functionality
2. Performance optimization
   - Optimize images
   - Add loading skeletons where missing
3. Polish and edge cases
   - Add haptic feedback
   - Add animations
   - Handle edge cases
4. Build preparation
   - Configure app icons and splash screen
   - Create production builds
```

---

## Important Notes

### Georgian Text
- All UI labels should be in Georgian
- Tab names: სერვისები, რუკა, საწვავი
- Button texts: დარეკვა, მისამართი, გაზიარება

### Design Consistency
- Follow web app design language
- Use same color palette
- Maintain similar UX patterns

### Offline Handling
- Show cached data when offline
- Display offline indicator
- Queue actions for sync

---

## Blockers & Issues

_None currently_

---

## Created Files Reference

### Phase 1 Files
```
app/
├── _layout.tsx              # Root layout with providers
├── (tabs)/
│   ├── _layout.tsx          # Tab navigation
│   ├── index.tsx            # Services tab (placeholder)
│   ├── map.tsx              # Map tab (placeholder)
│   └── fuel.tsx             # Fuel tab (placeholder)
├── service/[id].tsx         # Service detail (placeholder)
├── category/[slug].tsx      # Category services (placeholder)
├── mechanic/[id].tsx        # Mechanic profile (placeholder)
├── laundry/[id].tsx         # Laundry detail (placeholder)
└── drive/[id].tsx           # Drive detail (placeholder)

constants/
├── index.ts                 # Barrel export
├── colors.ts                # Color palette
├── spacing.ts               # Spacing, typography, border radius
└── mapConfig.ts             # Map regions and config

types/
└── index.ts                 # All TypeScript interfaces

services/
└── supabase.ts              # Supabase client

providers/
└── QueryProvider.tsx        # React Query provider

Configuration:
├── app.json                 # Expo config
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── babel.config.js          # Babel config
└── .env.example             # Environment variables template
```

### Phase 2 Files
```
components/ui/
├── index.ts                 # Barrel export
├── Button.tsx               # Button with variants, sizes, loading
├── Card.tsx                 # Card with press, padding, shadow
├── Badge.tsx                # Badge with variants
├── Input.tsx                # Input with icons, error
├── Skeleton.tsx             # Animated skeleton loaders
└── Avatar.tsx               # Avatar with image/initials/icon

components/common/
├── index.ts                 # Barrel export
├── EmptyState.tsx           # Empty state with icon, action
├── ErrorState.tsx           # Error state with retry (Georgian)
├── LoadingState.tsx         # Loading spinner/overlay
└── SearchBar.tsx            # Search input with clear
```

### Phase 3 Files
```
hooks/
├── index.ts                 # Barrel export
├── useCategories.ts         # Categories list + by slug
├── useServices.ts           # Services list, single, infinite, map
├── useCities.ts             # Cities + districts
└── useMechanics.ts          # Mechanic profile + services

utils/
├── index.ts                 # Barrel export
├── phoneHelpers.ts          # Call phone, format number
├── mapHelpers.ts            # Open in maps, format address
├── shareHelpers.ts          # Share service/laundry/drive
└── formatters.ts            # Price, rating, time, date

components/services/
├── index.ts                 # Barrel export
├── CategoryCard.tsx         # Category with icon and color
├── CategoryGrid.tsx         # 2-column category grid
├── ServiceCard.tsx          # Service card with image
├── ServiceList.tsx          # Services list with infinite
└── ServiceFilters.tsx       # City/district filter modals

Updated screens:
├── app/(tabs)/index.tsx     # Categories home
├── app/category/[slug].tsx  # Category services with filters
└── app/service/[id].tsx     # Full service detail
```

### Phase 4 Files
```
hooks/
├── useLocation.ts           # Location permission + current location
├── useLaundries.ts          # Laundries list, single, forMap
└── useDrives.ts             # Drives list, single, forMap

components/map/
├── index.ts                 # Barrel export
├── CustomMarker.tsx         # Map marker with category colors
├── MapSegmentedTabs.tsx     # Service/Laundry/Drive tabs
└── MapBottomSheet.tsx       # Bottom sheet with item list

Updated screens:
├── app/(tabs)/map.tsx       # Full map with markers and bottom sheet
├── app/laundry/[id].tsx     # Full laundry detail
└── app/drive/[id].tsx       # Full drive detail
```

### Phase 5 Files
```
hooks/
└── useFuelImporters.ts      # Fuel importers + cheapest prices

components/fuel/
├── index.ts                 # Barrel export
├── FuelPriceCard.tsx        # Importer card with prices
├── FuelImporterList.tsx     # List with refresh
└── PriceComparisonBadge.tsx # Cheapest/difference badge

Updated screens:
└── app/(tabs)/fuel.tsx      # Full fuel prices screen
```

---

_Last updated by Claude on 2026-01-12_
