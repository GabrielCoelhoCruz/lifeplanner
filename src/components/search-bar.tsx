import { MagnifyingGlass } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({ value, onChange, placeholder = 'Buscar...', className }: SearchBarProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 px-4 py-2.5 bg-bg-secondary rounded-full w-full md:w-80',
        className
      )}
    >
      <MagnifyingGlass size={16} className="text-text-muted shrink-0" />
      <input
        id="search-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
      />
    </div>
  )
}
