/**
 * Derive a short (1-2 character) initials label from a user's name or email.
 * - Empty input -> "?"
 * - Email       -> first character of local part, uppercased
 * - Single word -> first character, uppercased
 * - Multi-word  -> first character of the first and last word, uppercased
 */
export function getInitials(nameOrEmail: string): string {
  const source = nameOrEmail.trim()
  if (!source) return '?'
  if (source.includes('@')) return source[0].toUpperCase()
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
