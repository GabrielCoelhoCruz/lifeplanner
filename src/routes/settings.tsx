import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { PasswordInput } from '@/components/password-input'
import { CaretLeft, Bell, SpeakerHigh, Sun, Moon, Export, Upload } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { useTheme } from '@/lib/theme'
import { api } from '@/lib/api'
import { authClient } from '@/lib/auth-client'
import { getInitials } from '@/lib/initials'
import { requestNotificationPermission, setNotificationSetting } from '@/lib/notifications'
import { checkAndNotify } from '@/hooks/use-notification-checker'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function useLocalToggle(key: string, defaultValue = false) {
  const [value, setValue] = React.useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? stored === 'true' : defaultValue
    } catch {
      return defaultValue
    }
  })

  function toggle() {
    const next = !value
    setValue(next)
    try {
      localStorage.setItem(key, String(next))
    } catch {
      // ignore
    }
  }

  return [value, toggle] as const
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
        checked ? 'bg-accent' : 'bg-bg-secondary'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

function SettingsPage() {
  const { theme, toggleTheme } = useTheme()
  const queryClient = useQueryClient()
  const [notifications, toggleNotifications] = useLocalToggle('settings:notifications', true)
  const [sounds, toggleSounds] = useLocalToggle('settings:sounds', true)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  async function handleToggleNotifications() {
    const willEnable = !notifications
    if (willEnable) {
      const granted = await requestNotificationPermission()
      if (!granted) {
        toast.error('Permissão de notificações negada pelo navegador.')
        return
      }
      setNotificationSetting(true)
      toggleNotifications()
      toast.success('Notificações ativadas! Você será avisado sobre tarefas próximas do prazo.')
      // Run an immediate check so the user sees it working right away
      checkAndNotify()
    } else {
      setNotificationSetting(false)
      toggleNotifications()
      toast.info('Notificações desativadas.')
    }
  }
  const [importing, setImporting] = React.useState(false)

  async function handleExport() {
    try {
      const data = await api.data.exportAll()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `taski-backup-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Dados exportados')
    } catch (err) {
      console.error('Export failed:', err)
      toast.error('Erro ao exportar. Tente novamente.')
    }
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    try {
      const text = await file.text()
      const data = JSON.parse(text) as { projects?: unknown[]; tasks?: unknown[]; items?: unknown[] }

      if (!data.projects || !Array.isArray(data.projects)) {
        toast.error('Arquivo inválido: nenhum projeto encontrado.')
        return
      }

      const result = await api.data.importAll(data as { projects: unknown[]; tasks?: unknown[]; items?: unknown[] })
      toast.success(`Importados: ${result.imported.projects} projetos, ${result.imported.tasks} tarefas, ${result.imported.items} itens`)
      queryClient.invalidateQueries()
    } catch (err) {
      console.error('Import failed:', err)
      toast.error('Erro ao importar dados. Tente novamente.')
    } finally {
      setImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-7 md:px-16 md:py-12 animate-fade-in-up">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
      >
        <CaretLeft size={14} />
        Meus Projetos
      </Link>

      <h1 className="mt-6 text-3xl md:text-4xl font-normal text-text-primary tracking-tight">
        Configurações
      </h1>

      <ProfileSection />

      <div className="mt-4 bg-bg-elevated border border-border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <Bell size={20} className="text-text-secondary" />
            <div>
              <p className="text-sm font-medium text-text-primary">Notificações</p>
              <p className="text-xs text-text-muted">Receber lembretes de tarefas</p>
            </div>
          </div>
          <Toggle checked={notifications} onChange={handleToggleNotifications} />
        </div>

        <Separator />

        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <SpeakerHigh size={20} className="text-text-secondary" />
            <div>
              <p className="text-sm font-medium text-text-primary">Sons</p>
              <p className="text-xs text-text-muted">Reproduzir sons ao concluir tarefas</p>
            </div>
          </div>
          <Toggle checked={sounds} onChange={toggleSounds} />
        </div>

        <Separator />

        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? (
              <Moon size={20} className="text-text-secondary" />
            ) : (
              <Sun size={20} className="text-text-secondary" />
            )}
            <div>
              <p className="text-sm font-medium text-text-primary">Tema</p>
              <p className="text-xs text-text-muted">Alterne entre tema claro e escuro</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-muted">{theme === 'dark' ? 'Escuro' : 'Claro'}</span>
            <Toggle checked={theme === 'dark'} onChange={toggleTheme} />
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <Export size={20} className="text-text-secondary" />
            <div>
              <p className="text-sm font-medium text-text-primary">Exportar dados</p>
              <p className="text-xs text-text-muted">Baixar todos os dados como JSON</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport}>
            Exportar JSON
          </Button>
        </div>
      </div>

      <div className="mt-4 bg-bg-elevated border border-border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <Upload size={20} className="text-text-secondary" />
            <div>
              <p className="text-sm font-medium text-text-primary">Importar dados</p>
              <p className="text-xs text-text-muted">Restaurar dados a partir de um arquivo JSON</p>
            </div>
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              disabled={importing}
              onClick={() => fileInputRef.current?.click()}
            >
              {importing ? 'Importando...' : 'Importar JSON'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfileSection() {
  const { data: session } = authClient.useSession()
  const user = session?.user

  const [name, setName] = React.useState('')
  const [savingProfile, setSavingProfile] = React.useState(false)

  const [currentPassword, setCurrentPassword] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const [confirmNewPassword, setConfirmNewPassword] = React.useState('')
  const [savingPassword, setSavingPassword] = React.useState(false)

  React.useEffect(() => {
    if (user?.name) setName(user.name)
  }, [user?.name])

  if (!user) return null

  const initials = getInitials(user.name || user.email || '')

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      toast.error('Informe um nome.')
      return
    }
    setSavingProfile(true)
    try {
      const { error } = await authClient.updateUser({ name: trimmed })
      if (error) {
        toast.error(error.message || 'Não foi possível atualizar o perfil.')
        return
      }
      toast.success('Perfil atualizado.')
    } catch (err) {
      console.error('Update user error:', err)
      toast.error('Algo deu errado. Tente novamente.')
    } finally {
      setSavingProfile(false)
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword.length < 8) {
      toast.error('A nova senha precisa ter no mínimo 8 caracteres.')
      return
    }
    if (newPassword !== confirmNewPassword) {
      toast.error('As senhas não coincidem.')
      return
    }
    setSavingPassword(true)
    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      })
      if (error) {
        toast.error(error.message || 'Não foi possível atualizar a senha.')
        return
      }
      toast.success('Senha atualizada.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
    } catch (err) {
      console.error('Change password error:', err)
      toast.error('Algo deu errado. Tente novamente.')
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <section className="mt-8">
      <h2 className="text-xs font-medium uppercase tracking-wider text-text-muted">
        Seu perfil
      </h2>

      <div className="mt-3 bg-bg-elevated border border-border rounded-lg p-5 md:p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex md:flex-col items-center md:items-start gap-3 md:w-32 shrink-0">
            <div
              className="flex items-center justify-center w-20 h-20 rounded-full bg-accent text-white text-2xl font-medium"
              aria-hidden
            >
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || 'Avatar'}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <span className="text-xs text-text-muted">Foto (em breve)</span>
          </div>

          <form onSubmit={handleSaveProfile} className="flex-1 space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="profile-name"
                className="block text-xs font-medium text-text-secondary"
              >
                Nome
              </label>
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como você quer ser chamado"
                autoComplete="name"
                className="w-full h-11 px-3.5 text-sm text-text-primary placeholder:text-text-muted bg-bg-primary border border-border rounded-lg outline-none transition-colors focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="profile-email"
                className="block text-xs font-medium text-text-secondary"
              >
                Email
              </label>
              <input
                id="profile-email"
                type="email"
                value={user.email ?? ''}
                readOnly
                className="w-full h-11 px-3.5 text-sm text-text-muted bg-bg-primary border border-border rounded-lg outline-none cursor-not-allowed"
              />
              <p className="text-xs text-text-muted">
                Para alterar o email, entre em contato com o suporte.
              </p>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={savingProfile} size="sm">
                {savingProfile ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-4 bg-bg-elevated border border-border rounded-lg p-5 md:p-6">
        <h3 className="text-sm font-medium text-text-primary">
          Alterar senha
        </h3>
        <p className="mt-1 text-xs text-text-muted">
          As outras sessões serão desconectadas por segurança.
        </p>

        <form onSubmit={handleChangePassword} className="mt-5 space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="current-password"
              className="block text-xs font-medium text-text-secondary"
            >
              Senha atual
            </label>
            <PasswordInput
              id="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              required
              fieldClassName="bg-bg-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="new-password"
              className="block text-xs font-medium text-text-secondary"
            >
              Nova senha
            </label>
            <PasswordInput
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              minLength={8}
              required
              fieldClassName="bg-bg-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="confirm-new-password"
              className="block text-xs font-medium text-text-secondary"
            >
              Confirmar nova senha
            </label>
            <PasswordInput
              id="confirm-new-password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
              fieldClassName="bg-bg-primary"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={savingPassword} size="sm">
              {savingPassword ? 'Atualizando...' : 'Atualizar senha'}
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}
