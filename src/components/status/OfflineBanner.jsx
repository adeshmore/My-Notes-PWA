export default function OfflineBanner({ isOnline }) {
  if (isOnline) return null

  return (
    <div className="offline-banner" role="status" aria-live="polite">
      <span className="offline-banner__dot" aria-hidden="true" />
      <span>
        <b>Offline.</b> Changes are saved locally.
      </span>
    </div>
  )
}
