import IconButton from "../../common/IconButton"
import { EditIcon, HeartIcon, TrashIcon } from "../../common/icons"

export default function NotesList({
  notes,
  query = "",
  hasAnyNotes = false,
  activeId,
  onSelect,
  onRequestDelete,
  onRequestEdit,
  onToggleFavorite,
}) {
  if (!notes.length) {
    const q = query.trim()
    if (hasAnyNotes && q) {
      return (
        <div className="sidebar-empty">
          <div className="sidebar-empty-title">No results</div>
          <div className="sidebar-empty-subtitle">
            Nothing matched for <b>{q}</b>.
          </div>
        </div>
      )
    }

    return (
      <div className="sidebar-empty">
        <div className="sidebar-empty-title">No notes yet</div>
        <div className="sidebar-empty-subtitle">
          Click <b>+ Create New</b> to add your first note.
        </div>
      </div>
    )
  }

  return (
    <div>
      {notes.map((n) => (
        <div key={n.id} className="note-row">
          <button
            type="button"
            onClick={() => onSelect(n.id)}
            className={[
              "note-title-btn",
              n.id === activeId ? "active" : ""
            ].join(" ")}
          >
            {n.title || 'Untitled'}
          </button>

          <div className="note-actions">
            <IconButton
              label={n.favorite ? "Unfavorite note" : "Favorite note"}
              title={n.favorite ? "Unfavorite" : "Favorite"}
              variant={n.favorite ? "favorite" : "ghost"}
              onClick={() => onToggleFavorite?.(n.id)}
            >
              <HeartIcon filled={!!n.favorite} />
            </IconButton>

            <IconButton
              label="Edit note"
              title="Edit"
              onClick={() => onRequestEdit?.(n.id)}
            >
              <EditIcon />
            </IconButton>

            <IconButton
              label="Delete note"
              title="Delete"
              onClick={() => onRequestDelete(n.id)}
            >
              <TrashIcon />
            </IconButton>
          </div>
        </div>
      ))}
    </div>
  )
}
