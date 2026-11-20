// GET  /api/data            -> full tracker state (read-only, no PIN needed)
// POST /api/data {op, ...}  -> apply one change (requires header x-family-pin)

import { timingSafeEqual } from 'node:crypto';
import { readState, updateState, healthCheck } from '../lib/store.js';

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

function pinOk(given) {
  const expected = process.env.FAMILY_PIN || '';
  if (!expected || typeof given !== 'string') return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

const str = (v, max = 500) => (typeof v === 'string' ? v.slice(0, max) : '');
const id = (v) => str(v, 80).replace(/[^a-zA-Z0-9_-]/g, '');
const RATINGS = ['loved', 'ok', 'refused'];
const REACTIONS = ['none', 'mild', 'severe'];
const FLAGS = ['watch', 'avoid', 'disliked'];

function cleanLog(l = {}) {
  return {
    id: id(l.id) || crypto.randomUUID(),
    foodId: id(l.foodId),
    date: /^\d{4}-\d{2}-\d{2}$/.test(l.date) ? l.date : new Date().toISOString().slice(0, 10),
    rating: RATINGS.includes(l.rating) ? l.rating : 'ok',
    reaction: REACTIONS.includes(l.reaction) ? l.reaction : 'none',
    reactionNotes: str(l.reactionNotes),
    prep: str(l.prep, 60),
    fedBy: str(l.fedBy, 60),
    notes: str(l.notes, 1000),
    createdAt: new Date().toISOString(),
  };
}

const OPS = {
  verify: () => {},
  addLog: (s, b) => {
    const log = cleanLog(b.log);
    if (!log.foodId) throw new Error('foodId required');
    s.logs.push(log);
    // A severe reaction automatically flags the food as "avoid"; mild as "watch".
    if (log.reaction === 'severe') s.flags[log.foodId] = 'avoid';
    else if (log.reaction === 'mild' && s.flags[log.foodId] !== 'avoid') s.flags[log.foodId] = 'watch';
  },
  deleteLog: (s, b) => {
    s.logs = s.logs.filter((l) => l.id !== b.id);
  },
  setFlag: (s, b) => {
    const foodId = id(b.foodId);
    if (FLAGS.includes(b.flag)) s.flags[foodId] = b.flag;
    else delete s.flags[foodId];
  },
  addFood: (s, b) => {
    const f = b.food || {};
    const food = {
      id: 'custom-' + (id(f.id) || crypto.randomUUID().slice(0, 8)),
      name: str(f.name, 60),
      cat: str(f.cat, 30) || 'Other',
      allergen: str(f.allergen, 20) || null,
      flavors: Array.isArray(f.flavors) ? f.flavors.map((x) => str(x, 20)).slice(0, 5) : [],
      color: str(f.color, 20) || null,
      min: Number(f.min) || 8,
      tip: str(f.tip, 300),
      custom: true,
    };
    if (!food.name) throw new Error('name required');
    s.customFoods.push(food);
  },
  removeFood: (s, b) => {
    s.customFoods = s.customFoods.filter((f) => f.id !== b.id);
  },
  saveSettings: (s, b) => {
    const st = b.settings || {};
    s.settings = {
      childName: str(st.childName, 40) || 'Oliver',
      dob: /^\d{4}-\d{2}-\d{2}$/.test(st.dob) ? st.dob : s.settings.dob,
      caregivers: Array.isArray(st.caregivers)
        ? st.caregivers.map((c) => str(c, 40)).filter(Boolean).slice(0, 12)
        : s.settings.caregivers,
    };
  },
};

export default {
  async fetch(request) {
    try {
      if (request.method === 'GET') {
        if (new URL(request.url).searchParams.has('health')) return json(await healthCheck());
        const { state } = await readState();
        return json(state);
      }
      if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

      if (!pinOk(request.headers.get('x-family-pin'))) {
        await new Promise((r) => setTimeout(r, 800)); // slow down guessing
        return json({ error: 'Wrong PIN' }, 401);
      }
      const body = await request.json().catch(() => ({}));
      const op = OPS[body.op];
      if (!op) return json({ error: 'Unknown op' }, 400);
      if (body.op === 'verify') return json({ ok: true });

      const state = await updateState((s) => op(s, body));
      return json(state);
    } catch (err) {
      console.error(err);
      return json({ error: err.message || 'Server error' }, 500);
    }
  },
};
