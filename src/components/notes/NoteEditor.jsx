export default function NoteEditor({
  draft,
  setDraft,
  onSave,
  onDiscard,
  saveDisabled,
}) {

  // Notes Editor Component 
  return (
    <div className="editor-card">
      <input
        style={{
          width: '100%',
          padding: '12px 14px',
          borderRadius: 12,
          border: '2px solid #0f5f77',
          fontSize: 18,
          fontWeight: 700,
          marginBottom: 12,
          outline: 'none',
        }}
        value={draft.title}
        onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
        placeholder="Title"
      />

      <textarea
        style={{
          width: '100%',
          minHeight: '62vh',
          padding: '12px 14px',
          borderRadius: 12,
          border: '2px solid #0f5f77',
          fontSize: 16,
          outline: 'none',
          resize: 'vertical',
        }}
        value={draft.content}
        onChange={(e) => setDraft((p) => ({ ...p, content: e.target.value }))}
        placeholder="Write your note..."
      />

      <div className="editor-actions">
        <button type="button" className="discard-btn" onClick={onDiscard}>
          Discard
        </button>
        <button type="button" className="save-btn" onClick={onSave} disabled={saveDisabled}>
          Save
        </button>
      </div>
    </div>
  )
}
