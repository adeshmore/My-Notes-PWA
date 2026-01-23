export default function OfflineBanner({ isOnline }) {
  if (isOnline) return null

  return (
    <div className="w-full bg-yellow-100 text-yellow-900 border-b border-yellow-200 px-4 py-2 text-sm">
      You are offline ⚠️
  changes are saved locally.
    </div>
  )
}
