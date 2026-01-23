import { useEffect, useMemo, useState } from 'react'
import { loadNotes, saveNotes } from '../services/notesStorage'

export function useNotes() {
  const [notes, setNotes] = useState(() => loadNotes())
  const [activeId, setActiveId] = useState(() => (loadNotes()[0]?.id ?? null))
  const [query, setQuery] = useState('')

  // Persist whenever notes change
  useEffect(() => {
    saveNotes(notes)
  }, [notes])

  const filteredNotes = useMemo(() => {
    const q = query.trim().toLowerCase()
    const base = !q
      ? notes
      : notes.filter((n) => {
          const title = (n.title ?? '').toLowerCase()
          const content = (n.content ?? '').toLowerCase()
          return title.includes(q) || content.includes(q)
        })

    // Favorites first, then most recently updated
    return [...base].sort((a, b) => {
      const af = a.favorite ? 1 : 0
      const bf = b.favorite ? 1 : 0
      if (bf !== af) return bf - af
      return (b.updatedAt ?? 0) - (a.updatedAt ?? 0)
    })
  }, [notes, query])

  function createNote({ title = 'Untitled', content = '', select = true } = {}) {
    const now = Date.now()
    const newNote = {
      id: crypto.randomUUID(),
      title,
      content,
      favorite: false,
      createdAt: now,
      updatedAt: now,
    }

    setNotes(prev => [newNote, ...prev])
    if (select) setActiveId(newNote.id)
    return newNote.id
  }

  function updateNote(id, patch) {
    const now = Date.now()
    setNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, ...patch, updatedAt: now } : n))
    )
  }

  function deleteNote(id) {
    setNotes(prev => prev.filter(n => n.id !== id))
    setActiveId(prevActive => (prevActive === id ? null : prevActive))
  }

  return {
    notes,
    filteredNotes,
    activeId,
    setActiveId,
    query,
    setQuery,
    createNote,
    updateNote,
    deleteNote,
  }
}
