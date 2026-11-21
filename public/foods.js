// Oliver's food checklist, 8–18 months.
// min = earliest age in months to offer (8 = start now).
// allergen = one of the top-9 allergen groups (FDA/AAP), if any.
// flavors = taste profile, used to track palate variety.
// color = tint for the food's icon tile.
// tip = how to serve it safely at this age.

export const TARGET_TRIES = 15;  // offer up to 15 times before deciding he dislikes it
export const MIN_TRIES_TO_DISMISS = 10;

export const ALLERGENS = {
  peanut:    { label: 'Peanut',    icon: '🥜' },
  egg:       { label: 'Egg',       icon: '🥚' },
  milk:      { label: 'Dairy (cow’s milk)', icon: '🥛' },
  wheat:     { label: 'Wheat',     icon: '🌾' },
  soy:       { label: 'Soy',       icon: '🫘' },
  treenut:   { label: 'Tree nuts', icon: '🌰' },
  fish:      { label: 'Fish',      icon: '🐟' },
  shellfish: { label: 'Shellfish', icon: '🦐' },
  sesame:    { label: 'Sesame',    icon: '⚪' },
};

export const FLAVORS = {
  sweet:   'Sweet',
  sour:    'Sour / tangy',
  bitter:  'Bitter',
  savory:  'Savory / umami',
  earthy:  'Earthy',
  spiced:  'Spiced / aromatic',
  mild:    'Mild / neutral',
};

export const COLORS = {
  red: '#e0524d', orange: '#f08c2e', yellow: '#e8c22c', green: '#4f9d4a',
  purple: '#7b4fa8', white: '#cbbfa8', brown: '#8a5a3b',
};

export const CATEGORIES = [
  'Allergens', 'Fruits', 'Vegetables', 'Proteins', 'Legumes', 'Grains', 'Dairy', 'Herbs & Spices', 'Other',
];

export const FOODS = [
  // ---------------- Top-9 allergens (introduce one at a time, then keep them in his diet) ----------------
  { id: 'peanut', name: 'Peanut', cat: 'Allergens', allergen: 'peanut', flavors: ['savory'], color: 'brown',
    tip: 'Smooth peanut butter thinned with water, breast milk or formula, or stirred into purée/oatmeal. Never whole peanuts or thick globs.' },
  { id: 'egg', name: 'Egg (well cooked)', cat: 'Allergens', allergen: 'egg', flavors: ['savory', 'mild'], color: 'yellow',
    tip: 'Fully cooked: scrambled, omelet strips, or hard-boiled and mashed. No runny yolks.' },
  { id: 'yogurt', name: 'Yogurt (plain, whole milk)', cat: 'Allergens', allergen: 'milk', flavors: ['sour', 'mild'], color: 'white',
    tip: 'Plain, unsweetened, full-fat. Great carrier for other flavors and allergens.' },
  { id: 'wheat-cereal', name: 'Wheat (cereal / toast)', cat: 'Allergens', allergen: 'wheat', flavors: ['mild'], color: 'brown',
    tip: 'Infant wheat cereal, or toast strips lightly toasted. Soft pasta works too.' },
  { id: 'tofu', name: 'Tofu', cat: 'Allergens', allergen: 'soy', flavors: ['mild'], color: 'white',
    tip: 'Firm tofu cut into finger-length strips, or mashed. Soy yogurt is another option.' },
  { id: 'sesame', name: 'Sesame (tahini)', cat: 'Allergens', allergen: 'sesame', flavors: ['savory', 'bitter'], color: 'brown',
    tip: 'Tahini thinned and swirled into yogurt or purée, or spread thinly on toast.' },
  { id: 'almond', name: 'Almond', cat: 'Allergens', allergen: 'treenut', flavors: ['mild', 'sweet'], color: 'brown',
    tip: 'Smooth almond butter thinned, or finely ground almond stirred into oatmeal. No whole nuts until 4+ years.' },
  { id: 'cashew', name: 'Cashew', cat: 'Allergens', allergen: 'treenut', flavors: ['mild', 'sweet'], color: 'white',
    tip: 'Smooth cashew butter thinned or mixed into purée.' },
  { id: 'walnut', name: 'Walnut', cat: 'Allergens', allergen: 'treenut', flavors: ['bitter', 'earthy'], color: 'brown',
    tip: 'Finely ground into a powder and mixed into oatmeal or yogurt.' },
  { id: 'hazelnut', name: 'Hazelnut', cat: 'Allergens', allergen: 'treenut', flavors: ['earthy', 'sweet'], color: 'brown',
    tip: 'Ground hazelnut or plain hazelnut butter (not chocolate spread, which is high in sugar).' },
  { id: 'pistachio', name: 'Pistachio', cat: 'Allergens', allergen: 'treenut', flavors: ['savory'], color: 'green',
    tip: 'Unsalted, finely ground. Cross-reacts with cashew, so a good one to test separately.' },
  { id: 'pecan', name: 'Pecan', cat: 'Allergens', allergen: 'treenut', flavors: ['sweet', 'earthy'], color: 'brown',
    tip: 'Finely ground and stirred into oatmeal or mashed banana.' },
  { id: 'salmon', name: 'Salmon', cat: 'Allergens', allergen: 'fish', flavors: ['savory'], color: 'orange',
    tip: 'Baked and flaked, with every bone checked. Low mercury, high in omega-3s.' },
  { id: 'cod', name: 'Cod / white fish', cat: 'Allergens', allergen: 'fish', flavors: ['mild', 'savory'], color: 'white',
    tip: 'Flaked, boneless. Haddock, pollock and tilapia are also low-mercury.' },
  { id: 'tuna', name: 'Tuna (canned light)', cat: 'Allergens', allergen: 'fish', flavors: ['savory'], color: 'brown',
    tip: 'Canned LIGHT (skipjack) only, not albacore or bigeye. Mash with yogurt or avocado.' },
  { id: 'sardines', name: 'Sardines', cat: 'Allergens', allergen: 'fish', flavors: ['savory'], color: 'brown',
    tip: 'Canned in water, boneless or with bones mashed very fine. Rich in calcium and omega-3s.' },
  { id: 'shrimp', name: 'Shrimp', cat: 'Allergens', allergen: 'shellfish', flavors: ['savory', 'sweet'], color: 'orange',
    tip: 'Fully cooked and finely chopped or ground. Whole shrimp is a choking risk.' },
  { id: 'crab', name: 'Crab / lobster', cat: 'Allergens', allergen: 'shellfish', flavors: ['savory', 'sweet'], color: 'white',
    tip: 'Cooked, finely shredded, no shell pieces. Avoid imitation crab (it’s processed and salty).' },

  // ---------------- Fruits ----------------
  { id: 'banana', name: 'Banana', cat: 'Fruits', flavors: ['sweet'], color: 'yellow', tip: 'Mashed, or a half banana with some peel left on as a handle.' },
  { id: 'avocado', name: 'Avocado', cat: 'Fruits', flavors: ['mild'], color: 'green', tip: 'Mashed or ripe spears. Roll in hemp seeds for grip.' },
  { id: 'apple', name: 'Apple', cat: 'Fruits', flavors: ['sweet', 'sour'], color: 'red', tip: 'Cooked soft or grated raw. Never raw chunks (choking risk).' },
  { id: 'pear', name: 'Pear', cat: 'Fruits', flavors: ['sweet'], color: 'green', tip: 'Very ripe soft slices, or steamed if firm.' },
  { id: 'peach', name: 'Peach / nectarine', cat: 'Fruits', flavors: ['sweet'], color: 'orange', tip: 'Ripe, peeled slices or mashed. Remove the pit.' },
  { id: 'mango', name: 'Mango', cat: 'Fruits', flavors: ['sweet'], color: 'orange', tip: 'Ripe spears, or the pit with some flesh left on to gnaw.' },
  { id: 'blueberry', name: 'Blueberries', cat: 'Fruits', flavors: ['sweet', 'sour'], color: 'purple', tip: 'Smashed flat or cut into quarters. Never whole until ~2+.' },
  { id: 'strawberry', name: 'Strawberries', cat: 'Fruits', flavors: ['sweet', 'sour'], color: 'red', tip: 'Large whole berry to gnaw, or thin slices / mashed.' },
  { id: 'raspberry', name: 'Raspberries', cat: 'Fruits', flavors: ['sour', 'sweet'], color: 'red', tip: 'Soft enough to serve whole if squished slightly.' },
  { id: 'blackberry', name: 'Blackberries', cat: 'Fruits', flavors: ['sour', 'sweet'], color: 'purple', tip: 'Halved or quartered and flattened.' },
  { id: 'watermelon', name: 'Watermelon', cat: 'Fruits', flavors: ['sweet'], color: 'red', tip: 'Seedless finger-sized sticks.' },
  { id: 'cantaloupe', name: 'Cantaloupe / honeydew', cat: 'Fruits', flavors: ['sweet'], color: 'orange', tip: 'Very ripe thin strips, rind removed.' },
  { id: 'kiwi', name: 'Kiwi', cat: 'Fruits', flavors: ['sour', 'sweet'], color: 'green', tip: 'Peeled spears or mashed. Tangy, which is great for the palate.' },
  { id: 'orange', name: 'Orange / clementine', cat: 'Fruits', flavors: ['sour', 'sweet'], color: 'orange', tip: 'Segments with the membrane removed, cut small.' },
  { id: 'grapes', name: 'Grapes', cat: 'Fruits', flavors: ['sweet', 'sour'], color: 'purple', tip: 'ALWAYS quartered lengthwise. Whole grapes are a top choking hazard.' },
  { id: 'plum', name: 'Plum', cat: 'Fruits', flavors: ['sour', 'sweet'], color: 'purple', tip: 'Ripe, peeled, pitted wedges.' },
  { id: 'apricot', name: 'Apricot', cat: 'Fruits', flavors: ['sweet', 'sour'], color: 'orange', tip: 'Ripe fresh wedges, or unsulfured dried apricot puréed.' },
  { id: 'cherry', name: 'Cherries', cat: 'Fruits', flavors: ['sweet', 'sour'], color: 'red', tip: 'Pitted and quartered.' },
  { id: 'pineapple', name: 'Pineapple', cat: 'Fruits', flavors: ['sour', 'sweet'], color: 'yellow', tip: 'Ripe core-removed spears to gnaw, or finely chopped. Acidic, so watch for diaper rash.' },
  { id: 'papaya', name: 'Papaya', cat: 'Fruits', flavors: ['sweet'], color: 'orange', tip: 'Ripe soft spears, seeds removed.' },
  { id: 'fig', name: 'Figs', cat: 'Fruits', flavors: ['sweet', 'earthy'], color: 'purple', tip: 'Fresh ripe figs quartered.' },
  { id: 'prune', name: 'Prunes', cat: 'Fruits', flavors: ['sweet'], color: 'brown', tip: 'Puréed, which helps with constipation. Don’t serve whole dried fruit pieces.' },
  { id: 'coconut', name: 'Coconut', cat: 'Fruits', flavors: ['sweet', 'mild'], color: 'white', tip: 'Unsweetened shredded coconut sprinkled on food, or coconut yogurt.' },
  { id: 'pomegranate', name: 'Pomegranate', cat: 'Fruits', flavors: ['sour', 'sweet'], color: 'red', min: 12, tip: '12 mo+: a few arils crushed into yogurt. Seeds can be tricky earlier.' },
  { id: 'lemon', name: 'Lemon / lime (taste)', cat: 'Fruits', flavors: ['sour'], color: 'yellow', tip: 'A squeeze over veg or fish, or a lick of a wedge. Builds tolerance for sour flavors.' },

  // ---------------- Vegetables ----------------
  { id: 'sweet-potato', name: 'Sweet potato', cat: 'Vegetables', flavors: ['sweet', 'earthy'], color: 'orange', tip: 'Roasted soft wedges or mashed.' },
  { id: 'carrot', name: 'Carrot', cat: 'Vegetables', flavors: ['sweet', 'earthy'], color: 'orange', tip: 'Steamed until squishable. Never raw coins or sticks.' },
  { id: 'butternut', name: 'Butternut squash', cat: 'Vegetables', flavors: ['sweet'], color: 'orange', tip: 'Roasted soft spears or mashed.' },
  { id: 'pumpkin', name: 'Pumpkin', cat: 'Vegetables', flavors: ['sweet', 'earthy'], color: 'orange', tip: 'Plain canned purée (not pie filling) or roasted.' },
  { id: 'zucchini', name: 'Zucchini', cat: 'Vegetables', flavors: ['mild'], color: 'green', tip: 'Steamed or roasted spears, skin on for grip.' },
  { id: 'green-beans', name: 'Green beans', cat: 'Vegetables', flavors: ['mild', 'bitter'], color: 'green', tip: 'Whole, steamed very soft (good for the pincer grasp).' },
  { id: 'peas', name: 'Peas', cat: 'Vegetables', flavors: ['sweet'], color: 'green', tip: 'Smashed flat. Whole peas only once he chews well.' },
  { id: 'broccoli', name: 'Broccoli', cat: 'Vegetables', flavors: ['bitter'], color: 'green', tip: 'Steamed florets with a long stem "handle". Bitter, so it often needs many tries.' },
  { id: 'cauliflower', name: 'Cauliflower', cat: 'Vegetables', flavors: ['mild', 'bitter'], color: 'white', tip: 'Steamed florets or mashed.' },
  { id: 'spinach', name: 'Spinach', cat: 'Vegetables', flavors: ['bitter', 'earthy'], color: 'green', tip: 'Cooked and finely chopped into eggs, pasta or purée.' },
  { id: 'kale', name: 'Kale', cat: 'Vegetables', flavors: ['bitter'], color: 'green', tip: 'Cooked and blended into sauces or purées. Raw leaves are hard to manage.' },
  { id: 'beet', name: 'Beets', cat: 'Vegetables', flavors: ['earthy', 'sweet'], color: 'purple', tip: 'Roasted soft wedges or mixed into yogurt. Stains everything, and turns diapers red!' },
  { id: 'asparagus', name: 'Asparagus', cat: 'Vegetables', flavors: ['bitter', 'earthy'], color: 'green', tip: 'Steamed soft spears, woody ends removed.' },
  { id: 'bell-pepper', name: 'Bell pepper', cat: 'Vegetables', flavors: ['sweet', 'bitter'], color: 'red', tip: 'Roasted and peeled strips, or raw in large wide strips to gnaw (12 mo+).' },
  { id: 'tomato', name: 'Tomato', cat: 'Vegetables', flavors: ['sour', 'savory'], color: 'red', tip: 'Ripe wedges, or cherry tomatoes quartered. Acidic.' },
  { id: 'cucumber', name: 'Cucumber', cat: 'Vegetables', flavors: ['mild'], color: 'green', tip: 'Peeled long spears. Good for teething when chilled.' },
  { id: 'corn', name: 'Corn', cat: 'Vegetables', flavors: ['sweet'], color: 'yellow', tip: 'Corn on the cob (cut into rounds) to gnaw, or creamed corn. Loose kernels after 12 mo+.' },
  { id: 'potato', name: 'Potato', cat: 'Vegetables', flavors: ['mild'], color: 'white', tip: 'Mashed or roasted soft wedges. No added salt.' },
  { id: 'parsnip', name: 'Parsnip', cat: 'Vegetables', flavors: ['sweet', 'earthy', 'spiced'], color: 'white', tip: 'Roasted soft spears.' },
  { id: 'eggplant', name: 'Eggplant', cat: 'Vegetables', flavors: ['bitter', 'savory'], color: 'purple', tip: 'Roasted until very soft, or baba ganoush (which also gives sesame).' },
  { id: 'mushroom', name: 'Mushrooms', cat: 'Vegetables', flavors: ['savory', 'earthy'], color: 'brown', tip: 'Cooked and finely chopped. Umami flavor.' },
  { id: 'brussels', name: 'Brussels sprouts', cat: 'Vegetables', flavors: ['bitter'], color: 'green', tip: 'Roasted and quartered or mashed. Very bitter, so plan on lots of tries.' },
  { id: 'cabbage', name: 'Cabbage', cat: 'Vegetables', flavors: ['bitter', 'mild'], color: 'purple', tip: 'Cooked soft and chopped. Try red and green.' },
  { id: 'onion', name: 'Onion / leek (cooked)', cat: 'Vegetables', flavors: ['savory', 'sweet'], color: 'white', tip: 'Sautéed soft into meals. Builds a savory base.' },
  { id: 'okra', name: 'Okra', cat: 'Vegetables', flavors: ['mild', 'earthy'], color: 'green', tip: 'Roasted whole pods or sliced in stews.' },
  { id: 'artichoke', name: 'Artichoke', cat: 'Vegetables', flavors: ['bitter', 'earthy'], color: 'green', min: 10, tip: 'Cooked hearts, chopped soft.' },
  { id: 'celery', name: 'Celery (cooked)', cat: 'Vegetables', flavors: ['bitter', 'mild'], color: 'green', tip: 'Cooked into soups and blended. Raw celery is stringy and a choking risk.' },

  // ---------------- Proteins (meat & poultry) ----------------
  { id: 'chicken', name: 'Chicken', cat: 'Proteins', flavors: ['savory'], color: 'white', tip: 'Shredded thigh meat (moister), or a drumstick with skin, cartilage and small bones removed.' },
  { id: 'turkey', name: 'Turkey', cat: 'Proteins', flavors: ['savory'], color: 'white', tip: 'Ground turkey meatballs or shredded dark meat.' },
  { id: 'beef', name: 'Beef', cat: 'Proteins', flavors: ['savory'], color: 'brown', tip: 'Iron-rich! Soft meatballs, slow-cooked strips, or ground beef.' },
  { id: 'pork', name: 'Pork', cat: 'Proteins', flavors: ['savory', 'sweet'], color: 'white', tip: 'Slow-cooked pulled pork (no BBQ sauce). Skip bacon/ham (too salty).' },
  { id: 'lamb', name: 'Lamb', cat: 'Proteins', flavors: ['savory', 'earthy'], color: 'brown', tip: 'Ground lamb kofta or slow-cooked shredded meat. Pairs well with cumin and mint.' },
  { id: 'liver', name: 'Liver (small amounts)', cat: 'Proteins', flavors: ['bitter', 'savory'], color: 'brown', tip: 'Chicken liver pâté on toast. Very iron-rich, but only about once a week (high in vitamin A).' },

  // ---------------- Legumes ----------------
  { id: 'lentils', name: 'Lentils', cat: 'Legumes', flavors: ['earthy', 'savory'], color: 'orange', tip: 'Red lentils cook down into a soft dal. Iron-rich.' },
  { id: 'black-beans', name: 'Black beans', cat: 'Legumes', flavors: ['earthy'], color: 'purple', tip: 'Smashed flat, low-sodium canned (rinsed).' },
  { id: 'chickpeas', name: 'Chickpeas / hummus', cat: 'Legumes', flavors: ['savory', 'earthy'], color: 'yellow', tip: 'Hummus (with tahini, so it counts toward sesame too) or smashed chickpeas.' },
  { id: 'kidney-beans', name: 'Kidney / pinto beans', cat: 'Legumes', flavors: ['earthy'], color: 'red', tip: 'Smashed. Use canned or fully cooked. Raw kidney beans are toxic.' },
  { id: 'white-beans', name: 'White beans', cat: 'Legumes', flavors: ['mild'], color: 'white', tip: 'Cannellini mashed into a dip or smashed.' },
  { id: 'edamame', name: 'Edamame', cat: 'Legumes', allergen: 'soy', flavors: ['savory', 'sweet'], color: 'green', tip: 'Shelled, cooked and smashed flat. Counts as soy.' },

  // ---------------- Grains ----------------
  { id: 'oats', name: 'Oats / oatmeal', cat: 'Grains', flavors: ['mild'], color: 'brown', tip: 'Oatmeal or baked oat fingers. A great base for mixing in allergens.' },
  { id: 'rice', name: 'Rice', cat: 'Grains', flavors: ['mild'], color: 'white', tip: 'Sticky rice balls. Vary grains, because rice can contain arsenic.' },
  { id: 'quinoa', name: 'Quinoa', cat: 'Grains', flavors: ['earthy', 'mild'], color: 'white', tip: 'Cooked soft and mixed into patties or yogurt.' },
  { id: 'barley', name: 'Barley', cat: 'Grains', flavors: ['earthy'], color: 'brown', tip: 'Cooked very soft into soups or porridge.' },
  { id: 'millet', name: 'Millet', cat: 'Grains', flavors: ['mild', 'sweet'], color: 'yellow', tip: 'Porridge or mixed into mash.' },
  { id: 'pasta', name: 'Pasta (wheat)', cat: 'Grains', allergen: 'wheat', flavors: ['mild'], color: 'yellow', tip: 'Large shapes like fusilli or penne, cooked soft.' },
  { id: 'bread', name: 'Bread / toast', cat: 'Grains', allergen: 'wheat', flavors: ['mild'], color: 'brown', tip: 'Lightly toasted strips (soft bread turns gummy). Low-sodium.' },
  { id: 'couscous', name: 'Couscous', cat: 'Grains', allergen: 'wheat', flavors: ['mild'], color: 'yellow', tip: 'Mixed into mash or yogurt to practice texture.' },
  { id: 'polenta', name: 'Polenta / cornmeal', cat: 'Grains', flavors: ['sweet', 'mild'], color: 'yellow', tip: 'Soft polenta, or set and cut into fingers.' },
  { id: 'buckwheat', name: 'Buckwheat', cat: 'Grains', flavors: ['earthy', 'bitter'], color: 'brown', tip: 'Buckwheat pancakes or porridge.' },

  // ---------------- Dairy ----------------
  { id: 'cheddar', name: 'Cheddar', cat: 'Dairy', allergen: 'milk', flavors: ['savory', 'sour'], color: 'yellow', tip: 'Pasteurized, grated or thin slices. Cubes are a choking risk.' },
  { id: 'mozzarella', name: 'Mozzarella', cat: 'Dairy', allergen: 'milk', flavors: ['mild'], color: 'white', tip: 'Fresh, low-sodium, torn into thin pieces or melted.' },
  { id: 'ricotta', name: 'Ricotta / cottage cheese', cat: 'Dairy', allergen: 'milk', flavors: ['mild'], color: 'white', tip: 'Spread on toast or mixed into pasta.' },
  { id: 'cream-cheese', name: 'Cream cheese', cat: 'Dairy', allergen: 'milk', flavors: ['mild', 'sour'], color: 'white', tip: 'A thin smear on toast strips.' },
  { id: 'butter', name: 'Butter', cat: 'Dairy', allergen: 'milk', flavors: ['savory'], color: 'yellow', tip: 'Unsalted, melted onto veg for healthy fats.' },
  { id: 'kefir', name: 'Kefir (plain)', cat: 'Dairy', allergen: 'milk', flavors: ['sour'], color: 'white', tip: 'Plain kefir from an open cup or mixed into oatmeal. Tangy flavor.' },
  { id: 'cow-milk', name: 'Whole cow’s milk (drink)', cat: 'Dairy', allergen: 'milk', flavors: ['mild'], color: 'white', min: 12, tip: '12 mo+ only as a drink (cooking with it is fine earlier). Aim for about 16–24 oz a day max.' },

  // ---------------- Herbs & spices (palate builders) ----------------
  { id: 'cinnamon', name: 'Cinnamon', cat: 'Herbs & Spices', flavors: ['spiced', 'sweet'], color: 'brown', tip: 'A pinch in oatmeal, apple or sweet potato.' },
  { id: 'cumin', name: 'Cumin', cat: 'Herbs & Spices', flavors: ['spiced', 'earthy'], color: 'brown', tip: 'In lentils, beans or meatballs.' },
  { id: 'garlic', name: 'Garlic', cat: 'Herbs & Spices', flavors: ['savory', 'spiced'], color: 'white', tip: 'Cooked into dishes. Raw garlic is harsh.' },
  { id: 'ginger', name: 'Ginger', cat: 'Herbs & Spices', flavors: ['spiced'], color: 'yellow', tip: 'Freshly grated into purées or stir-fries.' },
  { id: 'turmeric', name: 'Turmeric', cat: 'Herbs & Spices', flavors: ['earthy', 'bitter'], color: 'orange', tip: 'A pinch in eggs, rice or dal.' },
  { id: 'paprika', name: 'Paprika (sweet)', cat: 'Herbs & Spices', flavors: ['spiced', 'sweet'], color: 'red', tip: 'Sweet or smoked, not hot.' },
  { id: 'curry', name: 'Mild curry powder', cat: 'Herbs & Spices', flavors: ['spiced'], color: 'yellow', tip: 'Mild curry with coconut milk and veg.' },
  { id: 'basil', name: 'Basil', cat: 'Herbs & Spices', flavors: ['spiced', 'sweet'], color: 'green', tip: 'Finely chopped into pasta or pesto (pesto often contains pine nuts and parmesan).' },
  { id: 'mint', name: 'Mint', cat: 'Herbs & Spices', flavors: ['spiced'], color: 'green', tip: 'Chopped into yogurt, peas or lamb.' },
  { id: 'dill', name: 'Dill', cat: 'Herbs & Spices', flavors: ['spiced', 'sour'], color: 'green', tip: 'With fish, yogurt or cucumber.' },
  { id: 'cilantro', name: 'Cilantro / parsley', cat: 'Herbs & Spices', flavors: ['spiced', 'bitter'], color: 'green', tip: 'Finely chopped into beans, rice or eggs.' },
  { id: 'oregano', name: 'Oregano / thyme', cat: 'Herbs & Spices', flavors: ['spiced', 'earthy'], color: 'green', tip: 'In tomato sauce or roasted veg.' },
  { id: 'nutmeg', name: 'Nutmeg / cardamom', cat: 'Herbs & Spices', flavors: ['spiced', 'sweet'], color: 'brown', tip: 'A tiny pinch in squash, pear or oatmeal.' },
  { id: 'vanilla', name: 'Vanilla', cat: 'Herbs & Spices', flavors: ['sweet', 'spiced'], color: 'brown', tip: 'Scrape a vanilla bean or use alcohol-free extract in yogurt or oats.' },

  // ---------------- Other ----------------
  { id: 'olive-oil', name: 'Olive oil', cat: 'Other', flavors: ['savory', 'bitter'], color: 'green', tip: 'Drizzle on veg for healthy fat and calories.' },
  { id: 'chia', name: 'Chia / hemp / flax seeds', cat: 'Other', flavors: ['mild', 'earthy'], color: 'brown', tip: 'Ground flax or hemp hearts sprinkled on food. Soak chia first.' },
  { id: 'honey', name: 'Honey', cat: 'Other', flavors: ['sweet'], color: 'yellow', min: 12, tip: '12 mo+ ONLY (risk of infant botulism before 1 year). Use sparingly.' },
];

export const PREP_OPTIONS = ['Purée', 'Mashed', 'Finger food', 'Mixed into dish', 'Spread / thinned', 'Shredded', 'Other'];

export const GUIDE = [
  {
    title: 'Introducing allergens',
    items: [
      'Introduce ONE new allergen at a time, early in the day and at home, so you can watch him for about 2 hours afterward.',
      'Start with a small amount (about ¼ tsp) and build up to a full serving over a few days.',
      'Wait about 2–3 days before introducing the next new allergen, so any reaction is easy to trace.',
      'Once an allergen is tolerated, KEEP IT IN HIS DIET a few times a week. Regular exposure helps maintain tolerance. The tracker flags allergens not given in 7+ days.',
      'Tree nuts and fish/shellfish are separate allergens. Introduce each type, not just one from each group.',
    ],
  },
  {
    title: 'Signs of an allergic reaction',
    items: [
      'Mild: a few hives or redness around the mouth, mild rash. Log it as "mild" and call your pediatrician before offering it again.',
      'Severe: CALL 911 for swelling of the lips, face or tongue, trouble breathing, wheezing, repeated vomiting, pale or floppy, or sudden sleepiness.',
      'Reactions usually happen within minutes to 2 hours.',
    ],
  },
  {
    title: 'Building his palate (10–15 tries)',
    items: [
      'Babies often need 10–15 exposures to accept a new flavor. A refusal is data, not a verdict.',
      'Every offer counts as a try, even if he only touches it, licks it or spits it out.',
      'Change the preparation (purée, then finger food, then mixed into a favorite) to keep exposures interesting.',
      'Offer the new or disliked food next to a "safe" food he already loves.',
      'Prioritize bitter, sour and spiced flavors. These need the most repetition and widen his palate the most.',
      'Only mark a food as "disliked" after 10+ tries, and plan to re-offer it in a month or two.',
    ],
  },
  {
    title: 'Safety basics',
    items: [
      'No honey before 12 months. No cow’s milk as a drink before 12 months (yogurt, cheese and cooking are fine).',
      'Choking hazards: whole nuts, whole grapes, cherry tomatoes or blueberries, popcorn, hot dog coins, raw hard veg or apple chunks, globs of nut butter, hard candy, marshmallows.',
      'Avoid high-mercury fish: shark, swordfish, king mackerel, tilefish, marlin, orange roughy, bigeye tuna.',
      'No added salt or sugar, and no juice. Water in an open or straw cup with meals.',
      'Vary grains and don’t rely on rice products (arsenic).',
      'Always sit upright and supervised while eating.',
      'This tracker is a planning tool, not medical advice. Check with your pediatrician, especially if he has eczema or a known allergy.',
    ],
  },
];
