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
async function blobRead() {
  const { get } = await import('@vercel/blob');
  const result = await get(PATHNAME, { access: 'private', useCache: false });
  if (!result || result.statusCode !== 200) return { state: emptyState(), etag: null };
  const text = await new Response(result.stream).text();
  return { state: { ...emptyState(), ...JSON.parse(text) }, etag: result.blob.etag };
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

export async function readState() {
  return useBlob() ? blobRead() : fileRead();
}

// Read-modify-write with retry on concurrent edits.
export async function updateState(mutate) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const { state, etag } = await readState();
    mutate(state);
    state.updatedAt = new Date().toISOString();
    try {
      if (useBlob()) await blobWrite(state, etag);
      else await fileWrite(state);
      return state;
    } catch (err) {
      const conflict = err && (err.name === 'BlobPreconditionFailedError' || /precondition/i.test(err.message || ''));
      if (!conflict || attempt === 3) throw err;
    }
  }
}
