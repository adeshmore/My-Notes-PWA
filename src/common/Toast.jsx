import { useEffect } from "react"

export default function Toast({ open, message, duration = 1800, onClose }) {
  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => onClose?.(), duration)
    return () => clearTimeout(t)
  }, [open, duration, onClose])

  if (!open) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="rounded-md bg-black text-white px-4 py-2 text-sm shadow-lg">
        {message}
      </div>
    </div>
  )
}
