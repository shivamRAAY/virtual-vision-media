export interface Product {
  id: string;
  title: string;
  subtitle: string;
  category: 'bundles' | 'luts' | 'transitions' | 'sfx' | 'overlays' | 'titles' | 'templates';
  price: number; // in INR
  originalPrice?: number;
  fileSize: string;
  assetsCount: string;
  badge?: string;
  format: string;
  softwareCompatibility: string[];
  universalFormat: boolean;
  description: string;
  detailedSpecs: {
    resolution?: string;
    bitDepth?: string;
    sampleRate?: string;
    channels?: string;
    colorSpace?: string;
    compression?: string;
  };
  features: string[];
  folderTree: {
    name: string;
    size?: string;
    filesCount?: number;
    subfolders?: { name: string; count: number }[];
  }[];
  image: string;
  featured: boolean;
  isBundle?: boolean;
  isFree?: boolean;
  driveLink?: string;
  isUpcoming?: boolean;
}

export const CATEGORIES = [
  { id: 'all', name: 'All Products', count: 8 },
  { id: 'bundles', name: 'Curated Bundles', count: 1 },
  { id: 'luts', name: 'LUTs & Color Grading', count: 2 },
  { id: 'transitions', name: 'Transitions & Motion', count: 1 },
  { id: 'sfx', name: 'Sound Effects & Foley', count: 1 },
  { id: 'overlays', name: 'Overlays & Textures', count: 1 },
  { id: 'titles', name: 'Titles & Typography', count: 1 },
  { id: 'templates', name: 'Templates & Resources', count: 1 },
];

export const PRODUCTS: Product[] = [
  {
    id: 'vvm-100gb-vault',
    title: '100GB Master Video Editor Vault',
    subtitle: 'The Ultimate Creative Toolkit for Filmmakers & Creators',
    category: 'bundles',
    price: 49,
    originalPrice: 4999,
    fileSize: '102.4 GB',
    assetsCount: '2,500+ Assets',
    badge: 'Special Launch Deal • ₹49 ONLY • 99% OFF',
    format: 'Universal .CUBE, ProRes 422 QuickTime, 24-bit 96kHz WAV, MOGRT',
    driveLink: 'https://drive.google.com/drive/folders/1GaOl2Ha0AII8QSIhiuOCyA7380DVfQVl?usp=sharing&mcp_token=eyJwaWQiOjkyNzcyOSwic2lkIjoxNzE2MzIxNjI0LCJheCI6ImViNTQ5YzRiZDJkMjBkMTVkZWUxMGMwNGNlMmJlYTNkIiwidHMiOjE3MzgwNTIxNzgsImV4cCI6MTc0MDQ3MTM3OH0.hJ55soOk95b_4z0GzUsTHEiIs3x7BSqUJ-NlZ8sXnLI',
    softwareCompatibility: ['Premiere Pro', 'DaVinci Resolve', 'Final Cut Pro', 'After Effects', 'CapCut Pro', 'Avid Media Composer'],
    universalFormat: true,
    description: 'The definitive all-in-one archive engineered for commercial editors, indie filmmakers, and top-tier creators. Assembled without filler or bloat, this 102.4 GB collection brings together our complete cinematic roster: Hollywood-grade LUTs, authentic 35mm optical grain scans, surgical 96kHz sound design, and drag-and-drop ProRes transitions.',
    detailedSpecs: {
      resolution: '4K DCI (4096x2160) & UHD (3840x2160)',
      bitDepth: '10-bit / 12-bit Video, 24-bit Audio',
      sampleRate: '96,000 Hz Studio Broadcast',
      colorSpace: 'Rec.709, Apple Log, Sony S-Log3, Canon Log, Arri LogC',
      compression: 'Apple ProRes 422 / ProRes 4444 with Alpha Channel'
    },
    features: [
      'Over 2,500 verified master-grade assets organized into 6 categorized root folders',
      'Universal compatibility: works seamlessly across any modern NLE without proprietary plugins',
      '180+ Camera-specific & Creative LUTs (.cube 33x33x33 & 65x65x65)',
      '350+ Drag-and-drop ProRes 422 transitions with embedded alpha channel transparency',
      '850+ Broadcast-standard sound design elements mastered at 24-bit/96kHz WAV',
      '300+ 4K scanned 35mm film grain, vintage lens flares, light leaks, and dust overlays',
      '150+ Kinetic editorial title sequences and lower thirds (MOGRT & DaVinci Fusion)',
      'Complete PDF documentation, video installation tutorials & lifetime commercial license'
    ],
    folderTree: [
      {
        name: '01_LUTS_COLOR_GRADING',
        size: '4.8 GB',
        filesCount: 180,
        subfolders: [
          { name: 'Arri_LogC_to_Cine709', count: 32 },
          { name: 'Sony_SLog3_FilmPrint', count: 45 },
          { name: 'Blackmagic_Film_V5', count: 35 },
          { name: 'Apple_Log_iPhone15_16Pro', count: 28 },
          { name: 'Stylized_Teal_Orange_Kodak5207', count: 40 }
        ]
      },
      {
        name: '02_TRANSITIONS_PRORES_4K',
        size: '28.4 GB',
        filesCount: 350,
        subfolders: [
          { name: 'Kinetic_Whip_Pans', count: 65 },
          { name: 'Optical_Glass_Distortions', count: 70 },
          { name: 'Film_Flash_Cuts', count: 85 },
          { name: 'Anamorphic_Light_Leaked_Swipes', count: 60 },
          { name: 'Glitch_Digital_Displacements', count: 70 }
        ]
      },
      {
        name: '03_SFX_BROADCAST_WAV_96KHZ',
        size: '18.2 GB',
        filesCount: 850,
        subfolders: [
          { name: 'Cinematic_Risers_Hits', count: 180 },
          { name: 'Organic_Whooshes_Swishes', count: 210 },
          { name: 'Atmospheres_Tonal_Drones', count: 140 },
          { name: 'Mechanical_UI_Clicks', count: 160 },
          { name: 'Foley_Sub_Booms', count: 160 }
        ]
      },
      {
        name: '04_OVERLAYS_35MM_FILM_GRAIN',
        size: '32.1 GB',
        filesCount: 300,
        subfolders: [
          { name: 'Authentic_Kodak_500T_Grain_4K', count: 40 },
          { name: 'Vintage_16mm_Bolex_Texture', count: 50 },
          { name: 'Real_Anamorphic_Streak_Flares', count: 75 },
          { name: 'Film_Leaders_Clock_Countdowns', count: 45 },
          { name: 'Dust_Scratches_Hair_Overlays', count: 90 }
        ]
      },
      {
        name: '05_TITLES_TYPOGRAPHY_KINETIC',
        size: '9.6 GB',
        filesCount: 150,
        subfolders: [
          { name: 'Modern_Minimal_Editorial', count: 45 },
          { name: 'Cyberpunk_Tech_Data_LowerThirds', count: 35 },
          { name: 'Cinematic_Film_Credits', count: 30 },
          { name: 'Kinetic_Poster_Typography', count: 40 }
        ]
      },
      {
        name: '06_PROJECT_TEMPLATES_RESOURCES',
        size: '9.3 GB',
        filesCount: 670,
        subfolders: [
          { name: 'Split_Screen_Collage_Grids', count: 120 },
          { name: 'Social_Reels_Aspect_Ratios', count: 180 },
          { name: 'Color_Swatches_Curves', count: 220 },
          { name: 'Keyboard_Shortcuts_CheatSheets', count: 150 }
        ]
      }
    ],
    image: '/vvm-150-folders.jpg',
    featured: true,
    isBundle: true,
    isUpcoming: false
  },
  {
    id: 'vvm-cinematic-luts',
    title: 'CineGrade Hollywood LUTs Masterpack',
    subtitle: '65x 3D CUBE Color Profiles for Raw & Log Cameras',
    category: 'luts',
    price: 1499,
    originalPrice: 3499,
    fileSize: '4.8 GB',
    assetsCount: '180+ LUTs',
    badge: 'Upcoming',
    isUpcoming: true,
    format: '.CUBE 33x & 65x 3D LUTs (Rec.709 & Log)',
    softwareCompatibility: ['DaVinci Resolve', 'Premiere Pro', 'Final Cut Pro', 'Photoshop', 'CapCut Pro'],
    universalFormat: true,
    description: 'Transform raw, flat log camera footage into rich, filmic imagery with our precision-calibrated 3D LUT collection. Emulates legendary Kodak Vision3 500T 5219, Fuji Eterna, and modern Hollywood box office color palettes without breaking skin tones or introducing digital noise.',
    detailedSpecs: {
      colorSpace: 'Sony S-Log3, Canon C-Log2/3, Apple Log, Fuji F-Log, Rec.709',
      bitDepth: '65x65x65 Floating-Point Mathematical Precision',
      compression: 'Lossless .CUBE 3D Color LUT Tables'
    },
    features: [
      '180+ Color grading profiles split into Log Rec.709 conversions & stylized creative passes',
      'Zero clipping or color band distortion in delicate highlights',
      'Calibrated on professional Flanders Scientific reference mastering monitors',
      'Includes QuickLook preview gallery and installation PDF for all editing suites'
    ],
    folderTree: [
      { name: 'Log_Transform_LUTs', filesCount: 60, size: '1.6 GB' },
      { name: 'Hollywood_Film_Emulations', filesCount: 70, size: '2.0 GB' },
      { name: 'Editorial_Commercial_Clean', filesCount: 50, size: '1.2 GB' }
    ],
    image: '/hero-banner-2k.png',
    featured: true
  },
  {
    id: 'vvm-prores-transitions',
    title: 'CineMotion 4K Transitions Suite',
    subtitle: 'Seamless Alpha Channel Motion & Whip Cuts',
    category: 'transitions',
    price: 1899,
    originalPrice: 4299,
    fileSize: '28.4 GB',
    assetsCount: '350+ Clips',
    badge: 'Upcoming',
    isUpcoming: true,
    format: '4K QuickTime ProRes 422 (Pre-keyed Alpha)',
    softwareCompatibility: ['Premiere Pro', 'DaVinci Resolve', 'Final Cut Pro', 'After Effects'],
    universalFormat: true,
    description: 'Drag-and-drop seamless transitions that create dynamic visual cadence without requiring complicated timeline plugins. Each asset is rendered with pre-multiplied alpha transparency so you simply drag above your cut point.',
    detailedSpecs: {
      resolution: '4K UHD (3840x2160) at 60fps & 24fps',
      compression: 'Apple ProRes 422 QuickTime with Transparency Channel'
    },
    features: [
      '350+ Unique seamless optical and kinetic transitions',
      'Rendered in ultra-smooth 60fps so you can re-time or speed-ramp freely',
      'Includes matching sound design whoosh transitions synced to every visual cut',
      'No plugins or external rendering engines required'
    ],
    folderTree: [
      { name: 'Optical_Glass_Swipes', filesCount: 110, size: '9.2 GB' },
      { name: 'Kinetic_Whip_Transitions', filesCount: 120, size: '10.1 GB' },
      { name: 'Analog_Film_Burns', filesCount: 120, size: '9.1 GB' }
    ],
    image: '/hero-banner-2k.png',
    featured: true
  },
  {
    id: 'vvm-hollywood-sfx',
    title: 'Precision Foley & Cinematic SFX Archive',
    subtitle: '850+ 96kHz 24-bit Studio Broadcast Audio Assets',
    category: 'sfx',
    price: 1299,
    originalPrice: 2999,
    fileSize: '18.2 GB',
    assetsCount: '850+ WAV Files',
    badge: 'Upcoming',
    isUpcoming: true,
    format: 'Uncompressed 24-bit 96,000 Hz Stereo Broadcast WAV',
    softwareCompatibility: ['Premiere Pro', 'DaVinci Resolve', 'Final Cut Pro', 'Logic Pro', 'Ableton', 'Audition'],
    universalFormat: true,
    description: 'Breathe physical weight, tension, and auditory punch into your edits. Recorded on Sennheiser MKH 416 & Sound Devices preamps in acoustically treated chambers, every whoosh, riser, sub boom, and UI click is cleanly isolated with zero background hiss.',
    detailedSpecs: {
      sampleRate: '96 kHz Ultra High Definition Audio',
      bitDepth: '24-bit Lossless Broadcast Wave Format (BWF)',
      channels: 'Stereo 2.0 with embedded Soundminer & iXML metadata tags'
    },
    features: [
      '850+ Mastered sound files categorized by emotional and kinetic intent',
      'Soundminer and NLE metadata tagged for instant search in Premiere & Resolve',
      'Zero clipping guaranteed at -0.1 dB True Peak with pristine dynamic headroom',
      'Royalty-free for international commercial broadcast, YouTube, and theatrical release'
    ],
    folderTree: [
      { name: 'Sub_Hits_and_Impacts', filesCount: 190, size: '4.2 GB' },
      { name: 'Cinematic_Whooshes_Passbys', filesCount: 260, size: '5.1 GB' },
      { name: 'Tension_Drones_Atmospheres', filesCount: 200, size: '5.8 GB' },
      { name: 'Tactile_Foley_MicroUI', filesCount: 200, size: '3.1 GB' }
    ],
    image: '/hero-banner-2k.png',
    featured: true
  },
  {
    id: 'vvm-35mm-film-grain',
    title: 'Authentic 35mm & 16mm Film Texture Vault',
    subtitle: 'Optically Scanned 4K DCI Kodak 500T Grain & Flares',
    category: 'overlays',
    price: 1199,
    originalPrice: 2499,
    fileSize: '32.1 GB',
    assetsCount: '300+ Overlays',
    badge: 'Upcoming',
    isUpcoming: true,
    format: '4K DCI QuickTime ProRes 4444 & H.265 Master Loops',
    softwareCompatibility: ['DaVinci Resolve', 'Premiere Pro', 'Final Cut Pro', 'After Effects', 'CapCut Pro'],
    universalFormat: true,
    description: 'True optical film texture scanned on an Arriscan 4K laboratory pin-registered scanner from genuine Kodak Vision3 500T, 250D, and 16mm Tri-X 7266 stock. Set blending mode to Overlay or Soft Light for instant organic film emulation.',
    detailedSpecs: {
      resolution: '4K DCI (4096 x 2160) Full Aperture',
      compression: 'Apple ProRes 4444 (12-bit RGB with Alpha)'
    },
    features: [
      'Over 300 authentic loops including grain plates, film gates, edge sprockets, and real lens flares',
      'Perfect seamless 10-second loops with zero frame jitter',
      'Includes retro 8mm, vintage 16mm, and crisp contemporary 35mm grain profiles',
      'Universal blend-mode application: compatible with any editing app on earth'
    ],
    folderTree: [
      { name: 'Kodak_35mm_Grain_Plates', filesCount: 90, size: '10.5 GB' },
      { name: 'Film_Artifacts_Dust_Hair', filesCount: 110, size: '11.2 GB' },
      { name: 'Anamorphic_Light_Streaks', filesCount: 100, size: '10.4 GB' }
    ],
    image: '/hero-banner-2k.png',
    featured: true
  },
  {
    id: 'vvm-kinetic-titles',
    title: 'Kinetic Editorial Titles & Lower Thirds',
    subtitle: 'Modern Minimal Typography for High-End Video Projects',
    category: 'titles',
    price: 999,
    originalPrice: 1999,
    fileSize: '9.6 GB',
    assetsCount: '150+ Title Templates',
    badge: 'Upcoming',
    isUpcoming: true,
    format: '.MOGRT (Premiere) + DaVinci Resolve Title Macros + 4K Alpha QuickTime',
    softwareCompatibility: ['Premiere Pro', 'DaVinci Resolve', 'After Effects', 'Final Cut Pro'],
    universalFormat: false,
    description: 'Elevate documentaries, commercial spots, YouTube essays, and brand videos with sleek, typography-first animated titles inspired by modern Swiss editorial design. Customize text, fonts, colors, line heights, and position directly in the Essential Graphics or Inspector panel.',
    detailedSpecs: {
      resolution: 'Adaptive Responsive Responsive Design 16:9, 9:16 & 1:1',
      compression: 'Native Vector Vector Graphics (Scalable to 8K without degradation)'
    },
    features: [
      '150+ Minimalist lower thirds, title cards, chapter markers, and cinema end credits',
      'Responsive design time-stretching: adjust duration without ruining intro/outro keyframes',
      'Free open-source and modern font links included with one-click licensing',
      'Dual-format: native MOGRT files plus pre-rendered 4K transparent QuickTime renders for universal use'
    ],
    folderTree: [
      { name: 'Premiere_Pro_MOGRTs', filesCount: 75, size: '3.8 GB' },
      { name: 'DaVinci_Resolve_Title_Macros', filesCount: 75, size: '3.6 GB' },
      { name: 'Universal_Transparent_Alpha_Renders', filesCount: 50, size: '2.2 GB' }
    ],
    image: '/hero-banner-2k.png',
    featured: false
  },
  {
    id: 'vvm-creator-social-kit',
    title: 'Creator Social Kit & Reel Architect',
    subtitle: 'Vertical Video Templates, Framing Overlays & Grids',
    category: 'templates',
    price: 1299,
    originalPrice: 2499,
    fileSize: '9.3 GB',
    assetsCount: '250+ Assets',
    badge: 'Upcoming',
    isUpcoming: true,
    format: 'PSD, AI, ProRes 422, MOGRT, FCPX Motion Templates',
    softwareCompatibility: ['Premiere Pro', 'DaVinci Resolve', 'Final Cut Pro', 'CapCut Pro', 'Photoshop'],
    universalFormat: true,
    description: 'Designed specifically for high-velocity short-form storytelling across Instagram Reels, YouTube Shorts, and TikTok. Includes UI mockups, safe-zone guidelines, split-screen collage layouts, and dynamic kinetic caption presets.',
    detailedSpecs: {
      resolution: 'Vertical 1080x1920 (9:16) & Square 1080x1080 (1:1)',
      compression: 'Multi-layer Master Files & QuickTime Video Loops'
    },
    features: [
      '250+ Social-first motion assets and grid layout presets',
      'Exact UI platform overlays so text never gets hidden beneath TikTok or Reels buttons',
      'Customizable color themes and dynamic auto-resizing containers',
      'Includes sample project files and workflow guide for fast turnaround'
    ],
    folderTree: [
      { name: 'Collage_Split_Grids', filesCount: 90, size: '3.4 GB' },
      { name: 'Motion_Caption_Presets', filesCount: 80, size: '2.9 GB' },
      { name: 'Social_UI_Safe_Overlays', filesCount: 80, size: '3.0 GB' }
    ],
    image: '/hero-banner-2k.png',
    featured: false
  },
  {
    id: 'vvm-freebies-pack',
    title: 'VVM Freebies Starter Pack',
    subtitle: 'Taste the Quality: Free LUTs, SFX & Film Burn Samples',
    category: 'bundles',
    price: 0,
    fileSize: '1.2 GB',
    assetsCount: '35 Free Assets',
    badge: 'Upcoming',
    isUpcoming: true,
    format: 'Universal .CUBE, 24-bit WAV, 4K ProRes 422',
    softwareCompatibility: ['Premiere Pro', 'DaVinci Resolve', 'Final Cut Pro', 'CapCut Pro', 'After Effects'],
    universalFormat: true,
    description: 'Experience the precision and master quality of Virtual Vision Media completely free. We have extracted 35 authentic assets directly from our 100GB Master Vault: 5 calibrated Hollywood LUTs, 15 punchy sound design whooshes and hits, 5 authentic film burns, and 10 modern editorial graphic elements.',
    detailedSpecs: {
      resolution: '4K UHD (3840x2160)',
      sampleRate: '96 kHz / 24-bit WAV',
      colorSpace: 'Universal Rec.709 & Apple Log'
    },
    features: [
      '5 Commercial-grade film simulation LUTs (.cube)',
      '15 Cinematic risers, whooshes, and punchy impact SFX in 96kHz 24-bit WAV',
      '5 Real optical 35mm film burn transitions with alpha channel',
      '10 Minimal title card overlays and vector graphics',
      'Commercial royalty-free license included: use freely in client or personal work'
    ],
    folderTree: [
      { name: 'Free_LUTs_CUBE', filesCount: 5, size: '120 MB' },
      { name: 'Free_SFX_WAV_96k', filesCount: 15, size: '480 MB' },
      { name: 'Free_Film_Burns_ProRes', filesCount: 5, size: '520 MB' },
      { name: 'Free_Title_Overlays', filesCount: 10, size: '80 MB' }
    ],
    image: '/vvm-150-folders.jpg',
    featured: true,
    isFree: true,
    driveLink: 'https://drive.google.com/drive/folders/1HYWrteRByCcQ66Gs2t5TkLmwH9zH5lfG'
  }
];
