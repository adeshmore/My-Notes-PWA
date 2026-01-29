## Offline Notes PWA

A small **offline-first notes** Progressive Web App built with **React + Vite**.  
Users can **create, edit, delete, and search notes**. Notes are stored locally (IndexedDB) so they survive refresh and can be used offline.

### Features

- **Offline-ready PWA**: service worker generated via `vite-plugin-pwa`
- **Local persistence**: notes saved in **IndexedDB**
- **CRUD**: create / edit / delete with a confirmation modal
- **Draft editor flow**: create/edit in a draft, then **Save** or **Discard**
- **Search**: filter notes by title/content with a “No results” empty state
- **Online status**: offline banner when the network drops
- **Responsive UI**:
  - Desktop: split view (notes list + editor)
  - Mobile: list-first view; editor opens fullscreen with a Back button

### Tech stack

- **React**
- **Vite**
- **vite-plugin-pwa**
- **idb** (small IndexedDB helper)
- **ESLint**
- **Tailwind CSS** (configured; most UI styling lives in `src/App.css`)

### How offline works (two layers)

This app stays usable offline because of **both**:

- **App shell caching (PWA / service worker)**: once you open the app online, the service worker caches the built JS/CSS so the app can load without internet (in production/preview builds).
- **Data persistence (IndexedDB)**: notes are stored locally, so creating/editing/deleting notes continues to work offline after the app is loaded.

### Notes storage (IndexedDB)

- **Database**: `offline-notes-pwa`
- **objectStore**: `notes`
- **keyPath**: `id`
- **Migration**: on first run, if IndexedDB is empty but legacy `localStorage` has notes under `offline-notes-pwa:notes:v1`, the app imports them into IndexedDB and clears the old key (see `src/services/notesDb.js`).

### Service worker behavior (DEV vs PROD)

- In **DEV** (`npm run dev`): service workers are **unregistered automatically** to prevent stale caches from breaking your layout during development.
- In **PROD / preview** (`npm run build` + `npm run preview`): the PWA service worker is registered and handles offline caching.

### App functionality (what to demo)

- **Create note**: tap/click **+ Create New** → type → **Save** (note appears in list)
- **Edit note**: select a note → edit in draft → **Save** (updates the stored note)
- **Discard**: while editing, click **Discard** to exit without saving changes
- **Delete note**: click trash icon → confirm modal → note removed
- **Search**: type in search → list filters; if no match, a “No results” message shows in the list
- **Offline**: works offline because notes are stored in IndexedDB + PWA service worker precaches assets

### Project structure (files and responsibilities)

#### Entry + bootstrapping

- **`src/main.jsx`**
  - Mounts React into `#root`
  - DEV: unregisters any existing service workers
  - PROD: registers the PWA service worker (dynamic import)

- **`src/App.jsx`**
  - Root component (currently renders `Home`)

#### Pages + UI components

- **`src/pages/Home.jsx`**
  - Main screen layout and UI state machine (browse vs edit/new)
  - Connects hooks (`useNotes`, `useOnlineStatus`) to UI components

- **`src/components/layout/Header.jsx`**
  - Header title + search input

- **`src/components/notes/NotesList.jsx`**
  - Notes list UI, empty states, note actions (select/edit/delete/favorite)

- **`src/components/notes/NoteEditor.jsx`**
  - Draft editor for title/content + Save/Discard actions

- **`src/components/status/OfflineBanner.jsx`**
  - Offline indicator (fixed-position banner so it doesn’t shift layout)

#### Reusable UI

- **`src/common/ConfirmModal.jsx`**
  - Confirmation modal (delete flow)

- **`src/common/Toast.jsx`**
  - Toast notifications (save/delete feedback)

- **`src/common/icons.jsx`**, **`src/common/IconButton.jsx`**
  - Icons + small button wrapper

#### Hooks (logic)

- **`src/hooks/useNotes.js`**
  - Loads notes from IndexedDB on mount
  - In-memory list + derived filtered list for search/sorting
  - Persists create/update/delete back to IndexedDB per note

- **`src/hooks/useOnlineStatus.js`**
  - Tracks online/offline via `window` events

#### Data layer

- **`src/services/notesDb.js`**
  - IndexedDB setup (`notes` store)
  - One-time migration from legacy `localStorage`
  - Exposes `getAllNotes`, `putNote`, `deleteNote`

- **`src/constants/storageKeys.js`**
  - Storage key constants (used for legacy migration)

#### Styling

- **`src/index.css`**
  - Global base styles (html/body/#root)

- **`src/App.css`**
  - App layout + responsive rules + offline banner styles

#### PWA

- **`src/pwa/registerSW.js`**
  - Registers the generated service worker via `virtual:pwa-register`

- **`vite.config.js`**
  - PWA config (Workbox options like `cleanupOutdatedCaches`, `clientsClaim`, `skipWaiting`)

### Getting started

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Note: in dev, the service worker is intentionally not used.

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Lint:

```bash
npm run lint
```

### How to test offline properly

To validate “real PWA offline”, use the preview build:

- Run `npm run build` then `npm run preview`
- Open the preview URL once **online** for a few seconds (lets the SW install/caches warm up)
- Toggle DevTools → Network → **Offline**
- Refresh (avoid “Empty cache and hard reload” while testing offline caching)

### Quick demo checklist

- **Persistence**: create a note → **Save** → refresh the page → note is still there
- **Offline**: after one online load in preview, go offline → create/edit → **Save** → refresh → still there
- **Delete**: click trash → confirm modal → note removed
- **Search**: type in search box → list filters; “No results” appears if nothing matches
- **Mobile UX**: narrow the window → list-first; open note → editor fullscreen with Back

### Concepts (quick explanations)

- **IndexedDB vs localStorage**:
  - IndexedDB is async, scales better, and stores each note as a separate record.
  - localStorage is synchronous and better suited for very small data.

- **Service worker caching**:
  - The SW caches the *app shell* so the SPA can boot offline.
  - Your notes are not “cached”; they’re stored as data in IndexedDB.

- **React hooks structure**:
  - UI components stay mostly “dumb”
  - Hooks (`useNotes`, `useOnlineStatus`) encapsulate logic and side effects

### Runtime flow (end-to-end)

- **App boot**
  - `src/main.jsx` mounts `<App />`
  - In PROD, `src/pwa/registerSW.js` registers the service worker (PWA caching)
- **Home page**
  - `src/pages/Home.jsx` renders the layout and reads:
    - `useOnlineStatus()` → shows/hides `OfflineBanner`
    - `useNotes()` → provides note list + CRUD actions
- **Loading notes**
  - `useNotes()` calls `getAllNotes()` from `src/services/notesDb.js`
  - `notesDb` opens/creates IndexedDB and returns all notes from the `notes` store
- **Saving notes**
  - Create/update calls `putNote(note)` (upsert by `id`) so each note is persisted as its own record
- **Deleting notes**
  - Delete calls `deleteNote(id)` to remove a single record

### Common gotchas / debugging

- **Offline doesn’t work in dev**: by design, service workers are unregistered in `npm run dev`.
- **Stale service worker** (rare after changes):
  - DevTools → Application → Service Workers → **Unregister**
  - DevTools → Application → Storage → **Clear site data**

### Future improvements (nice extensions)

- Add an **“Update available”** prompt when a new service worker is ready (using the `onNeedRefresh` callback)
- Add sync/export/import features (and potentially conflict resolution)
- Optional encryption at rest for notes
