import { openDB } from 'idb'
import { STORAGE_KEYS } from '../constants/storageKeys'

const DB_NAME = 'offline-notes-pwa'
const DB_VERSION = 1
const STORE_NOTES = 'notes'

let dbPromise
let migrationPromise

function safeParse(json, fallback) {
  try {
    return JSON.parse(json) ?? fallback
  } catch {
    return fallback
  }
}

async function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, _oldVersion, _newVersion, transaction) {
        let store
        if (!db.objectStoreNames.contains(STORE_NOTES)) {
          store = db.createObjectStore(STORE_NOTES, { keyPath: 'id' })
        } else {
          store = transaction.objectStore(STORE_NOTES)
        }

        if (!store.indexNames.contains('updatedAt')) {
          store.createIndex('updatedAt', 'updatedAt')
        }
      },
    })
  }

  return dbPromise
}

/**
 * One-time migration: if IndexedDB is empty but localStorage has notes, import them.
 * This avoids "old cached data" issues and upgrades storage safely.
 */
async function migrateFromLocalStorageIfNeeded(db) {
  const count = await db.count(STORE_NOTES)
  if (count > 0) return

  const raw = localStorage.getItem(STORAGE_KEYS.NOTES)
  if (!raw) return

  const notes = safeParse(raw, [])
  if (!Array.isArray(notes) || notes.length === 0) {
    localStorage.removeItem(STORAGE_KEYS.NOTES)
    return
  }

  const tx = db.transaction(STORE_NOTES, 'readwrite')
  await Promise.all(notes.map((n) => tx.store.put(n)))
  await tx.done

  // Remove legacy storage so we don't re-import on every load
  localStorage.removeItem(STORAGE_KEYS.NOTES)
}

async function ensureMigrated(db) {
  if (!migrationPromise) {
    migrationPromise = migrateFromLocalStorageIfNeeded(db)
  }
  await migrationPromise
}

export async function getAllNotes() {
  const db = await getDb()
  await ensureMigrated(db)
  return db.getAll(STORE_NOTES)
}

export async function putNote(note) {
  const db = await getDb()
  await ensureMigrated(db)
  await db.put(STORE_NOTES, note)
}

export async function deleteNote(id) {
  const db = await getDb()
  await ensureMigrated(db)
  await db.delete(STORE_NOTES, id)
}

