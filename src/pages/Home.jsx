import { useMemo, useState } from "react"
import Header from "../components/layout/Header"
import NotesList from "../components/notes/NotesList"
import NoteEditor from "../components/notes/NoteEditor"
import OfflineBanner from "../components/status/OfflineBanner"
import ConfirmModal from "../common/ConfirmModal"
import Toast from "../common/Toast"
import { useNotes } from "../hooks/useNotes"
import { useOnlineStatus } from "../hooks/useOnlineStatus"

export default function Home() {
  const isOnline = useOnlineStatus()

  const {
    notes,
    filteredNotes,
    activeId,
    setActiveId,
    query,
    setQuery,
    createNote,
    updateNote,
    deleteNote,
  } = useNotes()

  const [mode, setMode] = useState("none") // none | new | edit
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState({ title: "", content: "" })

  // Delete flow 
  const [pendingDeleteId, setPendingDeleteId] = useState(null)
  const [toast, setToast] = useState({ open: false, message: "", duration: 1800 })

  const saveDisabled = useMemo(() => {
    const t = draft.title.trim()
    const c = draft.content.trim()
    return !t && !c
  }, [draft.title, draft.content])

  function startNew() {
    setActiveId(null)
    setMode("new")
    setEditingId(null)
    setDraft({ title: "", content: "" })
  }

  function startEdit(id) {
    const n = notes.find((x) => x.id === id)
    if (!n) return
    setActiveId(id)
    setMode("edit")
    setEditingId(id)
    setDraft({ title: n.title ?? "", content: n.content ?? "" })
  }

  function closeEditor() {
    setMode("none")
    setEditingId(null)
    setDraft({ title: "", content: "" })
    setActiveId(null)
  }

  function saveDraft() {
    if (saveDisabled) return

    const title = draft.title.trim() || "Untitled"
    const content = draft.content

    if (mode === "new") {
      createNote({ title, content, select: false })
      setToast({ open: true, message: "Note saved", duration: 1800 })
      closeEditor()
      return
    }

    if (mode === "edit" && editingId) {
      updateNote(editingId, { title, content })
      setToast({ open: true, message: "Note saved", duration: 1800 })
      closeEditor()
    }
  }

  function requestDelete(id) {
    setPendingDeleteId(id)
  }

  function toggleFavorite(id) {
    const n = notes.find((x) => x.id === id)
    if (!n) return
    const next = !n.favorite
    updateNote(id, { favorite: next })
    setToast({
      open: true,
      message: next ? "Added to favorites" : "Removed from favorites",
      duration: 1400,
    })
  }

  function closeModal() {
    setPendingDeleteId(null)
  }

  function confirmDelete() {
    if (!pendingDeleteId) return
    deleteNote(pendingDeleteId)
    setPendingDeleteId(null)

    setToast({ open: true, message: "Note deleted", duration: 1800 })
    if (pendingDeleteId === editingId) {
      closeEditor()
    }
  }

  return (
    <div className={["notes-shell", mode !== "none" ? "is-editing" : "is-browsing"].join(" ")}>
      <OfflineBanner isOnline={isOnline} />
      <Header title="My Notes" query={query} setQuery={setQuery} />

      <div className="split">
        <aside className="sidebar">
          <div className="sidebar-actions">
            <button className="mobile-new" type="button" onClick={startNew}>
              + Create New
            </button>
          </div>
          <NotesList
            notes={filteredNotes}
            query={query}
            hasAnyNotes={notes.length > 0}
            activeId={activeId}
            onSelect={startEdit}
            onRequestDelete={requestDelete}
            onRequestEdit={startEdit}
            onToggleFavorite={toggleFavorite}
          />
        </aside>

        <main className="content">
          {mode !== "none" ? (
            <>
              <div className="mobile-editor-top">
                <button type="button" className="mobile-back" onClick={closeEditor}>
                  ← Back
                </button>
              </div>
              <NoteEditor
                draft={draft}
                setDraft={setDraft}
                onSave={saveDraft}
                onDiscard={closeEditor}
                saveDisabled={saveDisabled}
              />
            </>
          ) : (
            <div className="empty-state">
              <button className="empty-new" type="button" onClick={startNew}>
                + Create New
              </button>
            </div>
          )}
        </main>
      </div>

      <ConfirmModal
        open={!!pendingDeleteId}
        title="Delete note?"
        message="This action cannot be undone. The note will be permanently deleted."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={closeModal}
      />

      <Toast
        open={toast.open}
        message={toast.message}
        duration={toast.duration}
        onClose={() => setToast({ open: false, message: "", duration: 1800 })}
      />
    </div>
  )
}
