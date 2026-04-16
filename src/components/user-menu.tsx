import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { SignOut, User as UserIcon } from '@phosphor-icons/react'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { authClient } from '@/lib/auth-client'

export function UserMenu() {
  const navigate = useNavigate()
  const { data: session } = authClient.useSession()
  const [loading, setLoading] = useState(false)

  const user = session?.user
  if (!user) return null

  const initials = getInitials(user.name || user.email || '')

  async function handleLogout() {
    setLoading(true)
    try {
      await authClient.signOut()
      toast.success('Você saiu da sua conta.')
      navigate({ to: '/login', replace: true })
    } catch (err) {
      console.error('Logout error:', err)
      toast.error('Erro ao sair. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center justify-center w-9 h-9 rounded-full bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        aria-label="Menu do usuário"
      >
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt={user.name || 'Avatar'}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span aria-hidden>{initials}</span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-[220px]">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-text-primary truncate">
              {user.name || 'Sua conta'}
            </span>
            <span className="text-xs text-text-muted truncate">
              {user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate({ to: '/settings' })}>
          <UserIcon size={16} className="mr-2" />
          Configurações
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={loading}
          className="text-priority-high focus:text-priority-high"
        >
          <SignOut size={16} className="mr-2" />
          {loading ? 'Saindo...' : 'Sair'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function getInitials(nameOrEmail: string): string {
  const source = nameOrEmail.trim()
  if (!source) return '?'
  // If it's an email, use the first letter of the local part
  if (source.includes('@')) {
    return source[0].toUpperCase()
  }
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
