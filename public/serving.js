// "How to serve" guide: an illustrated plate for each age stage, per food.
// Original illustrations and copy (drawn as inline SVG), not derived from any third-party guide.

import { COLORS } from './foods.js';

// Age stages covered by this tracker (months).
export const STAGES = [
  { key: 's1', label: '8–9 mo', sub: 'Whole-hand grab', from: 8, to: 9 },
  { key: 's2', label: '9–12 mo', sub: 'Pincer pinch', from: 9, to: 12 },
  { key: 's3', label: '12 mo+', sub: 'Toddler bites', from: 12, to: 99 },
];
export const stageIndexFor = (months) => (months < 9 ? 0 : months < 12 ? 1 : 2);

// Cut styles: name + size/handling hint. The drawing for each is in SHAPES below.
const STYLE = {
  puree:   { name: 'Smooth purée',          hint: 'Pre-load a spoon and hand it over' },
  mash:    { name: 'Lumpy mash',            hint: 'A few soft lumps teach chewing' },
  spoon:   { name: 'Thick on a spoon',      hint: 'Pre-load it; let him steer' },
  spear:   { name: 'Long soft spears',      hint: 'About two adult fingers wide' },
  gnaw:    { name: 'Big piece to gnaw',     hint: 'Larger than his mouth, so he munches' },
  wedge:   { name: 'Large ripe wedges',     hint: 'Skin on can help grip' },
  floret:  { name: 'Big florets',           hint: 'The stalk is the handle' },
  bites:   { name: 'Soft bite-size pieces', hint: 'About chickpea size, squishable' },
  flatten: { name: 'Squished flat',         hint: 'Press between your fingers' },
  quarter: { name: 'Quartered lengthwise',  hint: 'Cut tip to tip into 4' },
  grated:  { name: 'Finely grated',         hint: 'Light, fluffy shreds' },
  slice:   { name: 'Paper-thin slices',     hint: 'Thin strips, never cubes' },
  shred:   { name: 'Finely shredded',       hint: 'Pull apart with two forks' },
  flake:   { name: 'Soft flakes',           hint: 'Feel through for bones' },
  ball:    { name: 'Soft balls or patties', hint: 'Should squash with light pressure' },
  spread:  { name: 'Thin smear',            hint: 'Spread thin, never a glob' },
  ground:  { name: 'Finely ground, mixed in', hint: 'Powder-fine, stirred into food' },
  stir:    { name: 'Stirred into food',     hint: 'A pinch or a little goes far' },
  cob:     { name: 'Cob rounds to gnaw',    hint: 'Cut into 2-inch rounds' },
  cup:     { name: 'Small open cup',        hint: 'A few sips with meals' },
  notYet:  { name: 'Not yet',               hint: '' },
};

// Profiles: one [style, note] per stage.
const P = {
  softFruit:  [['spear', 'Ripe enough to squash between your fingers'], ['bites', 'Small soft pieces to pinch up'], ['bites', 'Or pre-load a fork for practice']],
  firmFruit:  [['grated', 'Or cooked until very soft'], ['slice', 'Cooked soft, thin slices'], ['slice', 'Raw only if paper-thin or grated']],
  smallRound: [['flatten', 'Smash each one flat'], ['quarter', 'Every single one'], ['quarter', 'Keep quartering until age 4']],
  softBerry:  [['flatten', 'Lightly squished'], ['bites', 'Torn in half if large'], ['bites', 'Whole if soft and small']],
  bigBerry:   [['gnaw', 'A whole large berry to munch'], ['bites', 'Thin slices or small pieces'], ['bites', 'Small pieces']],
  fibrous:    [['spear', 'A ripe spear or the core to gnaw'], ['bites', 'Very small, ripe pieces'], ['bites', 'Small bite-size pieces']],
  citrus:     [['wedge', 'Segment, membrane and seeds removed'], ['bites', 'Segments cut small'], ['bites', 'Small segment pieces']],
  dried:      [['puree', 'Soaked and blended'], ['mash', 'Soaked soft, finely chopped'], ['bites', 'Soaked, cut small']],
  taste:      [['stir', 'Squeeze over veg or fish'], ['stir', 'A lick of a wedge is fine'], ['stir', 'Flavor dressings & dips']],
  sprinkle:   [['ground', 'Unsweetened, sprinkled on'], ['ground', 'Mixed into yogurt or oats'], ['ground', 'Sprinkled or baked in']],
  arils:      [['notYet', ''], ['notYet', ''], ['flatten', 'A few arils crushed into yogurt']],
  cookedVeg:  [['spear', 'Cooked fork-tender'], ['bites', 'Cooked, soft pieces'], ['bites', 'Soft pieces; fork practice']],
  hardVeg:    [['spear', 'Cooked until very soft'], ['bites', 'Cooked soft, small pieces'], ['grated', 'Cooked bites or raw, finely grated']],
  rawSoftVeg: [['spear', 'Peeled, long and wide'], ['bites', 'Thin small pieces'], ['bites', 'Thin slices or small pieces']],
  floret:     [['floret', 'Steamed until soft'], ['bites', 'Small soft florets'], ['bites', 'Small florets; fork practice']],
  leafy:      [['stir', 'Cooked, finely chopped into food'], ['stir', 'Cooked, chopped into eggs or pasta'], ['bites', 'Cooked and chopped']],
  roastQuarter:[['mash', 'Roasted soft and mashed'], ['quarter', 'Roasted soft, quartered'], ['quarter', 'Roasted, quartered']],
  mashVeg:    [['mash', 'Mashed, no added salt'], ['bites', 'Soft roasted pieces'], ['bites', 'Soft pieces']],
  cookedBits: [['stir', 'Cooked soft, chopped into dishes'], ['bites', 'Cooked soft, small pieces'], ['bites', 'Small cooked pieces']],
  tomato:     [['wedge', 'Ripe, large wedges'], ['quarter', 'Cherry tomatoes quartered'], ['quarter', 'Cherry tomatoes quartered']],
  corn:       [['cob', 'Cooked cob to gnaw'], ['cob', 'Cob rounds or creamed corn'], ['bites', 'Loose kernels are okay now']],
  legume:     [['flatten', 'Soft-cooked and smashed'], ['flatten', 'Smashed, or as a dip'], ['bites', 'Soft whole ones, watched closely']],
  lentil:     [['spoon', 'Cooked into a soft dal'], ['spoon', 'Thick dal or patties'], ['spoon', 'Dal, soups or patties']],
  meat:       [['ball', 'Soft meatballs, or a big slow-cooked strip'], ['shred', 'Moist dark meat, slow-cooked'], ['bites', 'Small tender bites']],
  pate:       [['spread', 'Pâté on a toast strip'], ['spread', 'Thin on toast or in sauce'], ['spread', 'About once a week']],
  fish:       [['flake', 'Large soft flakes, no bones'], ['flake', 'Flakes he can pinch'], ['flake', 'Flakes or in patties']],
  mashFish:   [['mash', 'Mashed with yogurt or avocado'], ['mash', 'Mixed into patties'], ['bites', 'In patties or flakes']],
  shellfish:  [['ball', 'Minced into soft patties'], ['bites', 'Finely chopped'], ['bites', 'Small chopped pieces']],
  egg:        [['spear', 'Omelet strips, fully cooked'], ['bites', 'Scrambled pieces'], ['bites', 'Scrambled or chopped boiled']],
  nutButter:  [['spread', 'Thinned, or smeared on a toast strip'], ['spread', 'Thin on toast or swirled in'], ['spread', 'Thin layer only']],
  groundNut:  [['ground', 'Stirred into oatmeal or yogurt'], ['ground', 'Mixed in or baked in'], ['ground', 'No whole nuts until 4+']],
  tofu:       [['spear', 'Firm tofu strips'], ['bites', 'Small cubes, soft'], ['bites', 'Small cubes']],
  scoop:      [['spoon', 'Pre-loaded spoon'], ['spoon', 'Dip food into it too'], ['spoon', 'Self-spooning practice']],
  spreadDairy:[['spread', 'Thin on a toast strip'], ['spread', 'On toast or in pasta'], ['spread', 'Thin layer']],
  hardCheese: [['slice', 'Thin slices or strips'], ['grated', 'Grated or shredded'], ['bites', 'Small pieces, not cubes']],
  fat:        [['stir', 'Melted onto veg or grains'], ['stir', 'Mixed into food'], ['stir', 'Cook with it']],
  drink:      [['notYet', ''], ['notYet', ''], ['cup', 'Whole milk in an open cup']],
  sip:        [['cup', 'A few sips, or mixed into oats'], ['cup', 'Open cup or in oats'], ['cup', 'Open cup']],
  porridge:   [['spoon', 'Thick porridge'], ['ball', 'Baked oat fingers or porridge'], ['spoon', 'Porridge or oat bars']],
  riceBall:   [['ball', 'Sticky rice balls'], ['bites', 'Rice clumps to pinch'], ['spoon', 'Spoon or fork']],
  smallGrain: [['ball', 'Mixed into soft patties'], ['spoon', 'Stirred into mash or yogurt'], ['spoon', 'Spoon or fork']],
  pasta:      [['spear', 'Large shapes, cooked soft'], ['bites', 'Small shapes or cut pieces'], ['bites', 'Fork practice']],
  bread:      [['spear', 'Lightly toasted strips'], ['bites', 'Small toast squares'], ['bites', 'Small pieces or sandwiches']],
  cereal:     [['spoon', 'Infant cereal, thick'], ['spoon', 'Mixed with fruit'], ['spoon', 'Self-spooning']],
  spice:      [['stir', 'A pinch in purée or mash'], ['stir', 'Season his meals'], ['stir', 'Family-meal seasoning']],
  honey:      [['notYet', ''], ['notYet', ''], ['stir', 'A tiny drizzle, sparingly']],
};

// Food → profile. Anything not listed falls back to its category.
const FOOD_PROFILE = {
  peanut: 'nutButter', almond: 'nutButter', cashew: 'nutButter', hazelnut: 'nutButter', sesame: 'nutButter',
  walnut: 'groundNut', pistachio: 'groundNut', pecan: 'groundNut',
  egg: 'egg', yogurt: 'scoop', 'wheat-cereal': 'cereal', tofu: 'tofu',
  salmon: 'fish', cod: 'fish', tuna: 'mashFish', sardines: 'mashFish', shrimp: 'shellfish', crab: 'shellfish',
  banana: 'softFruit', avocado: 'softFruit', pear: 'softFruit', peach: 'softFruit', mango: 'softFruit', papaya: 'softFruit',
  kiwi: 'softFruit', watermelon: 'softFruit', cantaloupe: 'softFruit', plum: 'softFruit', apricot: 'softFruit',
  apple: 'firmFruit', blueberry: 'smallRound', grapes: 'smallRound', cherry: 'smallRound', blackberry: 'smallRound',
  raspberry: 'softBerry', strawberry: 'bigBerry', pineapple: 'fibrous', orange: 'citrus', fig: 'softFruit',
  prune: 'dried', coconut: 'sprinkle', pomegranate: 'arils', lemon: 'taste',
  'sweet-potato': 'cookedVeg', butternut: 'cookedVeg', zucchini: 'cookedVeg', 'green-beans': 'cookedVeg', asparagus: 'cookedVeg',
  beet: 'cookedVeg', 'bell-pepper': 'cookedVeg', eggplant: 'cookedVeg', okra: 'cookedVeg',
  carrot: 'hardVeg', parsnip: 'hardVeg', celery: 'cookedBits', cucumber: 'rawSoftVeg',
  broccoli: 'floret', cauliflower: 'floret', spinach: 'leafy', kale: 'leafy', cabbage: 'leafy', brussels: 'roastQuarter',
  pumpkin: 'mashVeg', potato: 'mashVeg', peas: 'legume', tomato: 'tomato', corn: 'corn',
  mushroom: 'cookedBits', onion: 'cookedBits', artichoke: 'cookedBits',
  chicken: 'meat', turkey: 'meat', beef: 'meat', pork: 'meat', lamb: 'meat', liver: 'pate',
  lentils: 'lentil', 'black-beans': 'legume', chickpeas: 'legume', 'kidney-beans': 'legume', 'white-beans': 'legume', edamame: 'legume',
  oats: 'porridge', rice: 'riceBall', quinoa: 'smallGrain', barley: 'smallGrain', millet: 'smallGrain', couscous: 'smallGrain',
  polenta: 'smallGrain', buckwheat: 'smallGrain', pasta: 'pasta', bread: 'bread',
  cheddar: 'hardCheese', mozzarella: 'hardCheese', ricotta: 'spreadDairy', 'cream-cheese': 'spreadDairy', butter: 'fat',
  kefir: 'sip', 'cow-milk': 'drink', 'olive-oil': 'fat', chia: 'sprinkle', honey: 'honey',
};
const CATEGORY_PROFILE = {
  Allergens: 'mashVeg', Fruits: 'softFruit', Vegetables: 'cookedVeg', Proteins: 'meat', Legumes: 'legume',
  Grains: 'smallGrain', Dairy: 'scoop', 'Herbs & Spices': 'spice', Other: 'mashVeg',
};

// Foods on common choking-hazard lists when served the wrong way.
export const CHOKING = new Set([
  'grapes', 'blueberry', 'cherry', 'tomato', 'apple', 'carrot', 'celery', 'corn', 'peanut', 'almond', 'cashew',
  'walnut', 'hazelnut', 'pistachio', 'pecan', 'chickpeas', 'edamame', 'peas', 'cheddar', 'pomegranate', 'blackberry',
]);

export function servingPlan(food) {
  const profile = P[FOOD_PROFILE[food.id]] || P[CATEGORY_PROFILE[food.cat]] || P.mashVeg;
  return STAGES.map((st, n) => {
    let [style, note] = profile[n];
    if ((food.min || 8) >= st.to) { style = 'notYet'; note = `From ${food.min} months`; }
    if (style === 'notYet' && !note) note = `From ${food.min || 12} months`;
    return { stage: st, style, note, ...STYLE[style] };
  });
}

// ---------------------------------------------------------------- drawings
// Detailed, original inline-SVG illustrations: shaded food on a top-down plate (viewBox 110×100).

// Realistic tints for common foods (fallback: the food's color group).
const TINT = {
  mango: '#f7a928', banana: '#f2d464', avocado: '#9cc26b', pear: '#e6dc8a', peach: '#f7b072', papaya: '#f58a4b',
  kiwi: '#8cc152', watermelon: '#f2576a', cantaloupe: '#f7a96b', orange: '#f7962b', pineapple: '#f6d04d', apple: '#f2e2a8',
  strawberry: '#e8394a', raspberry: '#d9365c', blueberry: '#4b5aa8', blackberry: '#3a2b4f', grapes: '#7d4b8c', cherry: '#a8172f',
  plum: '#7c2d5c', apricot: '#f5a64a', fig: '#8a4a6a', prune: '#5a3340', coconut: '#f5efe2',
  'sweet-potato': '#f08a3c', carrot: '#f2862b', butternut: '#f5a441', pumpkin: '#f0912f', zucchini: '#7fb15a',
  'green-beans': '#5f9e3f', peas: '#7cbf4a', broccoli: '#4d8f3a', cauliflower: '#efe7cf', spinach: '#3f7a35', kale: '#3a6e3a',
  beet: '#9b2d5a', asparagus: '#78a84a', 'bell-pepper': '#e2473a', tomato: '#e5473b', cucumber: '#a8cf7a', corn: '#f4cd3b',
  potato: '#efd9a0', parsnip: '#eadcb5', eggplant: '#6b3f7a', mushroom: '#c9a989', brussels: '#6fa548', cabbage: '#8c5aa8',
  chicken: '#e8c9a0', turkey: '#e3c39b', beef: '#8a4a32', pork: '#e4b796', lamb: '#9b5a42', liver: '#7a3a32',
  salmon: '#f4895f', cod: '#f3ede2', tuna: '#c99a7d', sardines: '#a8a29a', shrimp: '#f59a7a', crab: '#f4e6dc',
  egg: '#f6d55c', tofu: '#f5efdc', cheddar: '#f2b33d', mozzarella: '#f6f1e4', bread: '#d9a35e', pasta: '#f2d27a',
  oats: '#e2cfa3', rice: '#f6f2e6', lentils: '#e2954a', chickpeas: '#e6c68a', 'black-beans': '#3a3340', edamame: '#7cb34a',
  peanut: '#c58a4a', almond: '#c9935a', cashew: '#e3c48e', sesame: '#d9b77e', hazelnut: '#b98048', walnut: '#a77a4a',
  yogurt: '#f7f5ef', kefir: '#f7f5ef', 'cow-milk': '#fbfbf7', honey: '#f0b43a',
};
// Surface textures.
const TEX = {
  mango: 'fiber', papaya: 'fiber', peach: 'fiber', pineapple: 'fiber', cantaloupe: 'fiber', apricot: 'fiber',
  strawberry: 'seeds', fig: 'seeds', kiwi: 'kiwi', banana: 'speck', watermelon: 'speck',
  chicken: 'grain', turkey: 'grain', beef: 'grain', pork: 'grain', lamb: 'grain',
  bread: 'crumb', oats: 'crumb', tofu: 'crumb', 'sweet-potato': 'fiber', carrot: 'rings', parsnip: 'rings',
};
// Foods whose "spear" is a rectangular strip rather than a half-oval slice.
const STRIP = new Set(['bread', 'egg', 'tofu', 'pasta', 'cheddar', 'mozzarella', 'cucumber', 'zucchini']);

const hex = (h) => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const toHex = (r) => '#' + r.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
const mix = (a, b, t) => { const A = hex(a), B = hex(b); return toHex(A.map((v, i) => v + (B[i] - v) * t)); };
const palette = (c) => ({
  base: c, light: mix(c, '#ffffff', 0.35), lighter: mix(c, '#ffffff', 0.62), dark: mix(c, '#000000', 0.18),
  darker: mix(c, '#000000', 0.34), stroke: mix(c, '#000000', 0.38), shine: mix(c, '#ffffff', 0.85),
});

let uidN = 0;
const f2 = (n) => n.toFixed(2);

// Plate + shared defs. Every drawing receives `d` = { id, pal, tex, food, stage }.
function plate(inner, d, { locked = false } = {}) {
  const { id, pal } = d;
  return `<svg viewBox="0 0 110 100" class="plate-svg" aria-hidden="true"><defs>
    <radialGradient id="pl${id}" cx="45%" cy="40%" r="60%"><stop offset="0" stop-color="#fff"/><stop offset=".75" stop-color="#f7f8f9"/><stop offset="1" stop-color="#e8ebee"/></radialGradient>
    <radialGradient id="wl${id}" cx="50%" cy="45%" r="55%"><stop offset=".7" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#dde2e6" stop-opacity=".9"/></radialGradient>
    <linearGradient id="bd${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${pal.light}"/><stop offset=".5" stop-color="${pal.base}"/><stop offset="1" stop-color="${pal.dark}"/></linearGradient>
    <radialGradient id="gl${id}" cx="38%" cy="30%" r="65%"><stop offset="0" stop-color="${pal.shine}" stop-opacity=".8"/><stop offset="1" stop-color="${pal.shine}" stop-opacity="0"/></radialGradient>
    <radialGradient id="sp${id}" cx="35%" cy="32%" r="75%"><stop offset="0" stop-color="${pal.lighter}"/><stop offset=".55" stop-color="${pal.base}"/><stop offset="1" stop-color="${pal.darker}"/></radialGradient>
    <linearGradient id="st${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d9dfe4"/><stop offset=".5" stop-color="#f8fafb"/><stop offset="1" stop-color="#b3bcc4"/></linearGradient>
    <filter id="sh${id}" x="-25%" y="-25%" width="150%" height="170%"><feDropShadow dx="0" dy="1.5" stdDeviation="1.1" flood-color="${pal.darker}" flood-opacity=".3"/></filter>
    <filter id="ps${id}" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="2.5" stdDeviation="2.2" flood-color="#1c2b36" flood-opacity=".15"/></filter>
  </defs>
  <circle cx="52" cy="50" r="46" fill="url(#pl${id})" filter="url(#ps${id})"/>
  <circle cx="52" cy="50" r="46" fill="none" stroke="#e1e5e9" stroke-width="1"/>
  <circle cx="52" cy="50" r="36" fill="url(#wl${id})" stroke="#e5e9ec" stroke-width=".8"/>
  <path d="M24 32a34 34 0 0 1 20-14" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".9"/>
  ${locked ? inner : `<g filter="url(#sh${id})">${inner}</g>`}</svg>`;
}

// Surface texture inside a clipped shape (local coords, roughly x∈[-w/2,w/2], y∈[-h,h]).
function texture(d, w, h) {
  const { pal, tex } = d;
  if (tex === 'fiber') return [0.3, 0.55, 0.78].map((t) => `<path d="M${f2(-w * 0.38)} ${f2(-h * t * 0.9)} C${f2(-w * 0.15)} ${f2(-h * (t + 0.12))}, ${f2(w * 0.15)} ${f2(-h * (t + 0.1))}, ${f2(w * 0.38)} ${f2(-h * t * 0.8)}" stroke="${pal.dark}" stroke-width=".5" fill="none" opacity=".45"/>`).join('');
  if (tex === 'seeds') return Array.from({ length: 9 }, (_, i) => `<ellipse cx="${f2(-w * 0.35 + (i % 5) * w * 0.17)}" cy="${f2(-h * (0.25 + 0.35 * (i % 2)) + (i > 4 ? h * 0.2 : 0))}" rx=".8" ry="1.2" fill="#f7e27a" stroke="${pal.darker}" stroke-width=".3"/>`).join('');
  if (tex === 'kiwi') return `<ellipse cx="0" cy="${f2(-h * 0.45)}" rx="${f2(w * 0.18)}" ry="${f2(h * 0.18)}" fill="#f3f1d8" opacity=".85"/>` + Array.from({ length: 10 }, (_, i) => { const a = i / 10 * Math.PI * 2; return `<ellipse cx="${f2(Math.cos(a) * w * 0.26)}" cy="${f2(-h * 0.45 + Math.sin(a) * h * 0.3)}" rx=".7" ry="1.1" fill="#2a2a1f" transform="rotate(${f2(a * 57)} ${f2(Math.cos(a) * w * 0.26)} ${f2(-h * 0.45 + Math.sin(a) * h * 0.3)})"/>`; }).join('');
  if (tex === 'speck') return Array.from({ length: 6 }, (_, i) => `<circle cx="${f2(-w * 0.3 + i * w * 0.12)}" cy="${f2(-h * 0.45 + (i % 2) * h * 0.15)}" r=".7" fill="${pal.darker}" opacity=".55"/>`).join('');
  if (tex === 'grain') return [0.25, 0.45, 0.65].map((t) => `<path d="M${f2(-w * 0.42)} ${f2(-h * t)} Q0 ${f2(-h * (t + 0.08))} ${f2(w * 0.42)} ${f2(-h * t)}" stroke="${pal.dark}" stroke-width=".6" fill="none" opacity=".5"/>`).join('');
  if (tex === 'crumb') return Array.from({ length: 8 }, (_, i) => `<circle cx="${f2(-w * 0.38 + (i * 37 % 100) / 100 * w * 0.76)}" cy="${f2(-h * 0.2 - (i * 53 % 100) / 100 * h * 0.6)}" r=".55" fill="${pal.dark}" opacity=".5"/>`).join('');
  if (tex === 'rings') return [0.2, 0.4, 0.6].map((t) => `<path d="M${f2(-w * 0.5 + t * w)} ${f2(-h * 0.85)} q1 ${f2(h * 0.5)} 0 ${f2(h * 0.9)}" stroke="${pal.dark}" stroke-width=".5" fill="none" opacity=".45"/>`).join('');
  return '';
}

// Elongated half-oval slice (flat cut edge at the bottom, rounded top, tapered tips).
function halfOval(d, cx, cy, len, h, rot, k = 0) {
  const { id, pal } = d, cid = `c${id}_${uidN++}`, x0 = -len / 2, x1 = len / 2;
  const top = `M${f2(x0)} 0 C${f2(x0 + len * 0.12)} ${f2(-h * 1.05)}, ${f2(x1 - len * 0.2)} ${f2(-h * 1.08)}, ${f2(x1)} ${f2(-h * 0.05)}`;
  const flat = `Q${f2(x1 - len * 0.05)} ${f2(h * 0.12)} ${f2(x1 - len * 0.12)} ${f2(h * 0.14)} L${f2(x0 + len * 0.1)} ${f2(h * 0.14)} Q${f2(x0 + len * 0.02)} ${f2(h * 0.1)} ${f2(x0)} 0Z`;
  return `<g transform="translate(${cx} ${cy}) rotate(${rot})"><clipPath id="${cid}"><path d="${top} ${flat}"/></clipPath>
    <path d="${top} ${flat}" fill="url(#bd${id})" stroke="${pal.stroke}" stroke-width=".8" stroke-linejoin="round"/>
    <g clip-path="url(#${cid})"><path d="${top} ${flat}" fill="url(#gl${id})"/>${texture(d, len, h)}
      <path d="M${f2(x0 + len * 0.1)} ${f2(h * 0.06)} L${f2(x1 - len * 0.14)} ${f2(h * 0.06)}" stroke="${pal.dark}" stroke-width="1.1" stroke-linecap="round" opacity=".5"/>
      <path d="M${f2(x0 + len * 0.16)} ${f2(-h * 0.62)} C${f2(x0 + len * 0.3)} ${f2(-h * 0.95)}, ${f2(x1 - len * 0.45)} ${f2(-h * 0.98)}, ${f2(x1 - len * 0.28)} ${f2(-h * 0.86)}" stroke="${pal.shine}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".95"/>
      <ellipse cx="${f2(x0 + len * 0.3 + k)}" cy="${f2(-h * 0.5)}" rx="2.2" ry="1" fill="#fff" opacity=".7"/></g></g>`;
}

// Rounded rectangular strip (toast fingers, omelet strips, tofu, cheese).
function strip(d, cx, cy, len, h, rot) {
  const { id, pal } = d, cid = `c${id}_${uidN++}`;
  const r = `M${f2(-len / 2 + 3)} ${f2(-h)} h${f2(len - 6)} q3 0 3 3 v${f2(h * 2 - 6)} q0 3 -3 3 h${f2(-(len - 6))} q-3 0 -3 -3 v${f2(-(h * 2 - 6))} q0 -3 3 -3z`;
  const crust = d.food.id === 'bread' ? `<path d="${r}" fill="none" stroke="#a8692b" stroke-width="2.2"/>` : '';
  return `<g transform="translate(${cx} ${cy}) rotate(${rot})"><clipPath id="${cid}"><path d="${r}"/></clipPath>
    <path d="${r}" fill="url(#bd${id})" stroke="${pal.stroke}" stroke-width=".8"/>
    <g clip-path="url(#${cid})"><path d="${r}" fill="url(#gl${id})"/><g transform="translate(0 ${f2(h)})">${texture(d, len, h * 2)}</g>${crust}
    <path d="M${f2(-len / 2 + 4)} ${f2(-h + 2)} h${f2(len * 0.55)}" stroke="${pal.shine}" stroke-width="1.2" stroke-linecap="round" opacity=".9"/></g></g>`;
}

// Irregular hand-cut chunk with juicy gradient and glossy highlight.
function chunk(d, x, y, s, rot, seed) {
  const { id, pal } = d, n = 7, pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + seed, r = s * (0.78 + 0.22 * Math.sin(seed * 3.1 + i * 2.3));
    pts.push([Math.cos(a) * r * 1.08, Math.sin(a) * r * 0.9]);
  }
  let p = '';
  for (let i = 0; i < n; i++) {
    const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % n], [x3, y3] = pts[(i + 2) % n];
    if (i === 0) p += `M${f2((x1 + x2) / 2)} ${f2((y1 + y2) / 2)}`;
    p += ` Q${f2(x2)} ${f2(y2)} ${f2((x2 + x3) / 2)} ${f2((y2 + y3) / 2)}`;
  }
  return `<g transform="translate(${x} ${y}) rotate(${rot})">
    <path d="${p}Z" fill="url(#sp${id})" stroke="${pal.stroke}" stroke-width=".7"/>
    ${d.tex === 'seeds' || d.tex === 'kiwi' ? `<circle cx="${f2(-s * .2)}" cy="${f2(s * .1)}" r=".7" fill="${d.tex === 'kiwi' ? '#2a2a1f' : '#f7e27a'}"/><circle cx="${f2(s * .3)}" cy="${f2(s * .25)}" r=".7" fill="${d.tex === 'kiwi' ? '#2a2a1f' : '#f7e27a'}"/>` : ''}
    ${d.tex === 'grain' || d.tex === 'fiber' ? `<path d="M${f2(-s * .5)} ${f2(s * .15)} Q0 ${f2(s * .35)} ${f2(s * .5)} ${f2(s * .1)}" stroke="${pal.dark}" stroke-width=".5" fill="none" opacity=".6"/>` : ''}
    <path d="M${f2(-s * .45)} ${f2(-s * .3)} Q${f2(-s * .1)} ${f2(-s * .62)} ${f2(s * .3)} ${f2(-s * .45)}" stroke="${pal.shine}" stroke-width="1.1" fill="none" stroke-linecap="round"/>
    <circle cx="${f2(s * .35)}" cy="${f2(-s * .15)}" r=".85" fill="#fff" opacity=".8"/></g>`;
}

const CHUNK_PTS = [[34, 33, -8, .3], [53, 29, 16, .7], [71, 37, -4, .1], [28, 51, 30, .5], [47, 48, -12, .9], [66, 53, 8, .4], [38, 66, 22, .2], [57, 67, -6, .6]];

// Props: an adult finger for scale, and a toddler fork.
const finger = () => `<g transform="translate(88 80) rotate(-58)">
  <path d="M-5 0h10v30h-10z" fill="#ecc795"/><path d="M-5 0a5 5 0 0 1 10 0" fill="#f2d3a6"/>
  <path d="M-5 0v30M5 0v30" stroke="#cf9f63" stroke-width=".8"/>
  <path d="M-3.2 1.5a3.2 3.4 0 0 1 6.4 0v4.5h-6.4z" fill="#fbe9d4" stroke="#d6aa72" stroke-width=".6"/>
  <path d="M-4 12h8M-4 13.6h8" stroke="#d1a36a" stroke-width=".5" opacity=".7"/></g>`;
const fork = (id) => `<g transform="translate(82 72) rotate(-35)">
  <rect x="-4.5" y="6" width="9" height="26" rx="4.5" fill="#7cc4dd" stroke="#4f9db8" stroke-width=".8"/>
  <rect x="-1.6" y="-6" width="3.2" height="13" fill="url(#st${id})" stroke="#8e9aa3" stroke-width=".5"/>
  <path d="M-5 -6h10l-1 -3h-8z" fill="url(#st${id})" stroke="#8e9aa3" stroke-width=".6"/>
  <path d="M-5 -9v-9M-1.7 -9v-10M1.7 -9v-10M5 -9v-9" stroke="#8e9aa3" stroke-width="1.8" stroke-linecap="round"/></g>`;
const spoonProp = (id, fill) => `<g transform="rotate(-28 50 56)">
  <rect x="58" y="52" width="34" height="7" rx="3.5" fill="url(#st${id})" stroke="#a3adb5" stroke-width=".6"/>
  <ellipse cx="44" cy="55.5" rx="17" ry="12" fill="url(#st${id})" stroke="#a3adb5" stroke-width=".8"/>
  <ellipse cx="44" cy="55" rx="13" ry="8.5" fill="#dfe5ea"/>${fill}</g>`;
const bowl = (id, pal, inner) => `<ellipse cx="52" cy="54" rx="27" ry="18" fill="#f4efe6" stroke="#d9cfbd" stroke-width="1"/>
  <ellipse cx="52" cy="52" rx="22" ry="13.5" fill="url(#sp${id})" stroke="${pal.stroke}" stroke-width=".6"/>${inner}
  <path d="M36 47c5-5 14-6 20-5" stroke="${pal.shine}" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".8"/>`;

const SHAPES = {
  spear: (d) => (STRIP.has(d.food.id)
    ? strip(d, 50, 38, 52, 6, -14) + strip(d, 51, 53, 54, 6.2, -3) + strip(d, 48, 68, 48, 5.8, 8)
    : halfOval(d, 49, 40, 54, 12, -14, 2) + halfOval(d, 50, 55, 56, 12.5, -3, 6) + halfOval(d, 47, 70, 50, 11, 8, 0))
    + (d.stage === 0 ? finger() : ''),
  bites: (d) => (d.stage === 2 ? CHUNK_PTS.slice(0, 6).map(([x, y, r, k]) => chunk(d, x - 4, y + 2, 7.4, r, k + .15)).join('') + fork(d.id)
    : CHUNK_PTS.map(([x, y, r, k]) => chunk(d, x, y, 8.4, r, k)).join('')),
  gnaw: (d) => (d.food.id === 'strawberry'
    ? `<g transform="translate(52 52) rotate(-20)"><path d="M0 -20c14 0 22 8 20 18-3 14-12 22-20 26C-8 20-17 12-20-2c-2-10 6-18 20-18z" fill="url(#sp${d.id})" stroke="${d.pal.stroke}" stroke-width=".9"/>
       ${Array.from({ length: 14 }, (_, i) => `<ellipse cx="${f2(-12 + (i % 5) * 6)}" cy="${f2(-10 + Math.floor(i / 5) * 9 + (i % 2) * 3)}" rx=".9" ry="1.4" fill="#f7e27a" stroke="${d.pal.darker}" stroke-width=".3"/>`).join('')}
       <path d="M-12 -18c4 2 8 2 12-2 4 4 8 4 12 2-2 5-7 6-12 4-5 2-10 1-12-4z" fill="#4f9a3c" stroke="#2f6b26" stroke-width=".7"/>
       <path d="M-12 -8c3-6 8-8 14-8" stroke="${d.pal.shine}" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>`
    : `<g transform="translate(52 52)"><path d="M-25 8c-4-15 9-30 27-30 15 0 23 10 22 22-1 14-13 22-27 22-11 0-19-5-22-14z" fill="url(#sp${d.id})" stroke="${d.pal.stroke}" stroke-width=".9"/>
       <path d="M-14 -4c6-7 16-10 25-6" stroke="${d.pal.shine}" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>`) + (d.stage === 0 ? finger() : ''),
  wedge: (d) => [[34, 40, -20], [56, 60, 15], [66, 36, 40]].map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})">
    <path d="M-15 0a15 15 0 0 0 30 0z" fill="${d.pal.lighter}" stroke="${d.pal.stroke}" stroke-width=".8"/>
    <path d="M-15 0a15 15 0 0 0 30 0" fill="none" stroke="${d.pal.base}" stroke-width="3.2"/>
    ${d.food.id === 'tomato' ? [-7, 0, 7].map((sx) => `<ellipse cx="${sx}" cy="5" rx="2.6" ry="3.6" fill="${d.pal.light}" stroke="${d.pal.dark}" stroke-width=".4"/><circle cx="${sx}" cy="5.5" r=".8" fill="#f6e7a0"/>`).join('')
      : [-8, 0, 8].map((sx) => `<path d="M0 1L${sx} 12" stroke="${d.pal.base}" stroke-width=".6" opacity=".6"/>`).join('')}
    <path d="M-10 2h20" stroke="${d.pal.shine}" stroke-width="1" opacity=".8"/></g>`).join(''),
  floret: (d) => [[38, 52, -20], [64, 47, 18]].map(([x, y, r]) => `<g transform="rotate(${r} ${x} ${y})">
    <path d="M${x - 4} ${y} q-1 10 1 20 h6 q2 -10 1 -20z" fill="${d.pal.lighter}" stroke="${d.pal.stroke}" stroke-width=".8"/>
    <path d="M${x - 1} ${y + 2} v15" stroke="${d.pal.light}" stroke-width="1" opacity=".8"/>
    ${[[-8, -2, 7], [8, -2, 7], [0, -11, 8], [-5, -16, 5.5], [6, -15, 6], [0, -3, 6]].map(([dx, dy, rr]) => `<circle cx="${x + dx}" cy="${y + dy}" r="${rr}" fill="url(#sp${d.id})" stroke="${d.pal.stroke}" stroke-width=".7"/>`).join('')}
    ${Array.from({ length: 10 }, (_, i) => `<circle cx="${f2(x - 9 + (i * 7 % 18))}" cy="${f2(y - 16 + (i * 11 % 16))}" r=".9" fill="${d.pal.darker}" opacity=".5"/>`).join('')}
    <path d="M${x - 10} ${y - 8} q4 -8 12 -9" stroke="${d.pal.shine}" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".8"/></g>`).join('') + (d.stage === 0 ? finger() : ''),
  flatten: (d) => [[36, 38], [64, 40], [38, 64], [65, 64]].map(([x, y], i) => `<g transform="translate(${x} ${y}) rotate(${i * 25})">
    <path d="M-12 0c0-6 6-9 12-9s12 3 12 9-5 8-12 8-12-2-12-8z" fill="url(#sp${d.id})" stroke="${d.pal.stroke}" stroke-width=".8"/>
    <path d="M-6 1c1-3 4-5 7-4 3-2 6 0 6 3 1 3-2 4-5 4-3 1-8 1-8-3z" fill="${d.pal.lighter}" opacity=".95"/>
    <path d="M-3 1.5c1-1 3-1.5 5-1" stroke="${d.pal.shine}" stroke-width="1" fill="none" stroke-linecap="round"/>
    <path d="M-9 -3c2-3 5-4 8-4" stroke="${d.pal.shine}" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".85"/>
    <path d="M-9 4l3 -1M5 4l4 1M0 6v1.5" stroke="${d.pal.darker}" stroke-width=".7" stroke-linecap="round" opacity=".7"/></g>`).join(''),
  quarter: (d) => [[36, 40], [66, 42], [51, 65]].map(([cx, cy]) => [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([sx, sy], i) => {
    const ox = cx + sx * 2, oy = cy + sy * 2, r = 9.5;
    return `<path d="M${ox} ${oy} L${ox + sx * r} ${oy} A${r} ${r} 0 0 ${i % 2 ? 0 : 1} ${ox} ${oy + sy * r} Z" fill="${d.pal.lighter}" stroke="${d.pal.stroke}" stroke-width=".7"/>
      <path d="M${ox + sx * r} ${oy} A${r} ${r} 0 0 ${i % 2 ? 0 : 1} ${ox} ${oy + sy * r}" fill="none" stroke="${d.pal.base}" stroke-width="2.6"/>
      <circle cx="${f2(ox + sx * 3.5)}" cy="${f2(oy + sy * 3.5)}" r="1" fill="${d.pal.light}"/>`;
  }).join('')).join(''),
  grated: (d) => `<path d="M30 60c2-14 12-24 22-24s20 10 22 24c-6 6-38 6-44 0z" fill="${d.pal.lighter}" opacity=".5"/>` + Array.from({ length: 34 }, (_, i) => {
    const a = (i * 137.5) * Math.PI / 180, dd = 3 + (i % 9) * 2.4, x = 52 + Math.cos(a) * dd * 1.2, y = 54 + Math.sin(a) * dd * 0.7;
    const c = [d.pal.light, d.pal.base, d.pal.dark][i % 3];
    return `<path d="M${f2(x)} ${f2(y)} q${f2(3 * Math.cos(a + 1))} ${f2(-2)} ${f2(6 * Math.cos(a + 1))} ${f2(6 * Math.sin(a + 1))}" stroke="${c}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  }).join(''),
  slice: (d) => [[-18, 40], [-6, 52], [6, 63]].map(([r, y]) => `<g transform="rotate(${r} 52 ${y})">
    <rect x="25" y="${y - 3.5}" width="54" height="7" rx="3.5" fill="${d.pal.light}" fill-opacity=".92" stroke="${d.pal.stroke}" stroke-width=".7"/>
    <path d="M29 ${y - 1.5}h40" stroke="${d.pal.shine}" stroke-width="1.1" stroke-linecap="round"/></g>`).join(''),
  shred: (d) => [32, 37, 42, 47, 52, 57, 62, 67].map((y, i) => `<path d="M${30 + (i % 3) * 3} ${y}c6-4 12 4 18 0s12 4 18 0" stroke="${[d.pal.dark, d.pal.base, d.pal.light][i % 3]}" stroke-width="3.6" fill="none" stroke-linecap="round"/>
    <path d="M${32 + (i % 3) * 3} ${y - .8}c5-3 10 2 14 0" stroke="${d.pal.shine}" stroke-width=".7" fill="none" stroke-linecap="round" opacity=".8"/>`).join(''),
  flake: (d) => [[38, 38], [59, 36], [30, 54], [49, 52], [67, 55], [41, 68], [60, 68]].map(([x, y], i) => `<g transform="translate(${x} ${y}) rotate(${i * 47 - 40})">
    <path d="M-10 1c2-7 10-9 17-6 3 2 3 6 1 8-5 3-13 4-18-2z" fill="url(#sp${d.id})" stroke="${d.pal.stroke}" stroke-width=".7"/>
    <path d="M-6 -1c3-2 7-2 10 0M-5 2c3-1 6-1 9 .5" stroke="${d.food.id === 'salmon' ? '#fde2d2' : d.pal.lighter}" stroke-width=".9" fill="none" stroke-linecap="round"/></g>`).join(''),
  ball: (d) => [[39, 42], [64, 42], [52, 64]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="11" fill="url(#sp${d.id})" stroke="${d.pal.stroke}" stroke-width=".8"/>
    ${[[-4, -1], [3, 3], [-1, 5], [5, -4], [-5, 4]].map(([dx, dy]) => `<circle cx="${x + dx}" cy="${y + dy}" r=".9" fill="${d.pal.darker}" opacity=".6"/>`).join('')}
    <circle cx="${x - 2}" cy="${y + 1}" r=".8" fill="#6aa84f"/>
    <path d="M${x - 6} ${y - 4}c2-3 5-4 8-4" stroke="${d.pal.shine}" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".9"/>`).join(''),
  spread: (d) => [[-10, 42], [8, 61]].map(([r, y]) => `<g transform="rotate(${r} 52 ${y})">
    <rect x="25" y="${y - 7}" width="54" height="14" rx="4" fill="#e2b77c" stroke="#a8692b" stroke-width="1.4"/>
    <rect x="27" y="${y - 6}" width="50" height="5" rx="2.5" fill="url(#bd${d.id})" stroke="${d.pal.stroke}" stroke-width=".5"/>
    <path d="M32 ${y - 4.2}c4-1.5 8 1.5 12 0s8 1.5 12 0" stroke="${d.pal.light}" stroke-width=".8" fill="none"/>
    ${[0, 1, 2, 3, 4].map((i) => `<circle cx="${33 + i * 9}" cy="${y + 3 + (i % 2)}" r=".6" fill="#b5803f"/>`).join('')}</g>`).join(''),
  ground: (d) => bowl(d.id, d.pal, Array.from({ length: 40 }, (_, i) => {
    const a = i * 2.4, dd = 1 + (i % 10) * 1.9;
    return `<circle cx="${f2(52 + Math.cos(a) * dd * 1.6)}" cy="${f2(52 + Math.sin(a) * dd * 0.9)}" r="${(0.7 + (i % 3) * 0.3).toFixed(1)}" fill="${[d.pal.dark, d.pal.base, d.pal.darker][i % 3]}"/>`;
  }).join('')),
  stir: (d) => `<ellipse cx="52" cy="54" rx="27" ry="18" fill="#f4efe6" stroke="#d9cfbd" stroke-width="1"/>
    <ellipse cx="52" cy="52" rx="22" ry="13.5" fill="#f6d9a8" stroke="#d8b67c" stroke-width=".6"/>
    <path d="M42 52c3-6 15-6 18 0s-6 8-10 5" stroke="#fff3d6" stroke-width="1.4" fill="none" stroke-linecap="round"/>` +
    Array.from({ length: 14 }, (_, i) => `<path d="M${f2(36 + (i * 29 % 32))} ${f2(45 + (i * 17 % 15))}l${(i % 2 ? 2.2 : 1.4)} ${(i % 3) - 1}" stroke="${[d.pal.base, d.pal.dark][i % 2]}" stroke-width="1.4" stroke-linecap="round"/>`).join(''),
  cob: (d) => [[37, 43], [64, 43], [51, 65]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="12" fill="${d.pal.dark}" stroke="${d.pal.stroke}" stroke-width=".8"/>
    ${Array.from({ length: 14 }, (_, i) => { const a = i / 14 * Math.PI * 2; return `<ellipse cx="${f2(x + Math.cos(a) * 8.5)}" cy="${f2(y + Math.sin(a) * 8.5)}" rx="2.4" ry="1.8" transform="rotate(${f2(a * 57)} ${f2(x + Math.cos(a) * 8.5)} ${f2(y + Math.sin(a) * 8.5)})" fill="url(#sp${d.id})"/>`; }).join('')}
    <circle cx="${x}" cy="${y}" r="5" fill="#f3e3a6" stroke="#d9c27a" stroke-width=".6"/><circle cx="${x}" cy="${y}" r="2" fill="#e8d18a"/>`).join('') + (d.stage === 0 ? finger() : ''),
  cup: (d) => `<path d="M36 30h32l-4 42H40z" fill="#eef6fa" stroke="#b9c9d3" stroke-width="1.3"/>
    <path d="M38.2 44h27.6l-2.9 26.5H41.1z" fill="url(#bd${d.id})"/>
    <ellipse cx="52" cy="44" rx="13.8" ry="2.2" fill="${d.pal.shine}"/>
    <path d="M40 34l2 34" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".9"/><path d="M36 30h32" stroke="#9fb3bf" stroke-width="1.3"/>`,
  puree: (d) => spoonProp(d.id, `<ellipse cx="44" cy="54.5" rx="11" ry="6.5" fill="url(#sp${d.id})"/><path d="M38 53c3-2 7-2 10 0" stroke="${d.pal.shine}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`),
  spoon: (d) => spoonProp(d.id, `<path d="M32 56c1-8 7-12 12-12s11 4 12 12c-4 5-20 5-24 0z" fill="url(#sp${d.id})" stroke="${mix(d.pal.base, '#000000', 0.25)}" stroke-width=".9"/><path d="M44 44c-1 2 0 4 2 4" stroke="${d.pal.stroke}" stroke-width=".8" fill="none" stroke-linecap="round"/><path d="M38 51c2-2 5-3 8-2" stroke="${d.pal.shine}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`),
  mash: (d) => `<path d="M26 54c-2-11 7-20 16-21 4-6 15-6 19-1 10 1 15 10 13 18 3 8-2 16-11 17-6 5-16 5-21 1-10 0-17-7-16-14z" fill="url(#sp${d.id})" stroke="${d.pal.stroke}" stroke-width=".8"/>
    ${[[40, 47, 3.6], [56, 43, 3], [60, 58, 3.4], [44, 60, 2.8], [50, 52, 2.4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${d.pal.light}" stroke="${d.pal.dark}" stroke-width=".4"/><circle cx="${x - 1}" cy="${y - 1}" r="${(r * .35).toFixed(1)}" fill="${d.pal.shine}"/>`).join('')}
    <path d="M32 46c4-6 10-9 16-9" stroke="${d.pal.shine}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`,
  notYet: () => `<rect x="40" y="47" width="24" height="19" rx="4" fill="#c9cfd4"/><path d="M45 47v-6a7 7 0 0 1 14 0v6" fill="none" stroke="#c9cfd4" stroke-width="4"/>`,
};

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function renderServingGuide(food, ageMonths, childName = 'him') {
  const plan = servingPlan(food);
  const now = stageIndexFor(ageMonths);
  const base = TINT[food.id] || COLORS[food.color] || '#9aa3aa';
  const pal = palette(base);
  const tex = TEX[food.id] || (food.cat === 'Proteins' ? 'grain' : 'none');
  const name = food.name.replace(/\s*\(.*\)$/, '');
  return `<section class="serve" style="--c:${base}">
    <div class="serve-head"><h3>How to serve ${esc(name.toLowerCase())}</h3>
      ${CHOKING.has(food.id) ? '<span class="pill choke">⚠ Choking risk: cut as shown</span>' : ''}</div>
    <ol class="serve-track">
      ${plan.map((p, i) => {
        const d = { id: `${uidN++}`, pal, tex, food, stage: i };
        const locked = p.style === 'notYet';
        return `<li class="serve-stop${i === now ? ' now' : ''}${locked ? ' locked' : ''}">
        <div class="serve-age"><span class="now-tag"${i === now ? '' : ' aria-hidden="true"'}>${esc(childName)} now</span><b>${p.stage.label}</b><small>${p.stage.sub}</small></div>
        ${plate(SHAPES[p.style](d), d, { locked })}
        <div class="serve-text"><b>${esc(p.name)}</b>${p.note ? `<span>${esc(p.note)}</span>` : ''}${p.hint && i === now ? `<em>${esc(p.hint)}</em>` : ''}</div>
      </li>`;
      }).join('')}
    </ol>
  </section>`;
}
