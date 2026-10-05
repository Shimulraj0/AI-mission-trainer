// Localization Service for Junior Astronaut Mission Trainer (All Language Modes)
import { Language } from '../types/mission';

export const bnDigitsMap: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
  '.': '.',
  '-': '-',
  '+': '+',
  ':': ':',
  ',': ','
};

export const arDigitsMap: Record<string, string> = {
  '0': '٠',
  '1': '١',
  '2': '٢',
  '3': '٣',
  '4': '٤',
  '5': '٥',
  '6': '٦',
  '7': '٧',
  '8': '٨',
  '9': '٩',
};

export function formatNumber(val: number | string, isBengali: boolean, lang?: Language): string {
  const str = String(val);
  if (isBengali) {
    return str.split('').map(char => bnDigitsMap[char] || char).join('');
  }
  if (lang === 'ar') {
    return str.split('').map(char => arDigitsMap[char] || char).join('');
  }
  return str;
}

const en = {
  appTitle: "Junior Astronaut Mission Trainer",
  appSubtitle: "SPARRSO Academy & NASA Challenge Simulation",
  teeBadge: "TEE SECURE ENCLAVE ACTIVE",
  teeTooltip: "Hardware-isolated cryptographically verified state management",
  
  nav: {
    missionControl: "Mission Control",
    simulations: "Flight Sims",
    teeVault: "TEE Security Vault",
    flightDirector: "AI Flight Director",
    cadetProfile: "Cadet Profile"
  },

  settings: {
    title: "Mission Settings & Environment",
    subtitle: "Language mode, CLI theme variations, and audio configuration",
    languageTitle: "Mission Language Mode",
    languageDesc: "Switch telemetry, HUD interface, and mission instructions.",
    themeTitle: "OpenCode CLI Theme Variations",
    themeDesc: "Pick high-contrast developer terminal color palettes.",
    audioTitle: "Audio FX Synthesizer",
    audioDesc: "Hardware Web Audio API thruster pulses, alarms, and radio pings.",
    bengaliDigits: "Bengali Numerals (১২৩)",
    activeTheme: "Active CLI Theme",
    closeBtn: "Save & Close"
  },

  status: {
    cadet: "Cadet",
    callsign: "Callsign",
    rank: "Rank",
    fuel: "Propellant",
    oxygen: "O₂ Life Support",
    integrity: "Hull Shield",
    score: "Training Points",
    online: "ONLINE",
    nominal: "NOMINAL",
    warning: "CAUTION",
    secure: "TEE ATTESTED"
  },

  missionControl: {
    welcomeCadet: "Welcome to Space Mission Control",
    overviewText: "Train under authentic orbital mechanics, live NASA telemetry, and Bangladesh's landmark space technologies. Every mission state is cryptographically signed inside our Trusted Execution Environment (TEE).",
    liveNasaStream: "LIVE NASA & BD TELEMETRY",
    issTitle: "ISS Live Orbit Tracking",
    issAltitude: "Altitude",
    issSpeed: "Velocity",
    issCoords: "Position",
    bs1Title: "Bangabandhu Satellite-1 (BS-1)",
    bs1Slot: "Slot 119.1°E (GEO)",
    bs1GroundStations: "Gazipur & Betbunia Earth Stations",
    activeCadetMissions: "Core Cadet Challenges",
    launchSim: "Launch Simulator",
    intelBrief: "Orbital Intel Brief",
    teeHealth: "TEE Enclave Integrity",
    teeDescription: "Zero-knowledge hardware memory isolation with PCR chain verification."
  },

  challenges: {
    issDocking: {
      title: "ISS Orbital Docking",
      titleBn: "আইএসএস ডকিং সিমুলেশন",
      desc: "Pilot the spacecraft with RCS thrusters into the ISS Harmony docking port within velocity and alignment tolerances.",
      objective: "Align pitch, yaw, and relative velocity below 0.3 m/s for soft docking capture.",
      startBtn: "Initiate Docking Sequence",
      rcsUp: "RCS Pitch Up (W / ↑)",
      rcsDown: "RCS Pitch Down (S / ↓)",
      rcsLeft: "RCS Yaw Left (A / ←)",
      rcsRight: "RCS Yaw Right (D / →)",
      rcsBurnForward: "Main Burn (+Z)",
      rcsBurnReverse: "Retro Burn (-Z)",
      aligned: "DOCKING PORT ALIGNED",
      notAligned: "SEEKING HARMONY NODE",
      successMsg: "DOCKING CAPTURE CONFIRMED! Welcome aboard the International Space Station, Cadet!"
    },
    asteroidDeflection: {
      title: "NASA Asteroid Deflection",
      titleBn: "নাসা গ্রহাণু প্রতিরোধ মিশন",
      desc: "Real Near-Earth Asteroid trajectory intercepted via kinetic impactor calculations inspired by NASA DART.",
      targetAsteroid: "Detected NEO Target",
      velocity: "Approach Velocity",
      diameter: "Estimated Size",
      missDist: "Miss Distance",
      kineticBurn: "Fire Kinetic Deflector Burn",
      deflectionAngle: "Required Delta-V",
      hazardous: "POTENTIALLY HAZARDOUS",
      safe: "ORBITAL FLYBY",
      successMsg: "KINETIC IMPACT SUCCESSFUL! Asteroid trajectory deflected safely past Earth's gravitational well!"
    },
    marsRover: {
      title: "Mars Rover Pathfinder",
      titleBn: "মঙ্গল রোভার পাথফাইন্ডার",
      desc: "Navigate Perseverance across Jezero Crater to collect astrobiology core samples and return to safe haven.",
      sol: "Martian Sol",
      temperature: "Surface Temp",
      pressure: "Atmospheric Pressure",
      driveForward: "Drive Rover Forward",
      turnLeft: "Pivot Left",
      turnRight: "Pivot Right",
      takeSample: "Extract Rock Core Sample",
      samplesCollected: "Cores Collected",
      hazardDetected: "Terrain Hazard Ahead!",
      successMsg: "MARTIAN SCIENCE SAMPLES SECURED! Geological data committed to mission archive!"
    },
    bangabandhuSatellite: {
      title: "Bangabandhu-1 Telemetry Link",
      titleBn: "বঙ্গবন্ধু স্যাটেলাইট-১ লিংক",
      desc: "Calibrate ground antennas at Gazipur & Betbunia stations to maintain 119.1°E Ku-Band connectivity through atmospheric weather.",
      station: "Active Earth Station",
      azimuth: "Dish Azimuth",
      elevation: "Dish Elevation",
      snr: "Signal-to-Noise Ratio (SNR)",
      frequency: "Ku-Band Transponder",
      tuneFrequency: "Calibrate Azimuth & Elevation",
      switchStation: "Failover to Betbunia",
      weatherCondition: "Monsoon Ionospheric Attenuation",
      boostPower: "Boost Uplink RF Power",
      successMsg: "SATELLITE LINK LOCKED AT MAXIMUM SNR! High-speed national transponder data stream nominal!"
    },
    spaceWeather: {
      title: "Space Weather & EVA Shield",
      titleBn: "স্পেস ওয়েদার ও শিল্ড কন্ট্রোল",
      desc: "Monitor NASA DONKI solar flare telemetry and deploy magnetospheric deflector shields during solar particle events.",
      solarStormLevel: "Solar Storm Activity",
      cmeSpeed: "CME Velocity",
      kpIndex: "Geomagnetic Kp Index",
      shieldStatus: "Deflector Shield",
      deployShield: "Activate Magnetic Deflector",
      radiationRisk: "Space Radiation Risk",
      successMsg: "SOLAR CME SAFELY DEFLECTED! Astronaut crew EVA completed with zero radiation exposure!"
    },
    earthObservation: {
      title: "NASA Earth Observation & Cyclone Recon",
      titleBn: "নাসা ভূ-পর্যবেক্ষণ ও ঘূর্ণিঝড় ট্র্যাকিং",
      desc: "Process live NASA EONET satellite multispectral imagery to track Bay of Bengal tropical cyclones and monsoon floods across Bangladesh.",
      eventTarget: "Detected Natural Hazard Event",
      category: "Hazard Classification",
      spectralBand: "Multispectral Imaging Band",
      visibleBand: "Visible Light (0.64µm)",
      infraredBand: "Thermal IR (10.8µm)",
      waterVaporBand: "Water Vapor (6.7µm)",
      cloudTemp: "Cloud Top Temperature",
      stormPressure: "Central Barometric Pressure",
      reconObjective: "Calibrate multispectral bands to locate cyclone eye and flood surge radius.",
      transmitWarning: "Transmit Early Warning to SPARRSO & BMD",
      successMsg: "EARTH RECONNAISSANCE SUCCESS! Cyclone trajectory telemetry committed to Bangladesh Disaster Management Bureau!"
    }
  },

  nasaDataCenter: {
    title: "NASA & SPARRSO Real-Time Data Operations Center",
    subtitle: "Live Telemetry Feeds from NASA Open APIs & Spacecraft Sensors",
    liveIndicator: "LIVE NASA SYNCHRONIZED",
    cachedIndicator: "CACHED (RESILIENT)",
    syncBtn: "Sync NASA Telemetry Now",
    issHeading: "International Space Station Ephemeris",
    donkiHeading: "DONKI Space Weather & Solar Proton Flux",
    neoHeading: "NeoWs Near-Earth Asteroid Radar",
    eonetHeading: "EONET Earth Observatory Natural Events",
    bdGroundPassHeading: "Bangladesh Ground Pass Tracking",
    feedStatusHeading: "Telemetry Feed Health & Latency",
    lastSync: "Last Synced",
    autoSyncEvery: "Auto-refreshing every 12 seconds"
  },

  teeVault: {
    title: "Trusted Execution Environment (TEE) Security Vault",
    subtitle: "Hardware-enforced Cryptographic Enclave for Mission Critical Integrity",
    intro: "In human spaceflight, telemetry spoofing or cosmic-ray radiation memory bit-flips can prove fatal. The Junior Astronaut Mission Trainer isolates all flight commands, mission state, and scoring inside an attested hardware enclave.",
    pcr0Title: "PCR-0: Enclave Boot Code Integrity",
    pcr1Title: "PCR-1: Aerospace Security Policy",
    pcr2Title: "PCR-2: Cadet Cryptographic Identity",
    pcr3Title: "PCR-3: Chained Real-time Mission State",
    tamperSimulationTitle: "Simulate Adversarial Tamper Attack",
    tamperSimulationDesc: "Inject unauthorized values into flight computer memory to witness the TEE watchdog detect the breach, abort execution, and restore the attested cryptographic snapshot.",
    triggerAttackBtn: "Test Tamper Attack (Inject +99,999 Fuel)",
    generateReportBtn: "Request Cryptographic Enclave Attestation",
    verifyServerBtn: "Verify Attestation with Flight Control",
    enclaveId: "Enclave Instance ID",
    tamperEventsCount: "Tamper Attacks Thwarted",
    statusNominal: "ENCLAVE ISOLATION NOMINAL",
    statusBreach: "TAMPER ATTEMPT DETECTED & NEUTRALIZED"
  },

  flightDirector: {
    title: "AI Flight Director Orion (Gemini 3.1 Pro Thinking)",
    subtitle: "Senior Aerospace Flight Director & Mission Scientist",
    promptPlaceholder: "Ask Flight Director Orion about orbital mechanics, Hohmann transfers, space weather, TEE security...",
    consultBtn: "Consult Flight Director",
    thinkingBadge: "HIGH REASONING MODE ENGAGED",
    suggestedQuestions: "Cadet Training Inquiries:",
    presets: [
      "Explain how a Hohmann transfer orbit calculates delta-v from LEO to Mars.",
      "How does Bangabandhu Satellite-1 stay in geostationary orbit at 119.1° East without falling?",
      "Why is a Trusted Execution Environment (TEE) essential to protect spaceflight computers from cosmic radiation and tampering?",
      "What happens during a solar storm CME when the geomagnetic Kp index hits 7?"
    ]
  },

  cadetProfile: {
    title: "Junior Astronaut Accreditation",
    academy: "SPARRSO Junior Astronaut Cadet Academy",
    cadetId: "Cadet ID",
    rankProgress: "Rank Advancement",
    nextRank: "Next Promotion",
    badgesEarned: "Earned Mission Badges",
    printCert: "Download Junior Astronaut Certificate",
    certHeader: "PEOPLE'S REPUBLIC OF BANGLADESH SPACE TRAINING WING",
    certBody: "This hereby certifies that the named Cadet has demonstrated exemplary competence in orbital mechanics, satellite telemetry, and secure TEE flight computer operations.",
    verifiedSeal: "CRYPTOGRAPHICALLY ATTESTED BY TEE ENCLAVE"
  }
};

const bn = {
  ...en,
  appTitle: "জুনিয়র নভোচারী মিশন ট্রেইনার",
  appSubtitle: "স্পার্সো (SPARRSO) একাডেমি ও নাসা চ্যালেঞ্জ সিমুলেশন",
  teeBadge: "টিইই (TEE) সিকিউর এনভায়রনমেন্ট সক্রিয়",
  teeTooltip: "হার্ডওয়্যার-বিচ্ছিন্ন ও ক্রিপ্টোগ্রাফিকভাবে সুরক্ষিত স্টেট ম্যানেজমেন্ট",

  nav: {
    missionControl: "মিশন কন্ট্রোল",
    simulations: "ফ্লাইট সিমস",
    teeVault: "টিইই সিকিউরিটি ভল্ট",
    flightDirector: "এআই ফ্লাইট ডিরেক্টর",
    cadetProfile: "ক্যাডেট প্রোফাইল"
  },

  settings: {
    title: "মিশন সেটিংস ও কনফিগারেশন",
    subtitle: "ভাষা মোড, সিএলআই থিম ভ্যারিয়েশন ও অডিও কনফিগারেশন",
    languageTitle: "মিশন ভাষা নির্বাচন (Language Mode)",
    languageDesc: "টেলিমেট্রি, ইন্টারফেস এবং নির্দেশিকা নিজের পছন্দের ভাষায় পরিবর্তন করুন।",
    themeTitle: "ওপেনকোড সিএলআই থিম তালিকা (CLI Themes)",
    themeDesc: "কোড এডিটর এবং হ্যাকার টার্মিনাল অনুপ্রাণিত রঙের থিম নির্বাচন করুন।",
    audioTitle: "স্পেসক্রাফট অডিও এফএক্স সিন্থেসাইজার",
    audioDesc: "হার্ডওয়্যার ওয়েব অডিও এপিআই থ্রাস্টার, অ্যালার্ম ও রেডিও সাউন্ড।",
    bengaliDigits: "বাংলা সংখ্যা মোড (১২৩)",
    activeTheme: "সক্রিয় থিম",
    closeBtn: "সংরক্ষণ ও বন্ধ"
  },

  status: {
    cadet: "ক্যাডেট",
    callsign: "কলসাইন",
    rank: "পদবী",
    fuel: "রকেট জ্বালানি",
    oxygen: "অক্সিজেন লাইফ সাপোর্ট",
    integrity: "হাল শিল্ড",
    score: "ট্রেনিং পয়েন্ট",
    online: "অনলাইন",
    nominal: "স্বাভাবিক",
    warning: "সতর্কতা",
    secure: "টিইই সত্যায়িত"
  },

  missionControl: {
    welcomeCadet: "মহাকাশ মিশন কন্ট্রোলে স্বাগতম",
    overviewText: "প্রকৃত কক্ষপথীয় মেকানিক্স, লাইভ নাসা ডেটাসেট এবং বাংলাদেশের ঐতিহাসিক মহাকাশ প্রযুক্তির সমন্বয়ে গঠিত বাস্তবসম্মত প্রশিক্ষণ। বিশ্বস্ত এক্সিকিউশন এনভায়রনমেন্টের (TEE) মাধ্যমে প্রতিটি কমান্ড সম্পূর্ণ নিরাপদ।",
    liveNasaStream: "লাইভ নাসা ও বাংলাদেশ টেলিমেট্রি",
    issTitle: "আন্তর্জাতিক স্পেস স্টেশন (ISS) ট্র্যাকিং",
    issAltitude: "উচ্চতা",
    issSpeed: "বেগ",
    issCoords: "অবস্থান",
    bs1Title: "বঙ্গবন্ধু স্যাটেলাইট-১ (BS-1)",
    bs1Slot: "১১৯.১° পূর্ব স্লট (ভূ-স্থির কক্ষপথ)",
    bs1GroundStations: "গাজীপুর ও বেতবুনিয়া ভূ-উপগ্রহ কেন্দ্র",
    activeCadetMissions: "মূল ক্যাডেট চ্যালেঞ্জসমূহ",
    launchSim: "সিমুলেটর চালু করুন",
    intelBrief: "কক্ষপথীয় গোয়েন্দা ব্রিফ",
    teeHealth: "টিইই এনক্লেভ অখণ্ডতা",
    teeDescription: "জিরো-নলেজ হার্ডওয়্যার মেমরি আইসোলেশন ও পিসিআর চেইন ভেরিফিকেশন।"
  },

  challenges: {
    ...en.challenges,
    issDocking: {
      title: "আইএসএস ডকিং সিমুলেশন",
      titleBn: "আইএসএস ডকিং সিমুলেশন",
      desc: "আরসিএস থ্রাস্টারের সাহায্যে স্পেসক্রাফটটিকে নিখুঁত কোণ ও বেগে আন্তর্জাতিক মহাকাশ স্টেশনের হারমোনি মডিউলে ডক করান।",
      objective: "সফট ডকিং ক্যাপচারের জন্য বেগ প্রতি সেকেন্ডে ০.৩ মিটারের নিচে এবং অক্ষীয় অ্যালাইনমেন্ট বজায় রাখুন।",
      startBtn: "ডকিং সিকোয়েন্স শুরু করুন",
      rcsUp: "আরসিএস পিচ আপ (W / ↑)",
      rcsDown: "আরসিএস পিচ ডাউন (S / ↓)",
      rcsLeft: "আরসিএস ইয়া বামে (A / ←)",
      rcsRight: "আরসিএস ইয়া ডানে (D / →)",
      rcsBurnForward: "সামনে থ্রাস্ট (+Z)",
      rcsBurnReverse: "রেট্রো থ্রাস্ট (-Z)",
      aligned: "ডকিং পোর্ট নিখুঁতভাবে সারিবদ্ধ",
      notAligned: "হারমোনি নোড সারিবদ্ধ করা হচ্ছে",
      successMsg: "ডকিং সফলভাবে সম্পন্ন হয়েছে! আন্তর্জাতিক মহাকাশ স্টেশনে স্বাগতম, ক্যাডেট!"
    },
    asteroidDeflection: {
      title: "নাসা গ্রহাণু প্রতিরোধ মিশন",
      titleBn: "নাসা গ্রহাণু প্রতিরোধ মিশন",
      desc: "নাসার ডার্ট (DART) মিশনের আদলে কাইনেটিক ইমপ্যাক্টরের নিখুঁত গণনা করে পৃথিবীর দিকে ধেয়ে আসা বিপজ্জনক গ্রহাণু প্রতিহত করুন।",
      targetAsteroid: "শনাক্তকৃত গ্রহাণু (NEO)",
      velocity: "আগমনের বেগ",
      diameter: "আনুমানিক ব্যাস",
      missDist: "নিরাপদ দূরত্ব",
      kineticBurn: "কাইনেটিক ইমপ্যাক্টর নিক্ষেপ করুন",
      deflectionAngle: "প্রয়োজনীয় ডেল্টা-ভি",
      hazardous: "সম্ভাব্য বিপজ্জনক গ্রহাণু",
      safe: "নিরাপদ পথ অতিক্রম",
      successMsg: "কাইনেটিক ইমপ্যাক্ট সফল! গ্রহাণুটি দিক পরিবর্তন করে পৃথিবীর কক্ষপথের বাইরে চলে গেছে!"
    },
    marsRover: {
      title: "মঙ্গল রোভার পাথফাইন্ডার",
      titleBn: "মঙ্গল রোভার পাথফাইন্ডার",
      desc: "জেজেরো ক্রেটারে পারসিভিয়ারেন্স রোভার ড্রাইভ করে দুর্গম ভূপ্রকৃতি ও পাথর এড়িয়ে বিজ্ঞানের জন্য প্রাচীন পাথরের কোর নমুনা সংগ্রহ করুন।",
      sol: "মঙ্গলীয় দিবস (Sol)",
      temperature: "পৃষ্ঠের তাপমাত্রা",
      pressure: "বায়ুমণ্ডলীয় চাপ",
      driveForward: "রোভার সামনে চালান",
      turnLeft: "বামে ঘুরুন",
      turnRight: "ডানে ঘুরুন",
      takeSample: "পাথরের নমুনা সংগ্রহ করুন",
      samplesCollected: "সংগৃহীত নমুনা",
      hazardDetected: "সামনে বিপদজনক খাদ বা পাথর!",
      successMsg: "মঙ্গল গ্রহের অমূল্য ভূতাত্ত্বিক নমুনা সংগৃহীত ও নিরাপদ চেম্বারে সিল করা হয়েছে!"
    },
    bangabandhuSatellite: {
      title: "বঙ্গবন্ধু স্যাটেলাইট-১ লিংক",
      titleBn: "বঙ্গবন্ধু স্যাটেলাইট-১ লিংক",
      desc: "গাজীপুর এবং বেতবুনিয়া গ্রাউন্ড স্টেশনের অ্যান্টেনা ১১৯.১° পূর্ব দিকে নিখুঁতভাবে টিউন করে মৌসুমী বৃষ্টির মাঝেও সর্বোচ্চ এসএনআর (SNR) বজায় রাখুন।",
      station: "সক্রিয় ভূ-উপগ্রহ কেন্দ্র",
      azimuth: "অ্যান্টেনা অ্যাজিমুথ",
      elevation: "অ্যান্টেনা এলিভেশন কোণ",
      snr: "সিগন্যাল-টু-নয়েজ অনুপাত (SNR)",
      frequency: "কেইউ-ব্যান্ড ট্রান্সপন্ডার",
      tuneFrequency: "অ্যাজিমুথ ও এলিভেশন টিউন করুন",
      switchStation: "বেতবুনিয়া ব্যাকআপে স্যুইচ করুন",
      weatherCondition: "মৌসুমী ভারী বর্ষণে সিগন্যাল ক্ষয়",
      boostPower: "আপলিংক রেডিও পাওয়ার বৃদ্ধি করুন",
      successMsg: "স্যাটেলাইট লিংক সর্বোচ্চ শক্তিতে লক হয়েছে! জাতীয় যোগাযোগ সম্প্রচার নিরবচ্ছিন্ন!"
    },
    spaceWeather: {
      title: "স্পেস ওয়েদার ও শিল্ড কন্ট্রোল",
      titleBn: "স্পেস ওয়েদার ও শিল্ড কন্ট্রোল",
      desc: "নাসা ডনকি (DONKI) থেকে সৌরঝড় ও করোনাল ভর নির্গমন (CME) মনিটর করুন এবং স্পেসওয়াক চলাকালে সঠিক সময়ে ম্যাগনেটিক শিল্ড অন করুন।",
      solarStormLevel: "সৌরঝড়ের তীব্রতা",
      cmeSpeed: "সিএমই বেগ",
      kpIndex: "ভূ-চৌম্বকীয় Kp সূচক",
      shieldStatus: "ডিফ্লেক্টর শিল্ড",
      deployShield: "ম্যাগনেটিক ডিফ্লেক্টর সক্রিয় করুন",
      radiationRisk: "বিকিরণ ঝুঁকি মাত্রা",
      successMsg: "সৌরঝড় সফলভাবে প্রতিহত করা হয়েছে! নভোচারীদের স্পেসওয়াক সম্পূর্ণ নিরাপদ!"
    },
    earthObservation: {
      title: "নাসা ভূ-পর্যবেক্ষণ ও ঘূর্ণিঝড় ট্র্যাকিং",
      titleBn: "নাসা ভূ-পর্যবেক্ষণ ও ঘূর্ণিঝড় ট্র্যাকিং",
      desc: "নাসার ইওনেট (EONET) কৃত্রিম উপগ্রহের লাইভ মাল্টিস্পেকট্রাল ডেটা বিশ্লেষণ করে বঙ্গোপসাগরের ঘূর্ণিঝড় ও বাংলাদেশের বন্যা পরিস্থিতি পর্যবেক্ষণ করুন।",
      eventTarget: "শনাক্তকৃত প্রাকৃতিক দুর্যোগ ইভেন্ট",
      category: "দুর্যোগের শ্রেণি",
      spectralBand: "মাল্টিস্পেকট্রাল ইমেজিং ব্যান্ড",
      visibleBand: "দৃশ্যমান আলো (০.৬৪µm)",
      infraredBand: "থার্মাল ইনফ্রারেড (১০.৮µm)",
      waterVaporBand: "জলীয় বাষ্প সেন্সর (৬.৭µm)",
      cloudTemp: "মেঘের শীর্ষ তাপমাত্রা",
      stormPressure: "কেন্দ্রীয় বায়ুচাপ",
      reconObjective: "ঘূর্ণিঝড়ের চোখ এবং প্লাবন এলাকার পরিধি নির্ধারণে মাল্টিস্পেকট্রাল ব্যান্ড টিউন করুন।",
      transmitWarning: "স্পার্সো ও আবহাওয়া অধিদপ্তরে আগাম বার্তা প্রেরণ করুন",
      successMsg: "ভূ-পর্যবেক্ষণ সফল! বঙ্গোপসাগরের ঘূর্ণিঝড়ের গতিপথ ও সতর্কবার্তা দুর্যোগ ব্যবস্থাপনা অধিদপ্তরে প্রেরিত হয়েছে!"
    }
  },

  nasaDataCenter: {
    title: "নাসা ও স্পার্সো রিয়েল-টাইম ডেটা অপারেশন সেন্টার",
    subtitle: "নাসা ওপেন এপিআই ও স্পেসক্রাফট সেন্সর থেকে সরাসরি সংগৃহীত লাইভ টেলিমেট্রি",
    liveIndicator: "লাইভ নাসা সংযোগ সক্রিয়",
    cachedIndicator: "ক্যাশড ব্যাকআপ (সহনশীল)",
    syncBtn: "এখনই নাসা টেলিমেট্রি সিঙ্ক করুন",
    issHeading: "আন্তর্জাতিক স্পেস স্টেশন এফিমেয়ারিস",
    donkiHeading: "ডনকি স্পেস ওয়েদার ও সৌর প্রোটন ফ্লাক্স",
    neoHeading: "নিওডব্লিউএস নিয়ার-আর্থ গ্রহাণু রাডার",
    eonetHeading: "ইওনেট পৃথিবী পর্যবেক্ষণ প্রাকৃতিক দুর্যোগ",
    bdGroundPassHeading: "বাংলাদেশ গ্রাউন্ড পাস ট্র্যাকিং",
    feedStatusHeading: "টেলিমেট্রি ফিড স্বাস্থ্য ও লেটেন্সি",
    lastSync: "সর্বশেষ সিঙ্ক",
    autoSyncEvery: "প্রতি ১২ সেকেন্ড অন্তর স্বয়ংক্রিয়ভাবে রিফ্রেশ হচ্ছে"
  },

  teeVault: {
    ...en.teeVault,
    title: "বিশ্বস্ত এক্সিকিউশন এনভায়রনমেন্ট (TEE) সিকিউরিটি ভল্ট",
    subtitle: "মিশন ক্রিটিক্যাল সুরক্ষার জন্য হার্ডওয়্যার-নিয়ন্ত্রিত ক্রিপ্টোগ্রাফিক এনক্লেভ",
    intro: "মহাকাশযাত্রায় কসমিক রেডিয়েশনের ফলে মেমরির বিট বদলে যাওয়া বা শত্রুভাবাপন্ন হ্যাকিং বিপর্যয় ডেকে আনতে পারে। জুনিয়র নভোচারী মিশন ট্রেইনার একটি হার্ডওয়্যার টিইই (TEE) এনক্লেভে সমস্ত ফ্লাইট স্টেট সুরক্ষিত রাখে।",
    pcr0Title: "পিসিআর-০: এনক্লেভ বুট কোড অখণ্ডতা",
    pcr1Title: "পিসিআর-১: অ্যারোস্পেস সিকিউরিটি পলিসি",
    pcr2Title: "পিসিআর-২: ক্যাডেট ক্রিপ্টোগ্রাফিক পরিচয়",
    pcr3Title: "পিসিআর-৩: চেইন্ড রিয়েল-টাইম মিশন স্টেট",
    tamperSimulationTitle: "অ্যাডভারসারিয়াল ট্যাম্পার আক্রমণ সিমুলেশন",
    tamperSimulationDesc: "ফ্লাইট কম্পিউটারের মেমরি অননুমোদিতভাবে পরিবর্তনের চেষ্টা করে দেখুন কীভাবে টিইই ওয়াচডগ তাৎক্ষণিকভাবে হস্তক্ষেপ শনাক্ত করে নিরাপদ স্ন্যাপশট ফিরিয়ে আনে।",
    triggerAttackBtn: "ট্যাম্পার আক্রমণ পরীক্ষা (+৯৯,৯৯৯ জ্বালানি ইনজেক্ট করুন)",
    generateReportBtn: "ক্রিপ্টোগ্রাফিক এনক্লেভ সত্যায়ন অনুরোধ করুন",
    verifyServerBtn: "ফ্লাইট কন্ট্রোলের সাথে সত্যায়ন যাচাই করুন",
    enclaveId: "এনক্লেভ ইনস্ট্যান্স আইডি",
    tamperEventsCount: "প্রতিহত করা আক্রমণ সংখ্যা",
    statusNominal: "এনক্লেভ নিরাপত্তা সম্পূর্ণ স্বাভাবিক",
    statusBreach: "অননুমোদিত হস্তক্ষেপ শনাক্ত ও প্রতিহত করা হয়েছে"
  },

  flightDirector: {
    ...en.flightDirector,
    title: "এআই ফ্লাইট ডিরেক্টর আকাশ (জেমিনি ৩.১ প্রো হাই থিংকিং)",
    subtitle: "প্রধান অ্যারোস্পেস ফ্লাইট ডিরেক্টর ও মিশন বিজ্ঞানী",
    promptPlaceholder: "কক্ষপথীয় মেকানিক্স, হোহম্যান ট্রান্সফার, সৌরঝড় বা টিইই সুরক্ষা নিয়ে প্রশ্ন করুন...",
    consultBtn: "ফ্লাইট ডিরেক্টরের পরামর্শ নিন",
    thinkingBadge: "গভীর চিন্তন মোড (HIGH REASONING) সক্রিয়",
    suggestedQuestions: "ক্যাডেটদের জন্য গুরুত্বপূর্ণ প্রশ্নসমূহ:",
    presets: [
      "পৃথিবী থেকে মঙ্গলে যাওয়ার জন্য হোহম্যান ট্রান্সফার কক্ষপথে ডেল্টা-ভি কীভাবে হিসাব করতে হয়?",
      "বঙ্গবন্ধু স্যাটেলাইট-১ কীভাবে ১১৯.১° পূর্ব দ্রাঘিমাংশে ভূ-স্থির কক্ষপথে নিচে না পড়ে স্থির থাকে?",
      "কসমিক রেডিয়েশনের হাত থেকে মহাকাশযানের ফ্লাইট কম্পিউটার রক্ষায় টিইই (TEE) কেন অপরিহার্য?",
      "সৌরঝড়ে ভূ-চৌম্বকীয় Kp সূচক ৭ অতিক্রম করলে নভোচারীদের কী পদক্ষেপ নিতে হয়?"
    ]
  },

  cadetProfile: {
    ...en.cadetProfile,
    title: "জুনিয়র নভোচারী সনদ ও পরিচিতি",
    academy: "স্পার্সো জুনিয়র নভোচারী ক্যাডেট একাডেমি",
    cadetId: "ক্যাডেট আইডি",
    rankProgress: "পদোন্নতি অগ্রগতি",
    nextRank: "পরবর্তী পদবী",
    badgesEarned: "অর্জিত মিশন ব্যাজসমূহ",
    printCert: "জুনিয়র নভোচারী সার্টিফিকেট ডাউনলোড করুন",
    certHeader: "গণপ্রজাতন্ত্রী বাংলাদেশ মহাকাশ প্রশিক্ষণ উইং",
    certBody: "প্রত্যয়ন করা যাচ্ছে যে উক্ত ক্যাডেট কক্ষপথীয় মেকানিক্স, স্যাটেলাইট টেলিমেট্রি এবং বিশ্বস্ত এক্সিকিউশন এনভায়রনমেন্ট পরিচালনায় সফলভাবে দক্ষতা অর্জন করেছেন।",
    verifiedSeal: "টিইই এনক্লেভ দ্বারা ক্রিপ্টোগ্রাফিকভাবে সত্যায়িত"
  }
};

const es = {
  ...en,
  appTitle: "Entrenador de Misiones de Astronauta Junior",
  appSubtitle: "Academia Espacial SPARRSO y Desafíos de la NASA",
  nav: {
    missionControl: "Control de Misión",
    simulations: "Simuladores",
    teeVault: "Bóveda TEE",
    flightDirector: "Director de Vuelo IA",
    cadetProfile: "Perfil de Cadete"
  },
  settings: {
    ...en.settings,
    title: "Ajustes de Misión y Configuración",
    languageTitle: "Modo de Idioma Internacional",
    themeTitle: "Variaciones de Tema OpenCode CLI",
    audioTitle: "Sintetizador de Sonido Espacial",
  }
};

const fr = {
  ...en,
  appTitle: "Entraîneur de Mission Astronaute Junior",
  appSubtitle: "Académie SPARRSO & Simulations de la NASA",
  nav: {
    missionControl: "Contrôle de Mission",
    simulations: "Simulateurs",
    teeVault: "Coffre-fort TEE",
    flightDirector: "Directeur de Vol IA",
    cadetProfile: "Profil Cadet"
  },
  settings: {
    ...en.settings,
    title: "Paramètres de Mission",
    languageTitle: "Mode de Langue International",
    themeTitle: "Thèmes OpenCode CLI",
    audioTitle: "Effets Sonores Spatiaux",
  }
};

const de = {
  ...en,
  appTitle: "Junior-Astronauten-Missionstrainer",
  appSubtitle: "SPARRSO Weltraumakademie & NASA-Herausforderungen",
  nav: {
    missionControl: "Missionskontrolle",
    simulations: "Flugsimulationen",
    teeVault: "TEE-Sicherheitstresor",
    flightDirector: "KI-Flugleiter",
    cadetProfile: "Kadettenprofil"
  },
  settings: {
    ...en.settings,
    title: "Missions-Einstellungen",
    languageTitle: "Internationale Sprachauswahl",
    themeTitle: "OpenCode CLI Farbthemen",
    audioTitle: "Audio-Synthesizer",
  }
};

const ja = {
  ...en,
  appTitle: "ジュニア宇宙飛行士ミッショントレーナー",
  appSubtitle: "SPARRSOアカデミー＆NASA宇宙シミュレーション",
  nav: {
    missionControl: "管制室",
    simulations: "飛行シミュレータ",
    teeVault: "TEE安全ボールト",
    flightDirector: "AIフライトディレクター",
    cadetProfile: "隊員プロファイル"
  },
  settings: {
    ...en.settings,
    title: "ミッション設定と構成",
    languageTitle: "言語モード選択",
    themeTitle: "OpenCode CLI テーマ一覧",
    audioTitle: "宇宙オーディオ効果音",
  }
};

const ar = {
  ...en,
  appTitle: "مدرب مهمات رواد الفضاء الصغار",
  appSubtitle: "أكاديمية سبارسو ومحاكاة وكالة ناسا الفضائية",
  nav: {
    missionControl: "غرفة التحكم",
    simulations: "المحاكاة",
    teeVault: "خزنة TEE الأمنية",
    flightDirector: "مدير الطيران الذكي",
    cadetProfile: "ملف المتدرب"
  },
  settings: {
    ...en.settings,
    title: "إعدادات المهمة والبيئة",
    languageTitle: "اختيار لغة المهمة",
    themeTitle: "سمات سطر أوامر OpenCode",
    audioTitle: "مؤثرات الصوت الفضائية",
  }
};

const hi = {
  ...en,
  appTitle: "जूनियर अंतरिक्ष यात्री मिशन ट्रेनर",
  appSubtitle: "स्पार्सो अकादमी और नासा अंतरिक्ष मिशन",
  nav: {
    missionControl: "मिशन नियंत्रण",
    simulations: "उड़ान सिमुलेशन",
    teeVault: "टीईई सुरक्षा वॉल्ट",
    flightDirector: "एआई उड़ान निदेशक",
    cadetProfile: "कैडेट प्रोफाइल"
  },
  settings: {
    ...en.settings,
    title: "मिशन सेटिंग्स और विन्यास",
    languageTitle: "अंतर्राष्ट्रीय भाषा मोड",
    themeTitle: "OpenCode CLI थीम सूची",
    audioTitle: "अंतरिक्ष ध्वनि प्रभाव",
  }
};

const zh = {
  ...en,
  appTitle: "初级宇航员太空任务模拟器",
  appSubtitle: "SPARRSO 太空学院与 NASA 实时挑战",
  nav: {
    missionControl: "任务控制中心",
    simulations: "飞行模拟",
    teeVault: "TEE 硬件安全保险库",
    flightDirector: "AI 飞行总指挥",
    cadetProfile: "宇航员学员档案"
  },
  settings: {
    ...en.settings,
    title: "任务设置与环境配置",
    languageTitle: "国际语言模式",
    themeTitle: "OpenCode CLI 主题列表",
    audioTitle: "航天器音频效果",
  }
};

export const translations: Record<Language, typeof en> = {
  en,
  bn: bn as typeof en,
  es,
  fr,
  de,
  ja,
  ar,
  hi,
  zh
};
