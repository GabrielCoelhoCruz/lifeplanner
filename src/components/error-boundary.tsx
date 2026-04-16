import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <p className="text-lg text-text-secondary">Algo deu errado.</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-accent text-white rounded-md text-sm"
            >
              Tentar novamente
            </button>
          </div>
        )
      )
    }
    return this.props.children
  }
}
