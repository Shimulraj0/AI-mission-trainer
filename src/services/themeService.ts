// OpenCode CLI Theme Variations & Theme Engine for Junior Astronaut Mission Trainer

export interface CliTheme {
  id: string;
  name: string;
  cliFlag: string;
  description: string;
  category: 'cyber' | 'neon' | 'retro' | 'arctic' | 'matrix';
  previewColors: [string, string, string, string]; // [primary, secondary, bg, card]
  cssVars: {
    '--theme-primary': string;
    '--theme-secondary': string;
    '--theme-bg': string;
    '--theme-card': string;
    '--theme-border': string;
    '--theme-glow': string;
    '--theme-accent-text': string;
  };
}

export const OPENCODE_THEMES: CliTheme[] = [
  {
    id: 'deep-space',
    name: 'Deep Space Cyber (Default)',
    cliFlag: '--theme=deep-space-cyber',
    description: 'Electric cyan and deep cosmic void inspired by aerospace HUD telemetry.',
    category: 'cyber',
    previewColors: ['#00f0ff', '#6366f1', '#060913', '#0b1329'],
    cssVars: {
      '--theme-primary': '#00f0ff',
      '--theme-secondary': '#6366f1',
      '--theme-bg': '#060913',
      '--theme-card': 'rgba(11, 19, 41, 0.85)',
      '--theme-border': 'rgba(0, 240, 255, 0.25)',
      '--theme-glow': 'rgba(0, 240, 255, 0.15)',
      '--theme-accent-text': '#38bdf8',
    },
  },
  {
    id: 'tokyo-night',
    name: 'Tokyo Night Space',
    cliFlag: '--theme=tokyo-night',
    description: 'Neon nightlife in neo-Tokyo with atmospheric magenta, cyan, and deep twilight.',
    category: 'neon',
    previewColors: ['#bb9af7', '#7dcfff', '#1a1b26', '#24283b'],
    cssVars: {
      '--theme-primary': '#bb9af7',
      '--theme-secondary': '#7dcfff',
      '--theme-bg': '#13141f',
      '--theme-card': 'rgba(36, 40, 59, 0.85)',
      '--theme-border': 'rgba(187, 154, 247, 0.3)',
      '--theme-glow': 'rgba(187, 154, 247, 0.18)',
      '--theme-accent-text': '#bb9af7',
    },
  },
  {
    id: 'catppuccin',
    name: 'Catppuccin Macchiato',
    cliFlag: '--theme=catppuccin-macchiato',
    description: 'Soothing pastel palette with soft mauve, sky blue, and warm velvet tones.',
    category: 'retro',
    previewColors: ['#c6a0f6', '#91d7e3', '#1e2030', '#24273a'],
    cssVars: {
      '--theme-primary': '#c6a0f6',
      '--theme-secondary': '#91d7e3',
      '--theme-bg': '#181926',
      '--theme-card': 'rgba(36, 39, 58, 0.85)',
      '--theme-border': 'rgba(198, 160, 246, 0.25)',
      '--theme-glow': 'rgba(198, 160, 246, 0.15)',
      '--theme-accent-text': '#c6a0f6',
    },
  },
  {
    id: 'dracula',
    name: 'Dracula Dark Orbital',
    cliFlag: '--theme=dracula-pro',
    description: 'Iconic gothic developer theme with neon pink, toxic green, and purple highlights.',
    category: 'neon',
    previewColors: ['#ff79c6', '#bd93f9', '#1e1f29', '#282a36'],
    cssVars: {
      '--theme-primary': '#ff79c6',
      '--theme-secondary': '#bd93f9',
      '--theme-bg': '#181922',
      '--theme-card': 'rgba(40, 42, 54, 0.85)',
      '--theme-border': 'rgba(255, 121, 198, 0.25)',
      '--theme-glow': 'rgba(255, 121, 198, 0.15)',
      '--theme-accent-text': '#ff79c6',
    },
  },
  {
    id: 'nord',
    name: 'Nord Arctic Cosmos',
    cliFlag: '--theme=nord-arctic',
    description: 'Crisp polar Scandinavian theme with cold frost cyans and deep sub-zero slates.',
    category: 'arctic',
    previewColors: ['#88c0d0', '#81a1c1', '#242933', '#2e3440'],
    cssVars: {
      '--theme-primary': '#88c0d0',
      '--theme-secondary': '#81a1c1',
      '--theme-bg': '#1e222a',
      '--theme-card': 'rgba(46, 52, 64, 0.85)',
      '--theme-border': 'rgba(136, 192, 208, 0.25)',
      '--theme-glow': 'rgba(136, 192, 208, 0.15)',
      '--theme-accent-text': '#88c0d0',
    },
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk 2077 Neon',
    cliFlag: '--theme=cyberpunk-2077',
    description: 'High voltage electric yellow with razor-sharp neon pink and dark synthwave black.',
    category: 'cyber',
    previewColors: ['#fcee0a', '#ff0055', '#08080a', '#141419'],
    cssVars: {
      '--theme-primary': '#fcee0a',
      '--theme-secondary': '#ff0055',
      '--theme-bg': '#070709',
      '--theme-card': 'rgba(20, 20, 26, 0.9)',
      '--theme-border': 'rgba(252, 238, 10, 0.35)',
      '--theme-glow': 'rgba(252, 238, 10, 0.2)',
      '--theme-accent-text': '#fcee0a',
    },
  },
  {
    id: 'matrix',
    name: 'Emerald Matrix CLI',
    cliFlag: '--theme=emerald-matrix',
    description: 'Digital rain terminal phosphor green, inspired by hacker consoles and mainframe TEEs.',
    category: 'matrix',
    previewColors: ['#00ff66', '#10b981', '#031209', '#071f11'],
    cssVars: {
      '--theme-primary': '#00ff66',
      '--theme-secondary': '#10b981',
      '--theme-bg': '#020b05',
      '--theme-card': 'rgba(7, 31, 17, 0.85)',
      '--theme-border': 'rgba(0, 255, 102, 0.3)',
      '--theme-glow': 'rgba(0, 255, 102, 0.18)',
      '--theme-accent-text': '#00ff66',
    },
  },
  {
    id: 'gruvbox',
    name: 'Gruvbox Astro Dark',
    cliFlag: '--theme=gruvbox-astro',
    description: 'Warm retro terminal aesthetics with gold, burnt amber, and earthy leather accents.',
    category: 'retro',
    previewColors: ['#fabd2f', '#fe8019', '#1d2021', '#282828'],
    cssVars: {
      '--theme-primary': '#fabd2f',
      '--theme-secondary': '#fe8019',
      '--theme-bg': '#191b1c',
      '--theme-card': 'rgba(40, 40, 40, 0.85)',
      '--theme-border': 'rgba(250, 189, 47, 0.3)',
      '--theme-glow': 'rgba(250, 189, 47, 0.15)',
      '--theme-accent-text': '#fabd2f',
    },
  },
  {
    id: 'solarized-dark',
    name: 'Solarized Dark Abyss',
    cliFlag: '--theme=solarized-dark',
    description: 'Scientifically balanced cyan-teal and warm amber on ocean-trench solar base.',
    category: 'arctic',
    previewColors: ['#2aa198', '#b58900', '#00212b', '#073642'],
    cssVars: {
      '--theme-primary': '#2aa198',
      '--theme-secondary': '#b58900',
      '--theme-bg': '#001b24',
      '--theme-card': 'rgba(7, 54, 66, 0.85)',
      '--theme-border': 'rgba(42, 161, 152, 0.3)',
      '--theme-glow': 'rgba(42, 161, 152, 0.15)',
      '--theme-accent-text': '#2aa198',
    },
  },
  {
    id: 'monokai',
    name: 'Monokai Pro Cyber',
    cliFlag: '--theme=monokai-pro',
    description: 'High-contrast code editor palette with luminous coral, electric lemon, and jade.',
    category: 'neon',
    previewColors: ['#ff6188', '#ffd866', '#221f22', '#2d2a2e'],
    cssVars: {
      '--theme-primary': '#ff6188',
      '--theme-secondary': '#ffd866',
      '--theme-bg': '#1a181a',
      '--theme-card': 'rgba(45, 42, 46, 0.85)',
      '--theme-border': 'rgba(255, 97, 136, 0.28)',
      '--theme-glow': 'rgba(255, 97, 136, 0.16)',
      '--theme-accent-text': '#ff6188',
    },
  },
];

class ThemeService {
  private activeThemeId: string = 'deep-space';
  private listeners: Array<(theme: CliTheme) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('astronaut_theme_id');
      if (saved && OPENCODE_THEMES.some((t) => t.id === saved)) {
        this.activeThemeId = saved;
      }
      this.applyTheme(this.activeThemeId, false);
    }
  }

  public getTheme(): CliTheme {
    return (
      OPENCODE_THEMES.find((t) => t.id === this.activeThemeId) ||
      OPENCODE_THEMES[0]
    );
  }

  public getAllThemes(): CliTheme[] {
    return OPENCODE_THEMES;
  }

  public setTheme(themeId: string) {
    const target = OPENCODE_THEMES.find((t) => t.id === themeId);
    if (!target) return;
    this.activeThemeId = themeId;
    if (typeof window !== 'undefined') {
      localStorage.setItem('astronaut_theme_id', themeId);
    }
    this.applyTheme(themeId, true);
  }

  private applyTheme(themeId: string, notify: boolean = true) {
    const theme = OPENCODE_THEMES.find((t) => t.id === themeId) || OPENCODE_THEMES[0];
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      Object.entries(theme.cssVars).forEach(([key, val]) => {
        root.style.setProperty(key, val);
      });
      // Update body background
      document.body.style.backgroundColor = theme.cssVars['--theme-bg'];
    }
    if (notify) {
      this.listeners.forEach((cb) => cb(theme));
    }
  }

  public subscribe(cb: (theme: CliTheme) => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }
}

export const themeService = new ThemeService();
