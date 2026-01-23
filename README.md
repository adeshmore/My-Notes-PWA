# Offline Notes PWA

A small **offline-first notes** Progressive Web App built with **React + Vite**.  
Users can **create, edit, delete, and search notes**. Notes are stored locally so they survive refresh and can be used offline.

## Features

- **Offline-ready PWA**: service worker generated via `vite-plugin-pwa`
- **Local persistence**: notes saved in **LocalStorage**
- **CRUD**: create / edit / delete with a confirmation modal
- **Draft editor flow**: create/edit in a draft, then **Save** or **Discard**
- **Search**: filter notes by title/content with a “No results” empty state
- **Online status**: offline banner when the network drops
- **Responsive UI**:
  - Desktop: split view (notes list + editor)
  - Mobile: list-first view; editor opens fullscreen with a Back button

## Tech stack

- **React**
- **Vite**
- **vite-plugin-pwa**
- **ESLint**
- **Tailwind CSS** (configured; UI also uses custom CSS in `src/App.css`)

## How offline + storage works

- Notes are persisted to LocalStorage under the key:
  - `offline-notes-pwa:notes:v1` (see `src/constants/storageKeys.js`)
- Storage helper:
  - `src/services/notesStorage.js` (`loadNotes`, `saveNotes`)
- Notes state + actions:
  - `src/hooks/useNotes.js`
- Online/offline detection:
  - `src/hooks/useOnlineStatus.js`

## App functionality (what to demo)

- **Create note**: tap/click **+ Create New** → type → **Save** (note appears in list)
- **Edit note**: select a note → edit in draft → **Save** (updates the stored note)
- **Discard**: while editing, click **Discard** to exit without saving changes
- **Delete note**: click trash icon → confirm modal → note removed
- **Search**: type in search → list filters; if no match, a “No results” message shows in the list
- **Offline**: works offline because notes are stored locally + PWA service worker precaches assets

## Project structure (files)

- `src/pages/Home.jsx`
  - Layout and state for the app (draft mode, mobile list/editor switching)
- `src/components/layout/Header.jsx`
  - Title + search input
- `src/components/notes/NotesList.jsx`
  - Notes list UI + empty states + icon actions (edit/delete)
- `src/components/notes/NoteEditor.jsx`
  - Draft editor + **Save/Discard** buttons
- `src/common/ConfirmModal.jsx`
  - Modern confirmation dialog (delete)
- `src/common/Toast.jsx`
  - Toast notifications (save/delete feedback)
- `src/common/icons.jsx`
  - Inline SVG icons (plus/edit/trash)
- `src/common/IconButton.jsx`
  - Small reusable icon button wrapper
- `src/hooks/useNotes.js`
  - Notes state, filtering (search), persistence trigger
- `src/services/notesStorage.js`
  - LocalStorage read/write helpers
- `src/hooks/useOnlineStatus.js`
  - Online/offline detection
- `src/pwa/registerSW.js`
  - Service worker registration (PWA)
- `src/App.css`
  - Main app styling (layout, modal, responsive rules)

## Getting started

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

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

## Quick demo checklist (for interviews)

- **Persistence**: create a note → **Save** → refresh the page → note is still there
- **Offline**: open devtools → Network → “Offline” → create/edit → **Save** → refresh → still there
- **Delete**: click trash → confirm modal → note removed
- **Search**: type in search box → list filters; “No results” appears if nothing matches
- **Mobile UX**: narrow the window → list-first; open note → editor fullscreen with Back

## Future improvements (nice extensions)

- Move from LocalStorage (sync) → **IndexedDB** (better for larger data)
- Add an **“Update available”** prompt when a new service worker is ready
- Optional export/import (JSON) or encryption at rest
