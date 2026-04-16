import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { TaskiLogo } from '@/components/taski-logo'
import { PasswordInput } from '@/components/password-input'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

type AuthMode = 'signin' | 'signup'

function LoginPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<AuthMode>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const isSignUp = mode === 'signup'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password) {
      toast.error('Preencha email e senha.')
      return
    }
    if (isSignUp && !name.trim()) {
      toast.error('Informe seu nome.')
      return
    }

    setLoading(true)
    try {
      if (isSignUp) {
        const { error } = await authClient.signUp.email({
          email: email.trim(),
          password,
          name: name.trim(),
        })
        if (error) {
          toast.error(error.message || 'Erro ao criar conta.')
          return
        }
        toast.success(`Bem-vindo ao Taski, ${name.trim().split(' ')[0]}!`)
      } else {
        const { error } = await authClient.signIn.email({
          email: email.trim(),
          password,
        })
        if (error) {
          toast.error(error.message || 'Email ou senha incorretos.')
          return
        }
        toast.success('Bem-vindo de volta!')
      }
      navigate({ to: '/' })
    } catch (err) {
      console.error('Auth error:', err)
      toast.error('Algo deu errado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex flex-col md:flex-row bg-bg-primary overflow-auto">
      {/* ===== BRAND PANEL (left on desktop, top on mobile) ===== */}
      <aside
        className="relative flex flex-col items-center px-6 py-12 md:px-16 md:py-12 md:w-[42%] md:min-w-[420px] overflow-hidden"
        style={{
          background:
            'linear-gradient(155deg, #3E35C9 0%, #544DEB 55%, #7476F5 100%)',
        }}
      >
        {/* Decorative ring */}
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
        {/* Decorative dot */}
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
        {/* Decorative line */}
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

        {/* Hero icon + wordmark */}
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

        {/* Feature pills */}
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

      {/* ===== FORM PANEL ===== */}
      <main className="flex-1 flex items-center justify-center px-5 py-10 md:px-20 md:py-12">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-normal text-text-primary tracking-tight">
            {isSignUp ? 'Crie sua conta' : 'Bem-vindo ao Taski'}
          </h2>
          <p className="mt-2 text-sm text-text-secondary leading-relaxed">
            {isSignUp
              ? 'Comece a organizar sua vida em um só lugar.'
              : 'Entre na sua conta para continuar organizando.'}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {isSignUp && (
              <div className="space-y-1.5">
                <label
                  htmlFor="login-name"
                  className="block text-xs font-medium text-text-secondary"
                >
                  Nome
                </label>
                <input
                  id="login-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Como você quer ser chamado"
                  autoComplete="name"
                  required
                  className="w-full h-11 px-3.5 text-sm text-text-primary placeholder:text-text-muted bg-bg-elevated border border-border rounded-lg outline-none transition-colors focus:border-accent"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="block text-xs font-medium text-text-secondary"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                autoComplete="email"
                required
                className="w-full h-11 px-3.5 text-sm text-text-primary placeholder:text-text-muted bg-bg-elevated border border-border rounded-lg outline-none transition-colors focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="login-password"
                className="block text-xs font-medium text-text-secondary"
              >
                Senha
              </label>
              <PasswordInput
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignUp ? 'Mínimo 8 caracteres' : '••••••••'}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                minLength={isSignUp ? 8 : undefined}
                required
              />
              {isSignUp && (
                <p className="text-xs text-text-muted">
                  Use pelo menos 8 caracteres.
                </p>
              )}
            </div>

            {!isSignUp && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate({ to: '/forgot-password' })}
                  className="text-xs font-medium text-accent hover:text-accent-hover transition-colors cursor-pointer"
                >
                  Esqueceu a senha?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading
                ? isSignUp
                  ? 'Criando conta...'
                  : 'Entrando...'
                : isSignUp
                  ? 'Criar conta'
                  : 'Entrar'}
            </button>
          </form>

          {/* Toggle mode */}
          <p className="mt-8 text-center text-sm text-text-muted">
            {isSignUp ? 'Já tem conta?' : 'Não tem conta?'}{' '}
            <button
              type="button"
              onClick={() => setMode(isSignUp ? 'signin' : 'signup')}
              className="font-medium text-accent hover:text-accent-hover transition-colors cursor-pointer"
            >
              {isSignUp ? 'Entrar' : 'Criar conta grátis'}
            </button>
          </p>
        </div>
      </main>
    </div>
  )
}

