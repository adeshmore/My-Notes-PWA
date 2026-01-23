import { STORAGE_KEYS } from '../constants/storageKeys'

function safeParse(json, fallback) {
  try {
    return JSON.parse(json) ?? fallback
  } catch {
    return fallback
  }
}

export function loadNotes() {
  const raw = localStorage.getItem(STORAGE_KEYS.NOTES)
  const notes = safeParse(raw, [])
  return Array.isArray(notes) ? notes : []
}

export function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes))
}

