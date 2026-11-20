import {
  FOODS, ALLERGENS, FLAVORS, COLORS, CATEGORIES, PREP_OPTIONS, GUIDE,
  TARGET_TRIES, MIN_TRIES_TO_DISMISS,
} from './foods.js';

// ---------------------------------------------------------------- state
let state = null;
let tab = 'home';
let foodFilter = 'all';
let foodSearch = '';
let currentFoodId = null;
const PIN_KEY = 'ollie-pin';
const MAINTAIN_DAYS = 7;      // allergens not given within this many days get flagged
const ALLERGEN_GAP_DAYS = 3;  // wait this long between NEW allergens

const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  del(k) { try { localStorage.removeItem(k); } catch {} },
};

// ---------------------------------------------------------------- dates
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const parseDate = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const daysBetween = (a, b) => Math.round((parseDate(b) - parseDate(a)) / 86400000);
const addDays = (s, n) => { const d = parseDate(s); d.setDate(d.getDate() + n); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const fmtDate = (s) => parseDate(s).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: parseDate(s).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined });
const relDays = (n) => (n === 0 ? 'today' : n === 1 ? 'yesterday' : `${n} days ago`);

function ageOn(dob, on = todayStr()) {
  if (!dob) return null;
  const a = parseDate(dob), b = parseDate(on);
  let months = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
  if (b.getDate() < a.getDate()) months--;
  const anchor = new Date(a.getFullYear(), a.getMonth() + months, a.getDate());
  const days = Math.round((b - anchor) / 86400000);
  return { months, days };
}
function stageLabel(m) {
  if (m == null) return '';
  if (m < 8) return 'Getting started';
  if (m < 10) return 'Stage: 8–9 months';
  if (m < 12) return 'Stage: 10–11 months';
  if (m < 18) return 'Stage: 12–18 months';
  return 'Toddler (18 mo+)';
}

// ---------------------------------------------------------------- derived data
const allFoods = () => [...FOODS, ...(state?.customFoods || [])];
const foodById = (id) => allFoods().find((f) => f.id === id);
const logsFor = (id) => state.logs.filter((l) => l.foodId === id).sort((a, b) => a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt));
const ageMonths = () => ageOn(state.settings.dob)?.months ?? 99;
const ageOk = (f) => ageMonths() >= (f.min || 8);

function foodInfo(f) {
  const logs = logsFor(f.id);
  const tries = logs.length;
  const loved = logs.filter((l) => l.rating === 'loved').length;
  const ok = logs.filter((l) => l.rating === 'ok').length;
  const refused = logs.filter((l) => l.rating === 'refused').length;
  const reactions = logs.filter((l) => l.reaction !== 'none');
  const last = logs[logs.length - 1];
  const flag = state.flags[f.id];
  let status;
  if (flag === 'avoid') status = 'avoid';
  else if (flag === 'watch') status = 'watch';
  else if (flag === 'disliked') status = 'disliked';
  else if (tries === 0) status = 'new';
  else if (loved >= 1 || ok >= 2) status = 'likes';
  else status = 'learning';
  return {
    logs, tries, loved, ok, refused, reactions, last, flag, status,
    first: logs[0],
    daysSinceLast: last ? daysBetween(last.date, todayStr()) : null,
  };
}

const STATUS_LABEL = { new: 'Not tried', learning: 'Keep trying', likes: 'Likes it', disliked: 'Disliked', watch: 'Watch', avoid: 'Avoid' };

function allergenItems() {
  return allFoods().filter((f) => f.allergen);
}
function allergenSummary() {
  const items = allergenItems().map((f) => ({ f, i: foodInfo(f) }));
  const groups = Object.entries(ALLERGENS).map(([key, meta]) => {
    const members = items.filter((x) => x.f.allergen === key);
    const introduced = members.filter((x) => x.i.tries > 0);
    const lastDates = introduced.map((x) => x.i.last.date).sort();
    const lastDate = lastDates[lastDates.length - 1] || null;
    const reaction = members.some((x) => x.i.status === 'avoid' || x.i.status === 'watch');
    return { key, ...meta, members, introduced: introduced.length > 0, lastDate,
      daysSince: lastDate ? daysBetween(lastDate, todayStr()) : null, reaction };
  });
  // Each primary allergen item (the "Allergens" category) is its own introduction step.
  const steps = items.filter((x) => x.f.cat === 'Allergens');
  const firstIntros = steps.filter((x) => x.i.first).map((x) => x.i.first.date).sort();
  const lastNewIntro = firstIntros[firstIntros.length - 1] || null;
  return { groups, steps, lastNewIntro };
}

function nextAllergen() {
  const { steps, lastNewIntro } = allergenSummary();
  const next = steps.find((x) => x.i.tries === 0 && ageOk(x.f) && !x.i.flag);
  if (!next) return null;
  const waitUntil = lastNewIntro ? addDays(lastNewIntro, ALLERGEN_GAP_DAYS) : null;
  const ready = !waitUntil || waitUntil <= todayStr();
  return { food: next.f, ready, waitUntil };
}

function weekLogs() {
  const from = addDays(todayStr(), -6);
  return state.logs.filter((l) => l.date >= from);
}

// ---------------------------------------------------------------- API
async function api(method, body) {
  const headers = { 'content-type': 'application/json' };
  const pin = store.get(PIN_KEY);
  if (pin) headers['x-family-pin'] = pin;
  const res = await fetch('/api/data', { method, headers, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) { store.del(PIN_KEY); updateLock(); throw Object.assign(new Error('Wrong PIN'), { code: 401 }); }
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

async function load() {
  try {
    state = await api('GET');
  } catch (e) {
    $('#view').innerHTML = `<div class="card empty">Couldn't load data. ${esc(e.message)}<br><br><button class="btn secondary" onclick="location.reload()">Retry</button></div>`;
    return;
  }
  render();
}

// Ensure we have a PIN before writing. Resolves true if unlocked.
function requirePin() {
  if (store.get(PIN_KEY)) return Promise.resolve(true);
  return new Promise((resolve) => {
    openSheet(`
      <h2>Unlock editing</h2>
      <p class="muted">Enter the family PIN to log foods. It's remembered on this device.</p>
      <form class="form" id="pin-form">
        <div class="field"><label for="pin">Family PIN</label>
          <input id="pin" type="password" inputmode="numeric" autocomplete="current-password" pattern="[0-9]*" required autofocus /></div>
        <p class="small" id="pin-err" style="color:var(--danger)" hidden>That PIN didn't work.</p>
        <button class="btn" type="submit">Unlock</button>
      </form>`, () => resolve(!!store.get(PIN_KEY)));
    $('#pin-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      store.set(PIN_KEY, $('#pin').value.trim());
      try {
        await api('POST', { op: 'verify' });
        updateLock();
        closeSheet();
        toast('Unlocked ✓');
      } catch {
        $('#pin-err').hidden = false;
      }
    });
  });
}

async function mutate(body, okMsg) {
  if (!(await requirePin())) return false;
  try {
    state = await api('POST', body);
    render();
    if (okMsg) toast(okMsg);
    return true;
  } catch (e) {
    if (e.code === 401) { toast('PIN needed', true); return mutate(body, okMsg); }
    toast(e.message, true);
    return false;
  }
}

// ---------------------------------------------------------------- UI helpers
let toastTimer;
function toast(msg, isError = false) {
  const t = $('#toast');
  t.textContent = msg;
  t.className = 'toast' + (isError ? ' error' : '');
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.hidden = true), 2600);
}

let onSheetClose = null;
function openSheet(html, onClose) {
  if (onSheetClose) { const f = onSheetClose; onSheetClose = null; f(); }
  $('#sheet-body').innerHTML = html;
  $('#sheet').hidden = false;
  $('#sheet-backdrop').hidden = false;
  document.body.style.overflow = 'hidden';
  onSheetClose = onClose || null;
  const af = $('#sheet [autofocus]');
  if (af) setTimeout(() => af.focus(), 50);
}
function closeSheet() {
  $('#sheet').hidden = true;
  $('#sheet-backdrop').hidden = true;
  document.body.style.overflow = '';
  if (onSheetClose) { const f = onSheetClose; onSheetClose = null; f(); }
}

function updateLock() {
  const b = $('#lock-btn');
  const unlocked = !!store.get(PIN_KEY);
  b.textContent = unlocked ? '🔓' : '🔒';
  b.classList.toggle('unlocked', unlocked);
  b.title = unlocked ? 'Editing unlocked (tap to lock)' : 'Unlock editing';
}

function progressBar(tries, warn = false) {
  const pct = Math.min(100, Math.round((tries / TARGET_TRIES) * 100));
  return `<div class="bar${warn ? ' warn' : ''}" role="progressbar" aria-valuenow="${tries}" aria-valuemax="${TARGET_TRIES}"><i style="width:${pct}%"></i></div>`;
}

function foodRow(f, extraMeta = '', { hideAllergen = false } = {}) {
  const i = foodInfo(f);
  const locked = !ageOk(f);
  const al = f.allergen && !hideAllergen ? `<span class="pill allergen">${ALLERGENS[f.allergen]?.icon || ''} ${esc(ALLERGENS[f.allergen]?.label || f.allergen)}</span>` : '';
  const age = locked ? `<span class="pill age">${f.min} mo+</span>` : '';
  const triesTxt = i.tries === 0 ? 'Not offered yet'
    : `${i.tries}/${TARGET_TRIES} tries · last ${relDays(i.daysSinceLast)}${i.loved ? ` · ❤️ ${i.loved}` : ''}${i.refused ? ` · ✋ ${i.refused}` : ''}`;
  return `
    <div class="row">
      <span class="dot" style="background:${COLORS[f.color] || 'var(--border)'}" aria-hidden="true"></span>
      <button class="row-main" data-open="${esc(f.id)}">
        <span class="row-title">${esc(f.name)} <span class="pill ${i.status}">${STATUS_LABEL[i.status]}</span> ${al} ${age}</span>
        <span class="row-meta">${extraMeta || triesTxt}</span>
        ${i.tries > 0 && i.status !== 'likes' ? progressBar(i.tries, i.status === 'learning' && i.tries >= MIN_TRIES_TO_DISMISS) : ''}
      </button>
      <button class="quick" data-log="${esc(f.id)}" aria-label="Log a tasting of ${esc(f.name)}" ${i.status === 'avoid' ? 'disabled' : ''}>+</button>
    </div>`;
}

// ---------------------------------------------------------------- views
function renderHome() {
  const foods = allFoods();
  const infos = foods.map((f) => ({ f, i: foodInfo(f) }));
  const tried = infos.filter((x) => x.i.tries > 0).length;
  const likes = infos.filter((x) => x.i.status === 'likes').length;
  const { groups } = allergenSummary();
  const groupsIntro = groups.filter((g) => g.introduced).length;
  const week = weekLogs();
  const weekFoods = new Set(week.map((l) => l.foodId));

  // Palate coverage this week
  const flavorHits = new Set(), colorHits = new Set();
  weekFoods.forEach((id) => { const f = foodById(id); if (!f) return; (f.flavors || []).forEach((x) => flavorHits.add(x)); if (f.color) colorHits.add(f.color); });

  // Alerts
  const overdue = groups.filter((g) => g.introduced && !g.reaction && g.daysSince > MAINTAIN_DAYS);
  const reactions = infos.filter((x) => x.i.status === 'avoid' || x.i.status === 'watch');
  const next = nextAllergen();

  // Keep offering: learning foods, least recently offered first
  const keep = infos.filter((x) => x.i.status === 'learning')
    .sort((a, b) => (b.i.daysSinceLast ?? 0) - (a.i.daysSinceLast ?? 0)).slice(0, 6);

  // Try something new: untried, age-OK, non-allergen-step foods that fill this week's palate gaps
  const missingFlavors = Object.keys(FLAVORS).filter((k) => !flavorHits.has(k));
  const newIdeas = infos.filter((x) => x.i.tries === 0 && ageOk(x.f) && x.f.cat !== 'Allergens')
    .map((x) => ({ ...x, score: (x.f.flavors || []).filter((fl) => missingFlavors.includes(fl)).length + (colorHits.has(x.f.color) ? 0 : 0.5) }))
    .sort((a, b) => b.score - a.score).slice(0, 5);

  return `
    <section class="stats">
      <div class="stat"><div class="num">${tried}<small>/${foods.length}</small></div><div class="lbl">foods tried</div></div>
      <div class="stat"><div class="num">${groupsIntro}<small>/9</small></div><div class="lbl">allergen groups introduced</div></div>
      <div class="stat"><div class="num">${likes}</div><div class="lbl">foods he likes</div></div>
      <div class="stat"><div class="num">${week.length}</div><div class="lbl">tastings this week</div></div>
    </section>

    ${reactions.length ? `<div class="callout danger">⚠️ <b>Reaction flagged:</b> ${reactions.map((x) => `<a href="#" data-open="${esc(x.f.id)}">${esc(x.f.name)}</a> (${STATUS_LABEL[x.i.status]})`).join(', ')}. Check with your pediatrician before offering again.</div>` : ''}

    <section class="card">
      <div class="card-head"><h2>Allergens</h2><button class="chip" data-tab-go="allergens">See all</button></div>
      <div style="display:grid;gap:8px">
        ${next ? (next.ready
          ? `<div class="callout info">👉 <b>Next new allergen:</b> ${esc(next.food.name)}. ${esc(next.food.tip)}<div style="margin-top:8px"><button class="chip on" data-log="${esc(next.food.id)}">Log first taste</button></div></div>`
          : `<div class="callout info">⏳ Last new allergen was introduced recently. Wait until <b>${fmtDate(next.waitUntil)}</b> before starting <b>${esc(next.food.name)}</b>. Keep giving the ones he's already had.</div>`)
          : `<div class="callout ok">🎉 Every allergen on the list has been introduced. Keep them in rotation.</div>`}
        ${overdue.length
          ? `<div class="callout warn">🔁 <b>Keep in rotation:</b> not given in ${MAINTAIN_DAYS}+ days: ${overdue.map((g) => `${g.icon} ${esc(g.label)} (${g.daysSince}d)`).join(', ')}</div>`
          : groupsIntro ? `<div class="callout ok">✓ All introduced allergens were given in the last ${MAINTAIN_DAYS} days.</div>` : ''}
      </div>
    </section>

    <section class="card">
      <div class="card-head"><h2>Palate this week</h2><span class="muted small">${weekFoods.size} different foods</span></div>
      <div class="field"><span class="label small muted">Flavors</span>
        <div class="chips">${Object.entries(FLAVORS).map(([k, v]) => `<span class="chip ${flavorHits.has(k) ? 'hit' : 'miss'}">${flavorHits.has(k) ? '✓ ' : ''}${v}</span>`).join('')}</div>
      </div>
      <div class="field" style="margin-top:12px"><span class="label small muted">Eat the rainbow</span>
        <div class="rainbow">${Object.entries(COLORS).map(([k, c]) => `<span class="swatch ${colorHits.has(k) ? '' : 'miss'}" style="background:${c}" title="${k}">${colorHits.has(k) ? '✓' : ''}</span>`).join('')}</div>
      </div>
    </section>

    <section class="card">
      <div class="card-head"><h2>Keep offering</h2><span class="muted small">aim for ${TARGET_TRIES} tries</span></div>
      ${keep.length ? `<div class="list">${keep.map((x) => foodRow(x.f)).join('')}</div>` : `<p class="empty">Foods he hasn't warmed up to yet will show up here.</p>`}
    </section>

    <section class="card">
      <div class="card-head"><h2>Try something new</h2><span class="muted small">fills this week's gaps</span></div>
      <div class="list">${newIdeas.map((x) => foodRow(x.f, esc(x.f.tip))).join('') || '<p class="empty">He has tried everything on the list! Add custom foods in Settings.</p>'}</div>
    </section>`;
}

function renderFoods() {
  const filters = [['all', 'All'], ['new', 'Not tried'], ['learning', 'Keep trying'], ['likes', 'Likes'], ['disliked', 'Disliked'], ['flagged', 'Watch / Avoid']];
  const q = foodSearch.trim().toLowerCase();
  const items = allFoods().map((f) => ({ f, i: foodInfo(f) })).filter(({ f, i }) => {
    if (q && !f.name.toLowerCase().includes(q) && !f.cat.toLowerCase().includes(q)) return false;
    if (foodFilter === 'all') return true;
    if (foodFilter === 'flagged') return i.status === 'watch' || i.status === 'avoid';
    return i.status === foodFilter;
  });
  const cats = [...CATEGORIES, ...new Set(allFoods().map((f) => f.cat).filter((c) => !CATEGORIES.includes(c)))];
  const body = cats.map((c) => {
    const rows = items.filter((x) => x.f.cat === c);
    if (!rows.length) return '';
    const done = rows.filter((x) => x.i.tries > 0).length;
    return `<section class="card"><div class="card-head"><h2>${esc(c)}</h2><span class="muted small">${done}/${rows.length} tried</span></div>
      <div class="list">${rows.map((x) => foodRow(x.f)).join('')}</div></section>`;
  }).join('');
  return `
    <input class="search" id="food-search" type="search" placeholder="Search foods…" value="${esc(foodSearch)}" aria-label="Search foods" />
    <div class="chips">${filters.map(([k, v]) => `<button class="chip ${foodFilter === k ? 'on' : ''}" data-filter="${k}">${v}</button>`).join('')}</div>
    ${body || '<div class="card empty">No foods match.</div>'}`;
}

function renderAllergens() {
  const { groups } = allergenSummary();
  const next = nextAllergen();
  return `
    <div class="callout info">Introduce one new allergen every ${ALLERGEN_GAP_DAYS}+ days, then keep each one in his diet a few times a week. Groups not given in ${MAINTAIN_DAYS}+ days are flagged.
      ${next ? (next.ready ? `<br><b>Next up:</b> ${esc(next.food.name)}` : `<br><b>Next up:</b> ${esc(next.food.name)} on or after ${fmtDate(next.waitUntil)}`) : ''}</div>
    ${groups.map((g) => {
      let pill;
      if (g.reaction) pill = '<span class="pill avoid">Reaction</span>';
      else if (!g.introduced) pill = '<span class="pill new">Not introduced</span>';
      else if (g.daysSince > MAINTAIN_DAYS) pill = `<span class="pill overdue">Due · ${g.daysSince}d ago</span>`;
      else pill = `<span class="pill likes">✓ ${relDays(g.daysSince)}</span>`;
      return `<section class="card allergen-group">
        <div class="allergen-head"><h3><span aria-hidden="true">${g.icon}</span> ${esc(g.label)}</h3>${pill}</div>
        <div class="list">${g.members.map((x) => foodRow(x.f, x.i.first
          ? `First: ${fmtDate(x.i.first.date)} · ${x.i.tries} total · last ${relDays(x.i.daysSinceLast)}`
          : '', { hideAllergen: true })).join('')}</div>
      </section>`;
    }).join('')}`;
}

function logLine(l, showFood = true) {
  const f = foodById(l.foodId);
  const r = { loved: '❤️ Loved', ok: '🙂 OK', refused: '✋ Refused' }[l.rating];
  const x = l.reaction === 'severe' ? ' · <b style="color:var(--danger)">Severe reaction</b>' : l.reaction === 'mild' ? ' · <b style="color:var(--warn)">Mild reaction</b>' : '';
  const bits = [l.prep, l.fedBy && `by ${l.fedBy}`].filter(Boolean).map(esc).join(' · ');
  return `<div class="row">
    <div class="row-main" style="cursor:default">
      <span class="row-title">${showFood ? `<a href="#" data-open="${esc(l.foodId)}">${esc(f?.name || l.foodId)}</a> · ` : ''}${r}${x}</span>
      <span class="row-meta">${fmtDate(l.date)}${bits ? ' · ' + bits : ''}</span>
      ${l.reactionNotes ? `<span class="row-meta">Reaction: ${esc(l.reactionNotes)}</span>` : ''}
      ${l.notes ? `<span class="row-meta">“${esc(l.notes)}”</span>` : ''}
    </div>
    <button class="link-btn" data-del-log="${esc(l.id)}" aria-label="Delete entry">Delete</button>
  </div>`;
}

function renderHistory() {
  const logs = [...state.logs].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  if (!logs.length) return '<div class="card empty">No tastings logged yet. Tap <b>+</b> next to any food to log one.</div>';
  const byDate = {};
  logs.forEach((l) => (byDate[l.date] ||= []).push(l));
  return Object.entries(byDate).map(([d, ls]) => `
    <section class="card"><div class="card-head"><h2>${fmtDate(d)}</h2><span class="muted small">${ls.length} tasting${ls.length > 1 ? 's' : ''}</span></div>
    <div class="list">${ls.map((l) => logLine(l)).join('')}</div></section>`).join('');
}

function renderGuide() {
  return GUIDE.map((g) => `<section class="card"><h2>${esc(g.title)}</h2><ul class="guide-list" style="margin-top:10px">${g.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></section>`).join('');
}

function render() {
  if (!state) return;
  const a = ageOn(state.settings.dob);
  const name = state.settings.childName || 'Oliver';
  $('#title').textContent = `${name}'s Food Tracker`;
  $('#age-line').textContent = a ? `${a.months} mo ${a.days} d · ${stageLabel(a.months)}` : 'Set his birthday in Settings';
  document.querySelectorAll('.tabs button').forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
  const view = { home: renderHome, foods: renderFoods, allergens: renderAllergens, history: renderHistory, guide: renderGuide }[tab];
  $('#view').innerHTML = view();
  if (tab === 'foods') {
    const s = $('#food-search');
    s.addEventListener('input', () => { foodSearch = s.value; const pos = s.selectionStart; render(); const n = $('#food-search'); n.focus(); n.setSelectionRange(pos, pos); });
  }
}

// ---------------------------------------------------------------- sheets
function openFood(id, focusLog = false) {
  const f = foodById(id);
  if (!f) return;
  currentFoodId = id;
  const i = foodInfo(f);
  const caregivers = state.settings.caregivers || [];
  const canDismiss = i.tries >= MIN_TRIES_TO_DISMISS;
  openSheet(`
    <h2>${esc(f.name)}</h2>
    <p class="muted small" style="margin:4px 0 0">${esc(f.cat)}${f.allergen ? ` · ${ALLERGENS[f.allergen].icon} ${esc(ALLERGENS[f.allergen].label)} allergen` : ''} · ${(f.flavors || []).map((x) => FLAVORS[x]).join(', ')}</p>
    ${!ageOk(f) ? `<div class="callout warn" style="margin-top:10px">Recommended from <b>${f.min} months</b>.</div>` : ''}
    ${f.tip ? `<div class="callout info" style="margin-top:10px">${esc(f.tip)}</div>` : ''}
    <div style="margin-top:12px;display:grid;gap:6px">
      <div class="row-title"><span class="pill ${i.status}">${STATUS_LABEL[i.status]}</span> <span class="small muted">${i.tries}/${TARGET_TRIES} tries · ❤️ ${i.loved} · 🙂 ${i.ok} · ✋ ${i.refused}</span></div>
      ${progressBar(i.tries)}
      ${i.status === 'learning' && i.tries < MIN_TRIES_TO_DISMISS ? `<span class="small muted">${MIN_TRIES_TO_DISMISS - i.tries} more tries before you can call it a dislike. Try a different prep!</span>` : ''}
    </div>

    <form class="form" id="log-form">
      <h3 id="log-title">Log a tasting</h3>
      <div class="field"><label for="log-date">Date</label><input id="log-date" type="date" value="${todayStr()}" max="${todayStr()}" required /></div>
      <div class="field"><span class="label">How did he like it?</span>
        <div class="seg" data-seg="rating">
          <button type="button" data-v="loved" class="r-loved">❤️ Loved</button>
          <button type="button" data-v="ok" class="on">🙂 OK</button>
          <button type="button" data-v="refused" class="r-refused">✋ Refused</button>
        </div></div>
      <div class="field"><span class="label">Any reaction?</span>
        <div class="seg" data-seg="reaction">
          <button type="button" data-v="none" class="on">None</button>
          <button type="button" data-v="mild" class="x-mild">Mild</button>
          <button type="button" data-v="severe" class="x-severe">Severe</button>
        </div></div>
      <div class="field" id="reaction-notes-wrap" hidden><label for="reaction-notes">What happened?</label>
        <input id="reaction-notes" placeholder="e.g. hives around mouth after ~20 min" /></div>
      <div class="field"><span class="label">Preparation</span>
        <div class="chips" data-chips="prep">${PREP_OPTIONS.map((p) => `<button type="button" class="chip" data-v="${esc(p)}">${esc(p)}</button>`).join('')}</div></div>
      <div class="field"><span class="label">Who fed him?</span>
        <div class="chips" data-chips="fedBy">${caregivers.map((c) => `<button type="button" class="chip" data-v="${esc(c)}">${esc(c)}</button>`).join('')}</div></div>
      <div class="field"><label for="log-notes">Notes</label><textarea id="log-notes" placeholder="e.g. mixed with banana, ate half"></textarea></div>
      <button class="btn" type="submit">Save tasting</button>
    </form>

    <div class="form">
      <h3>Status</h3>
      <div class="btn-row">
        ${i.flag ? `<button class="btn secondary" data-flag="">Clear "${STATUS_LABEL[i.flag]}"</button>` : ''}
        ${i.flag !== 'watch' ? `<button class="btn secondary" data-flag="watch">Mark "Watch"</button>` : ''}
        ${i.flag !== 'avoid' ? `<button class="btn danger" data-flag="avoid">Mark "Avoid"</button>` : ''}
        ${i.flag !== 'disliked' ? `<button class="btn secondary" data-flag="disliked" ${canDismiss ? '' : 'disabled'} title="${canDismiss ? '' : `Available after ${MIN_TRIES_TO_DISMISS} tries`}">Disliked${canDismiss ? '' : ` (after ${MIN_TRIES_TO_DISMISS} tries)`}</button>` : ''}
      </div>
      ${f.custom ? `<button class="link-btn" data-remove-food="${esc(f.id)}">Remove this custom food</button>` : ''}
    </div>

    <div class="form">
      <h3>History (${i.tries})</h3>
      <div class="list">${i.logs.length ? [...i.logs].reverse().map((l) => logLine(l, false)).join('') : '<p class="muted small">No tastings yet.</p>'}</div>
    </div>`);

  const sheet = $('#sheet');
  const vals = { rating: 'ok', reaction: 'none', prep: '', fedBy: '' };
  sheet.querySelectorAll('[data-seg]').forEach((seg) => seg.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    seg.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
    vals[seg.dataset.seg] = b.dataset.v;
    if (seg.dataset.seg === 'reaction') $('#reaction-notes-wrap').hidden = b.dataset.v === 'none';
  }));
  sheet.querySelectorAll('[data-chips]').forEach((g) => g.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const on = !b.classList.contains('on');
    g.querySelectorAll('button').forEach((x) => x.classList.toggle('on', on && x === b));
    vals[g.dataset.chips] = on ? b.dataset.v : '';
  }));
  $('#log-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('[type=submit]');
    btn.disabled = true;
    const log = { foodId: f.id, date: $('#log-date').value, ...vals,
      reactionNotes: $('#reaction-notes').value, notes: $('#log-notes').value };
    const ok = await mutate({ op: 'addLog', log });
    btn.disabled = false;
    if (ok) {
      const n = foodInfo(f).tries;
      if (vals.reaction === 'severe') toast('Saved. Marked "Avoid". Call your pediatrician.', true);
      else if (vals.reaction === 'mild') toast('Saved. Marked "Watch".');
      else toast(`Saved ✓ Try #${n}${n < TARGET_TRIES && vals.rating === 'refused' ? '. Keep going!' : ''}`);
      openFood(f.id);
    }
  });
  if (focusLog) setTimeout(() => $('#log-title')?.scrollIntoView({ block: 'start', behavior: 'smooth' }), 60);
}

function openSettings() {
  const s = state.settings;
  openSheet(`
    <h2>Settings</h2>
    <form class="form" id="settings-form">
      <div class="field"><label for="s-name">Child's name</label><input id="s-name" value="${esc(s.childName)}" /></div>
      <div class="field"><label for="s-dob">Birthday</label><input id="s-dob" type="date" value="${esc(s.dob)}" /></div>
      <div class="field"><label for="s-care">Caregivers (comma separated)</label><input id="s-care" value="${esc((s.caregivers || []).join(', '))}" /></div>
      <button class="btn" type="submit">Save settings</button>
    </form>

    <form class="form" id="food-form">
      <h3>Add a custom food</h3>
      <div class="field"><label for="cf-name">Name</label><input id="cf-name" required placeholder="e.g. Grandma's congee" /></div>
      <div class="field"><label for="cf-cat">Category</label><select id="cf-cat">${CATEGORIES.map((c) => `<option ${c === 'Other' ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
      <div class="field"><label for="cf-all">Contains allergen?</label><select id="cf-all"><option value="">None</option>${Object.entries(ALLERGENS).map(([k, v]) => `<option value="${k}">${v.label}</option>`).join('')}</select></div>
      <div class="field"><span class="label">Flavors</span><div class="chips" id="cf-flavors">${Object.entries(FLAVORS).map(([k, v]) => `<button type="button" class="chip" data-v="${k}">${v}</button>`).join('')}</div></div>
      <div class="field"><label for="cf-color">Color</label><select id="cf-color"><option value="">—</option>${Object.keys(COLORS).map((c) => `<option>${c}</option>`).join('')}</select></div>
      <div class="field"><label for="cf-tip">Serving tip (optional)</label><input id="cf-tip" /></div>
      <button class="btn secondary" type="submit">Add food</button>
    </form>

    <div class="form">
      <h3>This device</h3>
      <div class="btn-row">
        <button class="btn secondary" id="export-btn">Export data (JSON)</button>
        ${store.get(PIN_KEY) ? '<button class="btn secondary" id="lock-now">Lock editing</button>' : ''}
      </div>
    </div>`);

  $('#settings-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const ok = await mutate({ op: 'saveSettings', settings: {
      childName: $('#s-name').value, dob: $('#s-dob').value,
      caregivers: $('#s-care').value.split(',').map((x) => x.trim()).filter(Boolean) } }, 'Settings saved ✓');
    if (ok) closeSheet();
  });
  $('#cf-flavors').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) b.classList.toggle('on'); });
  $('#food-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const food = { name: $('#cf-name').value, cat: $('#cf-cat').value, allergen: $('#cf-all').value || null,
      color: $('#cf-color').value || null, tip: $('#cf-tip').value,
      flavors: [...$('#cf-flavors').querySelectorAll('.on')].map((b) => b.dataset.v) };
    const ok = await mutate({ op: 'addFood', food }, `Added ${food.name} ✓`);
    if (ok) closeSheet();
  });
  $('#export-btn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `ollie-foods-${todayStr()}.json` });
    a.click(); URL.revokeObjectURL(a.href);
  });
  $('#lock-now')?.addEventListener('click', () => { store.del(PIN_KEY); updateLock(); closeSheet(); toast('Locked'); });
}

// ---------------------------------------------------------------- events
document.addEventListener('click', async (e) => {
  const t = e.target.closest('[data-tab],[data-tab-go],[data-open],[data-log],[data-filter],[data-del-log],[data-flag],[data-remove-food]');
  if (!t) return;
  if (t.dataset.tab || t.dataset.tabGo) {
    tab = t.dataset.tab || t.dataset.tabGo; render(); window.scrollTo({ top: 0 }); return;
  }
  if (t.dataset.open) { e.preventDefault(); openFood(t.dataset.open); return; }
  if (t.dataset.log) { openFood(t.dataset.log, true); return; }
  if (t.dataset.filter) { foodFilter = t.dataset.filter; render(); return; }
  if (t.dataset.delLog) {
    if (!confirm('Delete this tasting?')) return;
    const log = state.logs.find((l) => l.id === t.dataset.delLog);
    const sheetOpen = !$('#sheet').hidden;
    if (await mutate({ op: 'deleteLog', id: t.dataset.delLog }, 'Deleted') && sheetOpen && log) openFood(log.foodId);
    return;
  }
  if ('flag' in t.dataset) {
    const id = currentFoodId;
    if (!id) return;
    if (await mutate({ op: 'setFlag', foodId: id, flag: t.dataset.flag || null }, 'Updated ✓')) openFood(id);
    return;
  }
  if (t.dataset.removeFood) {
    if (!confirm('Remove this custom food? Its tastings stay in History.')) return;
    if (await mutate({ op: 'removeFood', id: t.dataset.removeFood }, 'Removed')) closeSheet();
  }
});

$('#sheet-close').addEventListener('click', closeSheet);
$('#sheet-backdrop').addEventListener('click', closeSheet);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('#sheet').hidden) closeSheet(); });
$('#settings-btn').addEventListener('click', () => state && openSettings());
$('#lock-btn').addEventListener('click', () => {
  if (store.get(PIN_KEY)) { store.del(PIN_KEY); updateLock(); toast('Locked'); }
  else requirePin();
});

// Refresh when coming back to the app so both parents see the latest entries.
document.addEventListener('visibilitychange', async () => {
  if (document.visibilityState === 'visible' && $('#sheet').hidden) {
    try { state = await api('GET'); render(); } catch {}
  }
});

updateLock();
load();
