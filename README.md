# Ollie's Food Tracker

A simple shared tracker for Oliver's first foods (8–18 months):

- **Allergen introduction.** Covers all 9 top allergens (peanut, egg, dairy, wheat, soy, each tree nut, fish, shellfish, sesame). It suggests the next one, spaces new allergens about 3 days apart, and flags any introduced allergen not given in 7+ days.
- **Palate building.** Each food tracks up to 15 tries. A food can only be marked "disliked" after 10+ tries.
- **Variety.** Tracks weekly coverage of flavors (sweet, sour, bitter, savory, earthy, spiced, mild) and rainbow colors, and suggests new foods to fill the gaps.
- **Per-tasting log.** Each entry records the date, liked / OK / refused, reaction (none, mild or severe; severe auto-flags the food "Avoid"), preparation, who fed him, and notes.

## How it works
- Static front end in `public/` (vanilla JS, no build step). The food list lives in `public/foods.js`.
- `api/data.js` is a Vercel Function: `GET` reads the data, `POST` applies a change. There's no login or PIN, so anyone with the link can view and edit. Keep the URL within the family. `GET /api/data?health` checks that storage can be read and written.
- The look is adapted from the "Kids Learning App" Figma community kit by Mohamed Talaat: teal primary, pastel tiles, Roboto.
- Data is stored as one JSON document in a **private Vercel Blob** store (`lib/store.js`). Reads skip the cache (`useCache: false`) so they always return the latest write, and writes use ETag `ifMatch` so two simultaneous edits don't overwrite each other.

## Local dev
```bash
npm install
npm run dev   # http://localhost:3000, data saved to .data/state.json
```

## Deploy
Vercel project settings: Framework "Other", output directory `public`. Connect a **private** Vercel Blob store to the project. This sets `BLOB_STORE_ID`, which the app uses with Vercel's built-in credentials (a `BLOB_READ_WRITE_TOKEN` also works).

_Not medical advice. Check with your pediatrician, especially if there's eczema or a known allergy._
