import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { TaskiLogo } from '@/components/taski-logo'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password) {
      toast.error('Preencha email e senha.')
      return
    }

    setLoading(true)
    // Placeholder — auth not implemented yet
    setTimeout(() => {
      setLoading(false)
      toast.success('Bem-vindo ao Taski!')
      navigate({ to: '/' })
    }, 600)
  }

  function handleSocial(provider: 'google' | 'github') {
    toast.info(`Login com ${provider === 'google' ? 'Google' : 'GitHub'} em breve.`)
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
            Bem-vindo ao Taski
          </h2>
          <p className="mt-2 text-sm text-text-secondary leading-relaxed">
            Entre na sua conta para continuar organizando.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="w-full h-11 px-3.5 text-sm text-text-primary placeholder:text-text-muted bg-bg-elevated border border-border rounded-lg outline-none transition-colors focus:border-accent"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => toast.info('Recuperação de senha em breve.')}
                className="text-xs font-medium text-accent hover:text-accent-hover transition-colors cursor-pointer"
              >
                Esqueceu a senha?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-text-muted">ou continue com</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocial('google')}
              className="flex items-center justify-center gap-2 h-11 text-sm font-medium text-text-primary bg-bg-elevated border border-border rounded-lg hover:bg-bg-secondary transition-colors cursor-pointer"
            >
              <GoogleMark />
              Google
            </button>
            <button
              type="button"
              onClick={() => handleSocial('github')}
              className="flex items-center justify-center gap-2 h-11 text-sm font-medium text-text-primary bg-bg-elevated border border-border rounded-lg hover:bg-bg-secondary transition-colors cursor-pointer"
            >
              <GithubMark />
              GitHub
            </button>
          </div>

          {/* Sign up */}
          <p className="mt-8 text-center text-sm text-text-muted">
            Não tem conta?{' '}
            <Link
              to="/"
              className="font-medium text-accent hover:text-accent-hover transition-colors"
            >
              Criar conta grátis
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1A6.97 6.97 0 0 1 5.47 12c0-.73.13-1.44.36-2.1V7.07H2.18A10.98 10.98 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.07.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  )
}

function GithubMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M12 .3a12 12 0 0 0-3.79 23.38c.6.12.83-.26.83-.58v-2.23c-3.34.73-4.04-1.42-4.04-1.42-.54-1.4-1.33-1.77-1.33-1.77-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .1-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.81 5.63-5.48 5.92.42.36.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .3z" />
    </svg>
  )
}
