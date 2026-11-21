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
// Every drawing sits on a top-down plate (viewBox 100×100). .f = food fill/stroke from --c.
const plate = (inner) => `<svg viewBox="0 0 100 100" class="plate-svg" aria-hidden="true">
  <circle cx="50" cy="50" r="47" class="plate"/><circle cx="50" cy="50" r="38" class="plate-rim"/>${inner}</svg>`;
const quarterWedges = (cx, cy, r) => [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([sx, sy], i) => {
  const ox = cx + sx * 1.6, oy = cy + sy * 1.6;
  return `<path class="f" d="M${ox} ${oy} L${ox + sx * r} ${oy} A${r} ${r} 0 0 ${i % 2 ? 0 : 1} ${ox} ${oy + sy * r} Z"/>`;
}).join('');

const SHAPES = {
  puree: () => `<path class="f" d="M30 52c0-12 10-20 21-20s20 7 20 18-9 19-21 19-20-6-20-17z"/>
    <path class="line" d="M50 40c6 0 10 4 10 9s-4 8-9 8-7-3-7-6 3-5 6-5"/>`,
  mash: () => `<path class="f" d="M28 54c-2-10 6-19 15-20 4-6 14-6 18-1 9 1 14 9 12 17 3 7-2 15-10 16-5 5-15 5-20 1-9 0-16-6-15-13z"/>
    <circle class="f2" cx="42" cy="48" r="3.2"/><circle class="f2" cx="56" cy="44" r="2.6"/><circle class="f2" cx="58" cy="58" r="3"/><circle class="f2" cx="45" cy="60" r="2.4"/>`,
  spoon: () => `<rect class="handle" x="52" y="47" width="34" height="6" rx="3" transform="rotate(-28 52 50)"/>
    <ellipse class="spoon" cx="40" cy="57" rx="16" ry="11" transform="rotate(-28 40 57)"/>
    <ellipse class="f" cx="40" cy="56" rx="11" ry="7" transform="rotate(-28 40 56)"/>`,
  spear: () => [[-14, 36], [-4, 50], [8, 64]].map(([rot, y]) =>
    `<rect class="f" x="22" y="${y - 5}" width="56" height="10" rx="5" transform="rotate(${rot} 50 ${y})"/>`).join(''),
  gnaw: () => `<path class="f" d="M27 60c-4-15 9-30 27-30 15 0 23 10 22 22-1 14-13 22-27 22-11 0-19-5-22-14z"/>
    <path class="line" d="M38 52c6-6 16-8 24-5"/>`,
  wedge: () => [[30, 40, -20], [52, 60, 15], [62, 34, 40]].map(([x, y, r]) =>
    `<path class="f" d="M${x - 14} ${y} a14 14 0 0 0 28 0z" transform="rotate(${r} ${x} ${y})"/>`).join(''),
  floret: () => [[36, 54, -20], [62, 48, 18]].map(([x, y, r]) => `<g transform="rotate(${r} ${x} ${y})">
    <rect class="stalk" x="${x - 4}" y="${y}" width="8" height="20" rx="4"/>
    <circle class="f" cx="${x - 7}" cy="${y - 2}" r="8"/><circle class="f" cx="${x + 7}" cy="${y - 2}" r="8"/><circle class="f" cx="${x}" cy="${y - 10}" r="9"/></g>`).join(''),
  bites: () => [[34, 34], [50, 30], [66, 36], [28, 50], [44, 48], [60, 50], [72, 54], [36, 64], [52, 66], [66, 68]].map(([x, y], i) =>
    `<rect class="f" x="${x - 5}" y="${y - 5}" width="10" height="10" rx="3" transform="rotate(${(i * 23) % 40 - 20} ${x} ${y})"/>`).join(''),
  flatten: () => [[36, 38], [62, 40], [38, 62], [63, 63]].map(([x, y]) =>
    `<ellipse class="f" cx="${x}" cy="${y}" rx="11" ry="8"/><path class="line" d="M${x - 5} ${y}h10"/>`).join(''),
  quarter: () => quarterWedges(36, 40, 8) + quarterWedges(64, 42, 8) + quarterWedges(50, 64, 8),
  grated: () => Array.from({ length: 22 }, (_, i) => {
    const a = (i * 137.5) * Math.PI / 180, d = 4 + (i % 7) * 3.2, x = 50 + Math.cos(a) * d, y = 52 + Math.sin(a) * d * 0.8;
    return `<path class="shred" d="M${x.toFixed(1)} ${y.toFixed(1)} l${(5 * Math.cos(a + 1)).toFixed(1)} ${(5 * Math.sin(a + 1)).toFixed(1)}"/>`;
  }).join(''),
  slice: () => [[-18, 40], [-6, 50], [6, 60]].map(([r, y]) =>
    `<rect class="f" x="24" y="${y - 2.5}" width="52" height="5" rx="2.5" transform="rotate(${r} 50 ${y})"/>`).join(''),
  shred: () => [32, 38, 44, 50, 56, 62, 68].map((y, i) =>
    `<path class="shred thick" d="M${30 + (i % 2) * 4} ${y}c6-4 12 4 18 0s12 4 18 0"/>`).join(''),
  flake: () => [[38, 38], [59, 36], [30, 54], [49, 52], [67, 55], [41, 68], [60, 68]].map(([x, y], i) =>
    `<path class="f" d="M${x - 9} ${y + 1}c2-6 9-8 15-5 3 2 3 5 1 7-4 3-12 4-16-2z" transform="rotate(${i * 47 - 40} ${x} ${y})"/>
     <path class="line" d="M${x - 4} ${y}c2-1 5-1 7 0" transform="rotate(${i * 47 - 40} ${x} ${y})"/>`).join(''),
  ball: () => [[38, 42], [62, 42], [50, 63]].map(([x, y]) =>
    `<circle class="f" cx="${x}" cy="${y}" r="10"/><circle class="f2" cx="${x - 3}" cy="${y - 2}" r="1.6"/><circle class="f2" cx="${x + 3}" cy="${y + 3}" r="1.4"/>`).join(''),
  spread: () => [[-10, 42], [8, 60]].map(([r, y]) => `<g transform="rotate(${r} 50 ${y})">
    <rect class="bread" x="24" y="${y - 6}" width="52" height="13" rx="4"/><rect class="f" x="26" y="${y - 6}" width="48" height="4" rx="2"/></g>`).join(''),
  ground: () => `<path class="bowlfill" d="M27 56c0-9 10-15 23-15s23 6 23 15c0 9-10 15-23 15s-23-6-23-15z"/>` +
    Array.from({ length: 26 }, (_, i) => {
      const a = i * 2.4, d = 2 + (i % 9) * 2.1;
      return `<circle class="f" cx="${(50 + Math.cos(a) * d * 1.5).toFixed(1)}" cy="${(55 + Math.sin(a) * d * 0.8).toFixed(1)}" r="1.5"/>`;
    }).join(''),
  stir: () => `<path class="bowlfill" d="M27 54c0-9 10-15 23-15s23 6 23 15c0 9-10 15-23 15s-23-6-23-15z"/>
    <path class="line" d="M40 54c3-6 15-6 18 0s-6 8-10 5"/>` +
    [[38, 48], [55, 46], [62, 56], [44, 62], [52, 58], [34, 56]].map(([x, y]) => `<circle class="f" cx="${x}" cy="${y}" r="2.2"/>`).join(''),
  cob: () => [[36, 44], [62, 44], [49, 64]].map(([x, y]) => `<circle class="f" cx="${x}" cy="${y}" r="11"/>
    ${[0, 60, 120, 180, 240, 300].map((d) => `<circle class="f2" cx="${(x + Math.cos(d * Math.PI / 180) * 6.5).toFixed(1)}" cy="${(y + Math.sin(d * Math.PI / 180) * 6.5).toFixed(1)}" r="2"/>`).join('')}
    <circle class="core" cx="${x}" cy="${y}" r="3"/>`).join(''),
  cup: () => `<path class="cupbody" d="M36 32h28l-4 38H40z"/><path class="f" d="M38 44h24l-3 25H41z"/><path class="line" d="M36 32h28"/>`,
  notYet: () => `<rect class="lockbody" x="38" y="47" width="24" height="19" rx="4"/><path class="lockloop" d="M43 47v-6a7 7 0 0 1 14 0v6"/>`,
};

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function renderServingGuide(food, ageMonths, childName = 'him') {
  const plan = servingPlan(food);
  const now = stageIndexFor(ageMonths);
  const color = COLORS[food.color] || '#9aa3aa';
  const name = food.name.replace(/\s*\(.*\)$/, '');
  return `<section class="serve" style="--c:${color}">
    <div class="serve-head"><h3>How to serve ${esc(name.toLowerCase())}</h3>
      ${CHOKING.has(food.id) ? '<span class="pill choke">⚠ Choking risk: cut as shown</span>' : ''}</div>
    <ol class="serve-track">
      ${plan.map((p, i) => `<li class="serve-stop${i === now ? ' now' : ''}${p.style === 'notYet' ? ' locked' : ''}">
        <div class="serve-age"><span class="now-tag"${i === now ? '' : ' aria-hidden="true"'}>${esc(childName)} now</span><b>${p.stage.label}</b><small>${p.stage.sub}</small></div>
        ${plate(SHAPES[p.style]())}
        <div class="serve-text"><b>${esc(p.name)}</b>${p.note ? `<span>${esc(p.note)}</span>` : ''}${p.hint && i === now ? `<em>${esc(p.hint)}</em>` : ''}</div>
      </li>`).join('')}
    </ol>
  </section>`;
}
