export default function Header({ title, query, setQuery }) {
  return (
    // Search bar in header seearching notes by title or content
    <div className="topbar">
      <div />
      <h1>{title}</h1>
      <div className="topbar-right">
        <input
          className="search"
          placeholder="Search notes here..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    </div>
  )
}
