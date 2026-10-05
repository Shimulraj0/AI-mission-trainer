export type Language = 'en' | 'bn' | 'es' | 'fr' | 'de' | 'ja' | 'ar' | 'hi' | 'zh';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English (US/UK)', flag: '🇺🇸', region: 'Global' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা (বাংলাদেশ)', flag: '🇧🇩', region: 'Bangladesh & South Asia' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', region: 'Spain & Latin America' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', region: 'France & Francophonie' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', region: 'Germany & ESA' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', region: 'Japan & JAXA' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇦🇪', region: 'Arabian Peninsula' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', region: 'India & ISRO' },
  { code: 'zh', name: 'Chinese', nativeName: '中文 (简体)', flag: '🇨🇳', region: 'China & East Asia' },
];

export interface CadetProfile {
  id: string;
  name: string;
  callsign: string;
  rank: string;
  rankBn: string;
  rankLevel: number;
  exp: number;
  completedMissions: string[];
  badges: string[];
  teeIntegrityScore: number;
  joinedDate: string;
}

export interface TeeState {
  isHardwareEnclaveActive: boolean;
  pcr0: string; // Enclave Boot Code Hash
  pcr1: string; // Security Policy Hash
  pcr2: string; // Cadet Identity Hash
  pcr3: string; // Real-time Mission State Hash
  lastAttestationTime: string;
  tamperCount: number;
  lastTamperDetected: boolean;
  tamperMessage?: string;
  enclaveKeyId: string;
}

export interface AsteroidNeo {
  id: string;
  name: string;
  estimated_diameter_meters: { min: number; max: number };
  is_potentially_hazardous: boolean;
  close_approach_data: {
    close_approach_date: string;
    relative_velocity_km_s: number;
    miss_distance_km: number;
    orbiting_body: string;
  };
  albedo: number;
  composition: string;
}

export interface MarsData {
  rover: string;
  sol: number;
  location: string;
  temperature_celsius: number;
  atmospheric_pressure_pa: number;
  wind_speed_ms: number;
  dust_opacity_tau: number;
  sample_tubes_collected: number;
  total_sample_tubes: number;
  surface_radiation_msv_day: number;
  features: Array<{
    id: string;
    name: string;
    hazard_level: string;
    science_value: number;
  }>;
  last_sync?: string;
}

export interface DonkiEvent {
  activityID: string;
  catalog: string;
  startTime: string;
  sourceLocation: string;
  cmeSpeed_km_s: number;
  halfAngle_deg: number;
  kp_index: number;
  classification: string;
  geomagnetic_storm_warning: string;
  radiation_risk: string;
}

export interface DonkiResponse {
  source: string;
  events: DonkiEvent[];
  current_kp_index?: number;
  current_solar_wind_speed_km_s?: number;
  last_sync?: string;
}

export interface IssBangladeshTracking {
  distance_km: number;
  status: 'OVERHEAD_PASS' | 'APPROACHING_BAY_OF_BENGAL' | 'BEYOND_HORIZON';
  status_bn: string;
  line_of_sight: boolean;
  optical_visibility: string;
  next_direct_pass_mins: number;
}

export interface IssTelemetry {
  latitude: number;
  longitude: number;
  altitude_km: number;
  velocity_km_h: number;
  timestamp: number;
  is_live: boolean;
  bangladesh_tracking?: IssBangladeshTracking;
  illumination?: 'DAYLIGHT' | 'ORBITAL_NIGHT';
  last_sync?: string;
}

export interface EarthEvent {
  id: string;
  title: string;
  title_bn: string;
  category: string;
  category_bn: string;
  date: string;
  coordinates: [number, number];
  severity: string;
  impact_zone: string;
  satellite_mission: string;
  spectral_channels: string[];
  cloud_top_temp_c?: number;
  pressure_hpa?: number;
  flood_coverage_km2?: number;
  chlorophyll_mg_m3?: number;
}

export interface NasaFeedInfo {
  name: string;
  status: 'ONLINE' | 'STANDBY' | 'SYNCED';
  refresh_interval_s: number;
  latency_ms: number;
}

export interface NasaStatusResponse {
  status: string;
  feeds: Record<string, NasaFeedInfo>;
  tee_security_seal: string;
  timestamp: string;
}

export interface SatelliteBS1 {
  name: string;
  name_bn: string;
  orbital_slot: string;
  orbit_type: string;
  altitude_km: number;
  operator: string;
  launch_date: string;
  transponders: {
    ku_band: { total: number; active: number; beam: string };
    c_band: { total: number; active: number; beam: string };
  };
  ground_stations: Array<{
    name: string;
    location: string;
    coordinates: string;
    antenna_diameter_m: number;
    status: string;
    uplink_snr_db: number;
    latency_ms: number;
  }>;
  last_sync?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'cadet' | 'orion' | 'tee_enclave';
  text: string;
  timestamp: string;
  thinkingSteps?: string[];
}
