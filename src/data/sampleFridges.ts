import { SampleFridge } from '../types';

// Curated Singapore home fridge sample images created as SVG data URIs
// This ensures 100% reliable local image testing without network flakiness.

const createFridgeSvg = (bgHue: string, itemsSvg: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
    <defs>
      <linearGradient id="fridgeBg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#f5efe6"/>
        <stop offset="100%" stop-color="#e3dacb"/>
      </linearGradient>
      <linearGradient id="shelfGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#d4c9b8"/>
      </linearGradient>
      <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.15"/>
      </filter>
    </defs>
    <!-- Fridge Interior Background -->
    <rect width="600" height="450" fill="url(#fridgeBg)"/>
    <rect x="25" y="20" width="550" height="410" rx="14" fill="#ffffff" stroke="#c4b8a5" stroke-width="4"/>
    
    <!-- LED Light Bar at Top -->
    <rect x="180" y="30" width="240" height="12" rx="6" fill="#e8f5e9" opacity="0.9"/>
    
    <!-- Top Shelf -->
    <rect x="35" y="145" width="530" height="14" rx="3" fill="url(#shelfGrad)" filter="url(#shadow)"/>
    
    <!-- Middle Shelf -->
    <rect x="35" y="275" width="530" height="14" rx="3" fill="url(#shelfGrad)" filter="url(#shadow)"/>
    
    <!-- Bottom Crisper Drawer Box -->
    <rect x="45" y="300" width="245" height="115" rx="8" fill="#e8f5e9" stroke="#81c784" stroke-width="2" opacity="0.6"/>
    <rect x="310" y="300" width="245" height="115" rx="8" fill="#fff3e0" stroke="#ffb74d" stroke-width="2" opacity="0.6"/>
    
    <!-- Shelf Items -->
    ${itemsSvg}
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// 1. Zi Char Veggie & Tofu Crisper
const sample1Svg = `
  <!-- Top Shelf: Eggs & Condiments -->
  <!-- Egg Carton -->
  <g transform="translate(60, 80)">
    <rect width="120" height="60" rx="8" fill="#d7ccc8" stroke="#8d6e63" stroke-width="2"/>
    <text x="60" y="35" font-family="sans-serif" font-size="12" font-weight="bold" fill="#5d4037" text-anchor="middle">EGGS (10 pcs)</text>
    <circle cx="25" cy="45" r="10" fill="#ffecb3"/>
    <circle cx="50" cy="45" r="10" fill="#ffecb3"/>
    <circle cx="75" cy="45" r="10" fill="#ffecb3"/>
    <circle cx="100" cy="45" r="10" fill="#ffecb3"/>
  </g>
  
  <!-- Sambal Belacan Jar -->
  <g transform="translate(210, 65)">
    <rect width="50" height="75" rx="6" fill="#b71c1c"/>
    <rect x="5" y="20" width="40" height="40" fill="#ffffff" rx="3"/>
    <text x="25" y="42" font-family="sans-serif" font-size="9" font-weight="bold" fill="#b71c1c" text-anchor="middle">SAMBAL</text>
    <text x="25" y="52" font-family="sans-serif" font-size="7" fill="#333" text-anchor="middle">BELACAN</text>
    <rect x="10" y="-8" width="30" height="12" fill="#ffd54f" rx="3"/>
  </g>

  <!-- Oyster Sauce Bottle -->
  <g transform="translate(280, 50)">
    <path d="M15,20 L15,0 L30,0 L30,20 L40,35 L40,90 L5,90 L5,35 Z" fill="#3e2723"/>
    <rect x="10" y="40" width="25" height="40" fill="#fff9c4"/>
    <text x="22" y="62" font-family="sans-serif" font-size="8" font-weight="bold" fill="#d84315" text-anchor="middle">OYSTER</text>
    <text x="22" y="72" font-family="sans-serif" font-size="7" fill="#3e2723" text-anchor="middle">SAUCE</text>
  </g>

  <!-- Garlic & Shallots bag -->
  <g transform="translate(350, 75)">
    <circle cx="20" cy="40" r="16" fill="#f5f5f5" stroke="#ccc" stroke-width="1.5"/>
    <circle cx="45" cy="45" r="14" fill="#f5f5f5" stroke="#ccc" stroke-width="1.5"/>
    <circle cx="70" cy="42" r="15" fill="#f8bbd0" stroke="#c2185b" stroke-width="1.5"/>
    <circle cx="95" cy="44" r="14" fill="#f8bbd0" stroke="#c2185b" stroke-width="1.5"/>
    <text x="55" y="20" font-family="sans-serif" font-size="11" font-weight="bold" fill="#4e342e" text-anchor="middle">Garlic &amp; Shallots</text>
  </g>

  <!-- Middle Shelf: Tau Kwa, Luncheon Meat, Ikan Bilis -->
  <!-- Tau Kwa Blocks in water -->
  <g transform="translate(60, 200)">
    <rect width="130" height="70" rx="6" fill="#e0f7fa" stroke="#00acc1" stroke-width="2"/>
    <rect x="15" y="15" width="45" height="45" fill="#fff9c4" stroke="#fbc02d" stroke-width="2" rx="4"/>
    <rect x="70" y="15" width="45" height="45" fill="#fff9c4" stroke="#fbc02d" stroke-width="2" rx="4"/>
    <text x="65" y="10" font-family="sans-serif" font-size="11" font-weight="bold" fill="#00838f" text-anchor="middle">2x Fresh Tau Kwa</text>
  </g>

  <!-- Luncheon Meat Can -->
  <g transform="translate(220, 195)">
    <rect width="80" height="75" rx="8" fill="#1565c0" stroke="#0d47a1" stroke-width="2"/>
    <rect x="5" y="15" width="70" height="45" fill="#ffeb3b" rx="4"/>
    <text x="40" y="38" font-family="sans-serif" font-size="10" font-weight="bold" fill="#b71c1c" text-anchor="middle">LUNCHEON</text>
    <text x="40" y="50" font-family="sans-serif" font-size="9" font-weight="bold" fill="#b71c1c" text-anchor="middle">MEAT</text>
  </g>

  <!-- Ikan Bilis Packet -->
  <g transform="translate(330, 190)">
    <rect width="90" height="80" rx="6" fill="#eceff1" stroke="#78909c" stroke-width="2"/>
    <text x="45" y="30" font-family="sans-serif" font-size="10" font-weight="bold" fill="#37474f" text-anchor="middle">CRISPY</text>
    <text x="45" y="44" font-family="sans-serif" font-size="11" font-weight="bold" fill="#00695c" text-anchor="middle">IKAN BILIS</text>
    <path d="M15,60 Q30,50 45,60 T75,60" fill="none" stroke="#607d8b" stroke-width="3"/>
  </g>

  <!-- Tau Pok packet -->
  <g transform="translate(445, 195)">
    <rect width="90" height="75" rx="6" fill="#fffde7" stroke="#fbc02d" stroke-width="2"/>
    <rect x="12" y="15" width="28" height="25" fill="#ffb74d" rx="4"/>
    <rect x="50" y="15" width="28" height="25" fill="#ffb74d" rx="4"/>
    <rect x="30" y="45" width="28" height="25" fill="#ffb74d" rx="4"/>
    <text x="45" y="10" font-family="sans-serif" font-size="10" font-weight="bold" fill="#e65100" text-anchor="middle">Tau Pok Puffs</text>
  </g>

  <!-- Bottom Crisper 1: Kangkong & Chye Sim Greens -->
  <g transform="translate(55, 310)">
    <path d="M20,90 C40,40 60,30 90,10 C120,40 140,50 180,90 Z" fill="#2e7d32"/>
    <path d="M60,95 C80,35 110,20 150,15 C170,45 190,65 210,95 Z" fill="#43a047"/>
    <rect x="50" y="45" width="130" height="24" rx="12" fill="#ffffff" opacity="0.9"/>
    <text x="115" y="61" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1b5e20" text-anchor="middle">🥬 Kangkong &amp; Chye Sim</text>
  </g>

  <!-- Bottom Crisper 2: Taugeh (Bean Sprouts) & Carrots -->
  <g transform="translate(320, 310)">
    <path d="M30,30 L100,75 L80,90 Z" fill="#ff9800"/>
    <path d="M50,20 L120,65 L100,80 Z" fill="#f57c00"/>
    <rect x="40" y="45" width="140" height="24" rx="12" fill="#ffffff" opacity="0.9"/>
    <text x="110" y="61" font-family="sans-serif" font-size="12" font-weight="bold" fill="#e65100" text-anchor="middle">🌱 Taugeh &amp; Carrot</text>
  </g>
`;

// 2. Kopitiam Breakfast & Pantry Spread
const sample2Svg = `
  <!-- Top Shelf: Butter, Kaya & Soya Sauce -->
  <g transform="translate(60, 65)">
    <rect width="85" height="70" rx="8" fill="#e8f5e9" stroke="#388e3c" stroke-width="2"/>
    <circle cx="42" cy="35" r="22" fill="#a5d6a7"/>
    <text x="42" y="38" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1b5e20" text-anchor="middle">KAYA</text>
    <text x="42" y="50" font-family="sans-serif" font-size="8" fill="#2e7d32" text-anchor="middle">PANDAN</text>
  </g>

  <g transform="translate(170, 75)">
    <rect width="90" height="60" rx="6" fill="#fff59d" stroke="#fbc02d" stroke-width="2"/>
    <text x="45" y="35" font-family="sans-serif" font-size="11" font-weight="bold" fill="#f57f17" text-anchor="middle">SCS BUTTER</text>
  </g>

  <g transform="translate(290, 50)">
    <rect width="45" height="90" rx="6" fill="#212121"/>
    <rect x="5" y="30" width="35" height="40" fill="#fff"/>
    <text x="22" y="50" font-family="sans-serif" font-size="8" font-weight="bold" fill="#d32f2f" text-anchor="middle">KECAP</text>
    <text x="22" y="60" font-family="sans-serif" font-size="8" font-weight="bold" fill="#212121" text-anchor="middle">MANIS</text>
  </g>

  <g transform="translate(360, 70)">
    <circle cx="25" cy="35" r="22" fill="#fff3e0" stroke="#ff9800" stroke-width="2"/>
    <circle cx="75" cy="35" r="22" fill="#fff3e0" stroke="#ff9800" stroke-width="2"/>
    <text x="50" y="38" font-family="sans-serif" font-size="10" font-weight="bold" fill="#e65100" text-anchor="middle">Eggs (6x)</text>
  </g>

  <!-- Middle Shelf: Canned Sardines, Luncheon Meat, Overnight Rice Bowl -->
  <g transform="translate(60, 190)">
    <ellipse cx="60" cy="30" rx="55" ry="25" fill="#d32f2f"/>
    <rect x="5" y="30" width="110" height="45" fill="#d32f2f"/>
    <ellipse cx="60" cy="75" rx="55" ry="25" fill="#b71c1c"/>
    <text x="60" y="55" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">AYAM BRAND SARDINES</text>
  </g>

  <g transform="translate(200, 195)">
    <rect width="85" height="75" rx="8" fill="#0277bd" stroke="#01579b" stroke-width="2"/>
    <rect x="8" y="15" width="70" height="45" fill="#ffee58" rx="4"/>
    <text x="42" y="42" font-family="sans-serif" font-size="10" font-weight="bold" fill="#b71c1c" text-anchor="middle">MA LING</text>
  </g>

  <g transform="translate(320, 185)">
    <path d="M20,30 Q90,30 160,30 Q170,85 90,85 Q10,85 20,30 Z" fill="#ffffff" stroke="#9e9e9e" stroke-width="2"/>
    <ellipse cx="90" cy="30" rx="70" ry="16" fill="#fafafa"/>
    <text x="90" y="35" font-family="sans-serif" font-size="11" font-weight="bold" fill="#424242" text-anchor="middle">🍚 Overnight Cooked Rice</text>
  </g>

  <!-- Bottom Drawer: Spring Onion, Tomatoes, Cucumber -->
  <g transform="translate(55, 310)">
    <path d="M20,80 L180,20" stroke="#2e7d32" stroke-width="8" stroke-linecap="round"/>
    <path d="M30,90 L200,30" stroke="#43a047" stroke-width="6" stroke-linecap="round"/>
    <circle cx="70" cy="70" r="18" fill="#e53935"/>
    <circle cx="110" cy="75" r="16" fill="#e53935"/>
    <rect x="50" y="35" width="140" height="24" rx="12" fill="#ffffff" opacity="0.9"/>
    <text x="120" y="51" font-family="sans-serif" font-size="11" font-weight="bold" fill="#c62828" text-anchor="middle">🍅 Tomatoes &amp; Scallions</text>
  </g>

  <g transform="translate(320, 310)">
    <rect x="30" y="30" width="160" height="50" rx="25" fill="#81c784"/>
    <rect x="40" y="35" width="140" height="24" rx="12" fill="#ffffff" opacity="0.9"/>
    <text x="110" y="51" font-family="sans-serif" font-size="11" font-weight="bold" fill="#2e7d32" text-anchor="middle">🥒 Japanese Cucumber</text>
  </g>
`;

// 3. Wet Market Seafood & Greens Harvest
const sample3Svg = `
  <!-- Top Shelf: Belacan, Garlic, Chilli Padi, Calamansi Lime -->
  <g transform="translate(60, 65)">
    <rect width="70" height="70" rx="8" fill="#5d4037" stroke="#3e2723" stroke-width="2"/>
    <text x="35" y="35" font-family="sans-serif" font-size="9" font-weight="bold" fill="#fff" text-anchor="middle">TOASTED</text>
    <text x="35" y="48" font-family="sans-serif" font-size="10" font-weight="bold" fill="#ffccbc" text-anchor="middle">BELACAN</text>
  </g>

  <g transform="translate(155, 70)">
    <circle cx="20" cy="30" r="14" fill="#d32f2f"/>
    <circle cx="35" cy="40" r="13" fill="#d32f2f"/>
    <circle cx="50" cy="32" r="14" fill="#c62828"/>
    <text x="35" y="10" font-family="sans-serif" font-size="10" font-weight="bold" fill="#b71c1c" text-anchor="middle">Chilli Padi (10x)</text>
  </g>

  <g transform="translate(260, 70)">
    <circle cx="20" cy="35" r="15" fill="#7cb342"/>
    <circle cx="45" cy="40" r="14" fill="#8bc34a"/>
    <circle cx="70" cy="36" r="15" fill="#689f38"/>
    <text x="45" y="10" font-family="sans-serif" font-size="10" font-weight="bold" fill="#33691e" text-anchor="middle">Calamansi Limes</text>
  </g>

  <g transform="translate(370, 70)">
    <rect width="140" height="60" rx="8" fill="#ffecb3" stroke="#ffa000" stroke-width="1.5"/>
    <text x="70" y="35" font-family="sans-serif" font-size="11" font-weight="bold" fill="#e65100" text-anchor="middle">Fresh Eggs (6x)</text>
  </g>

  <!-- Middle Shelf: Prawns/Shrimp, Yellow Noodles, Fishcake -->
  <g transform="translate(60, 190)">
    <rect width="140" height="75" rx="8" fill="#e0f2f1" stroke="#00897b" stroke-width="2"/>
    <path d="M30,30 Q60,15 80,45 Q70,60 40,55 Z" fill="#ff7043"/>
    <path d="M60,40 Q90,25 110,55 Q100,70 70,65 Z" fill="#ff8a65"/>
    <text x="70" y="70" font-family="sans-serif" font-size="10" font-weight="bold" fill="#004d40" text-anchor="middle">🦐 Fresh Prawns (8 pcs)</text>
  </g>

  <g transform="translate(220, 195)">
    <rect width="120" height="70" rx="8" fill="#fff9c4" stroke="#fbc02d" stroke-width="2"/>
    <path d="M20,35 Q60,20 100,35 Q70,55 30,50" stroke="#fdd835" stroke-width="6" fill="none"/>
    <text x="60" y="65" font-family="sans-serif" font-size="10" font-weight="bold" fill="#f57f17" text-anchor="middle">🍜 Yellow Hokkien Noodles</text>
  </g>

  <g transform="translate(360, 195)">
    <rect width="140" height="70" rx="8" fill="#f5f5f5" stroke="#9e9e9e" stroke-width="2"/>
    <rect x="20" y="20" width="100" height="22" rx="10" fill="#fff8e1" stroke="#ffb300" stroke-width="2"/>
    <text x="70" y="60" font-family="sans-serif" font-size="10" font-weight="bold" fill="#37474f" text-anchor="middle">Fried Fish Cake (2 pcs)</text>
  </g>

  <!-- Bottom Drawer: Bak Choy, Tau Pok, Bean Sprouts -->
  <g transform="translate(55, 310)">
    <path d="M30,90 C60,45 80,30 120,20 C150,55 170,75 190,95 Z" fill="#388e3c"/>
    <rect x="50" y="45" width="130" height="24" rx="12" fill="#ffffff" opacity="0.9"/>
    <text x="115" y="61" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1b5e20" text-anchor="middle">🥬 Crisp Bak Choy</text>
  </g>

  <g transform="translate(320, 310)">
    <path d="M40,30 L110,80" stroke="#c8e6c9" stroke-width="6"/>
    <rect x="40" y="45" width="150" height="24" rx="12" fill="#ffffff" opacity="0.9"/>
    <text x="115" y="61" font-family="sans-serif" font-size="11" font-weight="bold" fill="#2e7d32" text-anchor="middle">🌱 Taugeh &amp; Tau Pok</text>
  </g>
`;

export const SAMPLE_FRIDGES: SampleFridge[] = [
  {
    id: 'zichar-veggie-tofu',
    title: 'Zi Char Veggie & Tofu Fridge',
    subtitle: 'Kangkong, Tau Kwa, Sambal & Ikan Bilis',
    description: 'Fresh greens, firm tofu, luncheon meat, eggs, sambal belacan, and crispy ikan bilis.',
    imageUrl: createFridgeSvg('#388e3c', sample1Svg),
    badge: 'Popular SG Combo 🥬',
  },
  {
    id: 'kopitiam-breakfast',
    title: 'Kopitiam Breakfast & Pantry',
    subtitle: 'Overnight Rice, Luncheon Meat, Kaya & Eggs',
    description: 'Cold rice, luncheon meat can, fresh eggs, cucumber, spring onion, and dark soy sauce.',
    imageUrl: createFridgeSvg('#d32f2f', sample2Svg),
    badge: 'Classic Comfort 🍳',
  },
  {
    id: 'wet-market-noodles',
    title: 'Wet Market Noodle Harvest',
    subtitle: 'Yellow Noodles, Prawns, Fishcake & Bak Choy',
    description: 'Yellow noodles, fresh prawns, fried fishcake, bak choy, calamansi, and chilli padi.',
    imageUrl: createFridgeSvg('#f57c00', sample3Svg),
    badge: 'Seafood Noodle Shiok 🍜',
  },
];
