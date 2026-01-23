import { useEffect, useRef } from "react"

export default function ConfirmModal({
  open,
  title = "Confirm",
  message = "Are you sure?",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  const cancelRef = useRef(null)

  useEffect(() => {
    if (!open) return
    // Lock scroll while open
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"

    // Focus cancel for safer default
    cancelRef.current?.focus?.()

    const onKeyDown = (e) => {
      if (e.key === "Escape") onCancel?.()
    }
    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={title}>
      <button
        type="button"
        className="modal-backdrop"
        onClick={onCancel}
        aria-label="Close modal"
      />

      <div className="modal-card" role="document">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
        </div>

        <div className="modal-body">{message}</div>

        <div className="modal-actions">
          <button
            type="button"
            ref={cancelRef}
            className="btn btn-ghost"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
