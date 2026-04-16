import { useEffect, useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { CheckCircle, WarningCircle, CircleNotch } from '@phosphor-icons/react'
import { TaskiLogo } from '@/components/taski-logo'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/verify-email')({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === 'string' ? search.token : undefined,
  }),
  component: VerifyEmailPage,
})

type Status = 'loading' | 'success' | 'error'

function VerifyEmailPage() {
  const { token } = Route.useSearch()
  const navigate = useNavigate()
  const [status, setStatus] = useState<Status>(token ? 'loading' : 'error')

  useEffect(() => {
    if (!token) return
    let cancelled = false

    async function run() {
      try {
        const { error } = await authClient.verifyEmail({
          query: { token: token as string },
        })
        if (cancelled) return
        if (error) {
          setStatus('error')
        } else {
          setStatus('success')
        }
      } catch (err) {
        console.error('Verify email error:', err)
        if (!cancelled) setStatus('error')
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [token])

  useEffect(() => {
    if (status !== 'success') return
    const timeout = window.setTimeout(() => {
      navigate({ to: '/' })
    }, 2000)
    return () => window.clearTimeout(timeout)
  }, [status, navigate])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-bg-primary px-5 py-10">
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        <TaskiLogo size={56} strokeColor="var(--color-accent)" checkColor="var(--color-accent)" />

        {status === 'loading' && (
          <>
            <div className="mt-10 text-text-secondary animate-spin">
              <CircleNotch size={28} weight="bold" />
            </div>
            <h1 className="mt-6 text-2xl font-normal text-text-primary tracking-tight">
              Verificando seu email...
            </h1>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              Isso leva só um instante.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mt-10 flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-accent">
              <CheckCircle size={28} weight="regular" />
            </div>
            <h1 className="mt-6 text-2xl font-normal text-text-primary tracking-tight">
              Email verificado!
            </h1>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              Redirecionando você para o app...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mt-10 flex items-center justify-center w-12 h-12 rounded-full bg-priority-high/10 text-priority-high">
              <WarningCircle size={28} weight="regular" />
            </div>
            <h1 className="mt-6 text-2xl font-normal text-text-primary tracking-tight">
              Link expirado ou inválido
            </h1>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              Este link de verificação não é mais válido. Peça um novo para
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
          </>
        )}
      </div>
    </div>
  )
}
