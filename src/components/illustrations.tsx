// Minimal line-art SVG illustrations for empty states.
// Each uses currentColor so they adapt to light/dark mode automatically.

export function IllustrationProjects() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="14" width="36" height="26" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 14V12C6 10.3431 7.34315 9 9 9H18L22 14" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="36" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
    </svg>
  )
}

export function IllustrationTasks() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="8" width="28" height="32" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 18L20 22L28 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="16" y1="28" x2="32" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <line x1="16" y1="34" x2="28" y2="34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    </svg>
  )
}

export function IllustrationToday() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="10" width="32" height="30" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <line x1="8" y1="18" x2="40" y2="18" stroke="currentColor" strokeWidth="1.5" />
      <line x1="16" y1="7" x2="16" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="32" y1="7" x2="32" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="24" cy="28" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M24 21V23M24 33V35M17 28H19M29 28H31" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
    </svg>
  )
}

export function IllustrationSearch() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="22" cy="22" r="12" stroke="currentColor" strokeWidth="1.5" />
      <line x1="31" y1="31" x2="40" y2="40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M19 18C19 16.3431 20.3431 15 22 15C23.6569 15 25 16.3431 25 18C25 19.6569 23.5 20 22 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="22" cy="25" r="0.5" fill="currentColor" />
    </svg>
  )
}
