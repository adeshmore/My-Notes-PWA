import { useEffect, useMemo, useState } from 'react'
import { deleteNote as deleteNoteFromDb, getAllNotes, putNote } from '../services/notesDb'

export function useNotes() {
  const [notes, setNotes] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      const loaded = await getAllNotes()
      if (cancelled) return
      setNotes(Array.isArray(loaded) ? loaded : [])
      setActiveId((loaded?.[0]?.id ?? null) || null)
    })()

    return () => {
      cancelled = true
    }
  }, [])

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

    putNote(newNote).catch((e) => console.error('Failed to save note', e))
    return newNote.id
  }

  function updateNote(id, patch) {
    const now = Date.now()
    let updated = null
    setNotes(prev => {
      const next = prev.map(n => {
        if (n.id !== id) return n
        updated = { ...n, ...patch, updatedAt: now }
        return updated
      })
      return next
    })

    if (updated) {
      putNote(updated).catch((e) => console.error('Failed to save note', e))
    }
  }

  function deleteNote(id) {
    setNotes(prev => prev.filter(n => n.id !== id))
    setActiveId(prevActive => (prevActive === id ? null : prevActive))
    deleteNoteFromDb(id).catch((e) => console.error('Failed to delete note', e))
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
