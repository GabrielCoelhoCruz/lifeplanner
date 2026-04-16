import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { WarningCircle } from '@phosphor-icons/react'
import { TaskiLogo } from '@/components/taski-logo'
import { PasswordInput } from '@/components/password-input'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/reset-password')({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === 'string' ? search.token : undefined,
  }),
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  const { token } = Route.useSearch()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!token) return

    if (password.length < 8) {
      toast.error('A senha precisa ter no mínimo 8 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem.')
      return
    }

    setLoading(true)
    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token,
      })
      if (error) {
        toast.error(error.message || 'Não foi possível redefinir sua senha.')
        return
      }
      toast.success('Senha atualizada. Faça login com a nova senha.')
      navigate({ to: '/login' })
    } catch (err) {
      console.error('Reset password error:', err)
      toast.error('Algo deu errado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex flex-col md:flex-row bg-bg-primary overflow-auto">
      <BrandPanel />

      <main className="flex-1 flex items-center justify-center px-5 py-10 md:px-20 md:py-12">
        <div className="w-full max-w-sm">
          {!token ? (
            <InvalidTokenState />
          ) : (
            <>
              <h2 className="text-3xl font-normal text-text-primary tracking-tight">
                Criar nova senha
              </h2>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                Escolha uma senha forte que você consiga lembrar.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="reset-password"
                    className="block text-xs font-medium text-text-secondary"
                  >
                    Nova senha
                  </label>
                  <PasswordInput
                    id="reset-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="reset-password-confirm"
                    className="block text-xs font-medium text-text-secondary"
                  >
                    Confirme a nova senha
                  </label>
                  <PasswordInput
                    id="reset-password-confirm"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a senha"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? 'Salvando...' : 'Atualizar senha'}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-text-muted">
                <Link
                  to="/login"
                  className="font-medium text-accent hover:text-accent-hover transition-colors"
                >
                  Voltar para o login
                </Link>
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

function InvalidTokenState() {
  return (
    <div className="flex flex-col items-start">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-priority-high/10 text-priority-high">
        <WarningCircle size={22} weight="regular" />
      </div>
      <h2 className="mt-6 text-3xl font-normal text-text-primary tracking-tight">
        Link inválido
      </h2>
      <p className="mt-2 text-sm text-text-secondary leading-relaxed">
        Este link de recuperação expirou ou não é válido. Peça um novo para
        continuar.
      </p>
      <div className="mt-8 flex items-center gap-4">
        <Link
          to="/forgot-password"
          className="inline-flex items-center justify-center h-11 px-5 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-lg transition-colors"
        >
          Pedir novo link
        </Link>
        <Link
          to="/login"
          className="text-sm font-medium text-accent hover:text-accent-hover transition-colors"
        >
          Voltar para login
        </Link>
      </div>
    </div>
  )
}

function BrandPanel() {
  return (
    <aside
      className="relative flex flex-col items-center px-6 py-12 md:px-16 md:py-12 md:w-[42%] md:min-w-[420px] overflow-hidden"
      style={{
        background:
          'linear-gradient(155deg, #3E35C9 0%, #544DEB 55%, #7476F5 100%)',
      }}
    >
      <div
        className="absolute pointer-events-none"
        style={{
          width: 340,
          height: 340,
          top: -80,
          right: -60,
          borderRadius: '50%',
          border: '1.5px solid rgba(255,255,255,0.06)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 12,
          height: 12,
          bottom: 92,
          left: 48,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 120,
          height: 1,
          bottom: 100,
          left: 48,
          background: 'rgba(255,255,255,0.08)',
        }}
      />

      <div className="flex-1" />

      <div className="flex flex-col items-center relative">
        <TaskiLogo
          size={112}
          strokeColor="rgba(255,255,255,0.92)"
          checkColor="#FFFFFF"
          strokeWidth={3}
        />
        <h1
          className="mt-10 text-white font-semibold"
          style={{
            fontSize: '2.5rem',
            letterSpacing: '-0.04em',
            lineHeight: '1.1',
          }}
        >
          Taski
        </h1>
        <p
          className="mt-5 text-center max-w-xs text-white/70 font-light"
          style={{
            fontSize: '1.125rem',
            lineHeight: '1.6',
            letterSpacing: '-0.005em',
          }}
        >
          Suas tarefas. Seu ritmo.
          <br />
          Seu dia organizado.
        </p>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-5 md:gap-6 relative">
        {['Projetos', 'Tarefas', 'Metas', 'Foco'].map((label) => (
          <div key={label} className="flex items-center gap-1.5">
            <span
              className="block rounded-full"
              style={{
                width: 4,
                height: 4,
                background: 'rgba(255,255,255,0.4)',
              }}
            />
            <span
              className="text-white/40 text-xs"
              style={{ letterSpacing: '0.04em' }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </aside>
  )
}
