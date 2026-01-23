export default function IconButton({
  onClick,
  children,
  label,
  title,
  variant = 'teal',
  style,
}) {
  const palette =
    variant === 'ghost'
      ? { bg: '#ffffff', fg: '#0f5f77', border: 'rgba(15, 95, 119, 0.45)' }
      : variant === 'favorite'
        ? { bg: 'rgba(255, 59, 48, 0.10)', fg: '#ff3b30', border: 'rgba(255, 59, 48, 0.55)' }
        : { bg: '#0f5f77', fg: '#ffffff', border: '#0b4b5f' }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={title ?? label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: 40,
        height: 36,
        padding: 0,
        borderRadius: 8,
        border: `2px solid ${palette.border}`,
        background: palette.bg,
        color: palette.fg,
        cursor: 'pointer',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

