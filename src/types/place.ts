export type AccessibilityStatus = 'accessible' | 'partially_accessible' | 'not_accessible' | 'unknown';

export type RestroomAccessibility = 'none' | 'partial' | 'full';

export type LevelSetting = 'low' | 'medium' | 'high';

export type DataSource = 'user' | 'manual' | 'osm';

export interface Place {
  id: string;
  name: string;
  name_local?: string;
  category: string;
  latitude: number;
  longitude: number;
  address?: string;
  
  // Accessibility attributes
  ramp_present: boolean;
  step_free_entrance: boolean;
  accessible_restroom: RestroomAccessibility;
  tactile_paving: boolean;
  audio_signage: boolean;
  braille_signage: boolean;
  lighting_level: LevelSetting;
  noise_level: LevelSetting;
  staff_assistance_available: boolean;
  
  // Metadata
  notes?: string;
  photo_url?: string | null;
  accessibility_status: AccessibilityStatus;
  updated_at: string;
  source: DataSource;
}

export interface PlaceFilters {
  ramp_present?: boolean;
  step_free_entrance?: boolean;
  accessible_restroom?: RestroomAccessibility[];
  tactile_paving?: boolean;
  audio_signage?: boolean;
  braille_signage?: boolean;
  staff_assistance_available?: boolean;
  accessibility_status?: AccessibilityStatus[];
  category?: string[];
}

// Category mapping for display
export const categoryLabels: Record<string, string> = {
  railway_station: '🚂 Railway Station',
  metro_station: '🚇 Metro Station',
  monument: '🏛️ Monument',
  hospital: '🏥 Hospital',
  bank: '🏦 Bank',
  public_space: '🌳 Public Space',
  religious: '🛕 Religious',
  govt_office: '🏢 Government Office',
  sports: '🏟️ Sports',
  transport: '🚗 Transport',
  shopping: '🛒 Shopping',
  museum: '🎨 Museum',
  market: '🛍️ Market',
  school: '🎓 School/College',
  cultural: '🎭 Cultural',
  airport: '✈️ Airport',
  park: '🌲 Park',
  library: '📚 Library',
  business: '💼 Business',
  neighborhood: '🏘️ Neighborhood',
};

export const accessibilityStatusLabels: Record<AccessibilityStatus, string> = {
  accessible: 'Accessible',
  partially_accessible: 'Partially Accessible',
  not_accessible: 'Not Accessible',
  unknown: 'Unknown',
};

export const accessibilityStatusColors: Record<AccessibilityStatus, string> = {
  accessible: '#22c55e',
  partially_accessible: '#eab308',
  not_accessible: '#ef4444',
  unknown: '#9ca3af',
};
