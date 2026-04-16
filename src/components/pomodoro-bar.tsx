import { usePomodoro, formatTime } from '@/lib/pomodoro'
import { Pause, Play, Stop, Timer } from '@phosphor-icons/react'

export function PomodoroBar() {
  const { isRunning, isPaused, secondsRemaining, totalSeconds, activeTask, pause, resume, stop } = usePomodoro()

  if (!isRunning && !isPaused) return null

  const progress = totalSeconds > 0 ? ((totalSeconds - secondsRemaining) / totalSeconds) * 100 : 0

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-bg-elevated border-t border-border shadow-lg animate-fade-in-up">
      {/* Progress bar */}
      <div className="h-1 bg-bg-secondary">
        <div
          className="h-full bg-accent transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between px-5 py-3 md:px-16">
        <div className="flex items-center gap-3">
          <Timer size={20} className="text-accent" />
          <div>
            <p className="text-sm font-medium text-text-primary truncate max-w-[200px]">
              {activeTask?.title}
            </p>
            <p className="text-xs text-text-muted">Modo foco</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-2xl font-mono text-text-primary tabular-nums">
            {formatTime(secondsRemaining)}
          </span>

          <div className="flex items-center gap-1">
            {isPaused ? (
              <button
                onClick={resume}
                className="p-2 rounded-lg text-accent hover:bg-bg-secondary transition-colors"
                aria-label="Continuar"
              >
                <Play size={20} weight="fill" />
              </button>
            ) : (
              <button
                onClick={pause}
                className="p-2 rounded-lg text-text-secondary hover:bg-bg-secondary transition-colors"
                aria-label="Pausar"
              >
                <Pause size={20} weight="fill" />
              </button>
            )}
            <button
              onClick={stop}
              className="p-2 rounded-lg text-priority-high hover:bg-bg-secondary transition-colors"
              aria-label="Parar"
            >
              <Stop size={20} weight="fill" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
