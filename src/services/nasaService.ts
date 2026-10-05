import { 
  AsteroidNeo, DonkiResponse, IssTelemetry, EarthEvent, 
  SatelliteBS1, MarsData, NasaStatusResponse 
} from '../types/mission';

class NasaService {
  private issData: IssTelemetry | null = null;
  private donkiData: DonkiResponse | null = null;
  private neoData: AsteroidNeo[] = [];
  private earthEvents: EarthEvent[] = [];
  private marsData: MarsData | null = null;
  private bs1Data: SatelliteBS1 | null = null;
  private feedStatus: NasaStatusResponse | null = null;

  private isSyncing: boolean = false;
  private listeners: Array<() => void> = [];
  private timer: any = null;

  constructor() {
    this.startAutoSync();
  }

  public subscribe(callback: () => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  public async startAutoSync() {
    await this.fetchAllFeeds();
    if (!this.timer) {
      // Sync every 12 seconds
      this.timer = setInterval(() => {
        this.fetchIss();
      }, 12000);
    }
  }

  public async fetchAllFeeds() {
    if (this.isSyncing) return;
    this.isSyncing = true;
    this.notify();

    try {
      await Promise.allSettled([
        this.fetchIss(),
        this.fetchDonki(),
        this.fetchNeo(),
        this.fetchEarthEvents(),
        this.fetchMars(),
        this.fetchBs1(),
        this.fetchStatus(),
      ]);
    } finally {
      this.isSyncing = false;
      this.notify();
    }
  }

  public async fetchIss(): Promise<IssTelemetry | null> {
    try {
      const resp = await fetch('/api/nasa/iss');
      if (resp.ok) {
        this.issData = await resp.json();
        this.notify();
      }
    } catch (_e) {}
    return this.issData;
  }

  public async fetchDonki(): Promise<DonkiResponse | null> {
    try {
      const resp = await fetch('/api/nasa/donki');
      if (resp.ok) {
        this.donkiData = await resp.json();
        this.notify();
      }
    } catch (_e) {}
    return this.donkiData;
  }

  public async fetchNeo(): Promise<AsteroidNeo[]> {
    try {
      const resp = await fetch('/api/nasa/neo');
      if (resp.ok) {
        const data = await resp.json();
        this.neoData = data.asteroids || [];
        this.notify();
      }
    } catch (_e) {}
    return this.neoData;
  }

  public async fetchEarthEvents(): Promise<EarthEvent[]> {
    try {
      const resp = await fetch('/api/nasa/earth-events');
      if (resp.ok) {
        const data = await resp.json();
        this.earthEvents = data.events || [];
        this.notify();
      }
    } catch (_e) {}
    return this.earthEvents;
  }

  public async fetchMars(): Promise<MarsData | null> {
    try {
      const resp = await fetch('/api/nasa/mars');
      if (resp.ok) {
        this.marsData = await resp.json();
        this.notify();
      }
    } catch (_e) {}
    return this.marsData;
  }

  public async fetchBs1(): Promise<SatelliteBS1 | null> {
    try {
      const resp = await fetch('/api/bangladesh/satellite');
      if (resp.ok) {
        this.bs1Data = await resp.json();
        this.notify();
      }
    } catch (_e) {}
    return this.bs1Data;
  }

  public async fetchStatus(): Promise<NasaStatusResponse | null> {
    try {
      const resp = await fetch('/api/nasa/status');
      if (resp.ok) {
        this.feedStatus = await resp.json();
        this.notify();
      }
    } catch (_e) {}
    return this.feedStatus;
  }

  // Getters
  public getIss() { return this.issData; }
  public getDonki() { return this.donkiData; }
  public getNeo() { return this.neoData; }
  public getEarthEvents() { return this.earthEvents; }
  public getMars() { return this.marsData; }
  public getBs1() { return this.bs1Data; }
  public getStatus() { return this.feedStatus; }
  public getIsSyncing() { return this.isSyncing; }

  // Game Influence: Calculate dynamic solar radiation hazard level
  public getDynamicRadiationRisk() {
    const kp = this.donkiData?.current_kp_index || 6.3;
    const speed = this.donkiData?.current_solar_wind_speed_km_s || 940;

    let level: 'NOMINAL' | 'ELEVATED' | 'HIGH' | 'CRITICAL' = 'NOMINAL';
    let shieldDecayRate = 1.0;
    let evaMaxDurationMins = 45;

    if (kp >= 7) {
      level = 'CRITICAL';
      shieldDecayRate = 2.4;
      evaMaxDurationMins = 8;
    } else if (kp >= 5) {
      level = 'HIGH';
      shieldDecayRate = 1.8;
      evaMaxDurationMins = 18;
    } else if (kp >= 3.5) {
      level = 'ELEVATED';
      shieldDecayRate = 1.3;
      evaMaxDurationMins = 30;
    }

    return {
      level,
      kp,
      solarWindSpeed: speed,
      shieldDecayRate,
      evaMaxDurationMins,
      flareWarning: this.donkiData?.events?.[0]?.classification || 'Moderate Solar Flux',
    };
  }
}

export const nasaService = new NasaService();
