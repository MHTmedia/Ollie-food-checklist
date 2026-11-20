// Storage for the tracker's single JSON document.
// Production: a private Vercel Blob store (strongly consistent reads via useCache:false,
// optimistic concurrency via ifMatch). Local dev: a JSON file in .data/.

import { promises as fs } from 'node:fs';
import path from 'node:path';

const PATHNAME = 'ollie/state.json';

export function emptyState() {
  return {
    version: 1,
    settings: {
      childName: 'Oliver',
      dob: '2026-03-20',
      caregivers: ['Mom', 'Dad', 'Grandparent / Nanny'],
    },
    logs: [],
    flags: {},
    customFoods: [],
    updatedAt: null,
  };
}

const useBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);

// ---------- Vercel Blob ----------
// The ETag usable with put({ ifMatch }) comes from the Blob API (head), not from the
// download response's HTTP ETag header, which uses a different format.
// head() runs BEFORE the content read: if a write lands in between, our ETag is older than
// the content we read, so the conditional write fails and we retry (safe), never the reverse.
async function blobEtag(pathname) {
  const { head, BlobNotFoundError } = await import('@vercel/blob');
  try {
    return (await head(pathname)).etag || null;
  } catch (err) {
    if (err instanceof BlobNotFoundError || err?.name === 'BlobNotFoundError') return null;
    throw err;
  }
}

async function blobRead({ withEtag = false } = {}) {
  const { get } = await import('@vercel/blob');
  const etag = withEtag ? await blobEtag(PATHNAME) : null;
  const result = await get(PATHNAME, { access: 'private', useCache: false });
  if (!result || result.statusCode !== 200) return { state: emptyState(), etag: null };
  const text = await new Response(result.stream).text();
  return { state: { ...emptyState(), ...JSON.parse(text) }, etag };
}

async function blobWrite(state, etag) {
  const { put } = await import('@vercel/blob');
  const opts = {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  };
  if (etag) opts.ifMatch = etag;
  await put(PATHNAME, JSON.stringify(state), opts);
}

// ---------- Local file (dev only) ----------
const localFile = path.join(process.cwd(), '.data', 'state.json');
let localEtag = 0;

async function fileRead() {
  try {
    const text = await fs.readFile(localFile, 'utf8');
    return { state: { ...emptyState(), ...JSON.parse(text) }, etag: String(localEtag) };
  } catch {
    return { state: emptyState(), etag: null };
  }
}

async function fileWrite(state) {
  await fs.mkdir(path.dirname(localFile), { recursive: true });
  await fs.writeFile(localFile, JSON.stringify(state, null, 2));
  localEtag++;
}

// On Vercel without a connected Blob store there is nowhere durable to save.
const storageMissing = () => Boolean(process.env.VERCEL) && !useBlob();

export async function readState() {
  if (storageMissing()) return { state: { ...emptyState(), storageMissing: true }, etag: null };
  return useBlob() ? blobRead() : fileRead();
}

// Round-trip a tiny file to prove storage reads AND writes work (GET /api/data?health).
export async function healthCheck() {
  if (storageMissing()) return { ok: false, storage: 'missing' };
  if (!useBlob()) return { ok: true, storage: 'local-file' };
  const { put, get } = await import('@vercel/blob');
  const stamp = new Date().toISOString();
  const P = 'ollie/health.json';
  const opts = { access: 'private', contentType: 'application/json', addRandomSuffix: false, allowOverwrite: true };
  try {
    await put(P, JSON.stringify({ stamp: 'first' }), opts);
    // Same conditional-write path the app uses for every save after the first.
    const etag = await blobEtag(P);
    await put(P, JSON.stringify({ stamp }), { ...opts, ifMatch: etag });
    const r = await get(P, { access: 'private', useCache: false });
    const back = JSON.parse(await new Response(r.stream).text());
    return { ok: back.stamp === stamp, storage: 'vercel-blob', conditionalWrite: 'ok', stamp };
  } catch (err) {
    return { ok: false, storage: 'vercel-blob', error: err.message };
  }
}

// Read-modify-write with retry on concurrent edits.
export async function updateState(mutate) {
  if (storageMissing()) throw new Error('Storage not connected yet: create a private Blob store and connect it to this project.');
  const ATTEMPTS = 4;
  for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
    const { state, etag } = useBlob() ? await blobRead({ withEtag: true }) : await fileRead();
    mutate(state);
    state.updatedAt = new Date().toISOString();
    try {
      // Last resort: write unconditionally so a family member's entry is never lost to repeated conflicts.
      if (useBlob()) await blobWrite(state, attempt < ATTEMPTS - 1 ? etag : null);
      else await fileWrite(state);
      return state;
    } catch (err) {
      const conflict = err && (err.name === 'BlobPreconditionFailedError' || /precondition|etag/i.test(err.message || ''));
      if (!conflict || attempt === ATTEMPTS - 1) throw err;
      await new Promise((r) => setTimeout(r, 100 * (attempt + 1)));
    }
  }
}
