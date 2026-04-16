import { createContext, useContext, useState, useRef, useCallback, useEffect, type ReactNode } from 'react'

interface PomodoroTask {
  id: string
  title: string
  projectId: string
}

interface PomodoroContextValue {
  isRunning: boolean
  isPaused: boolean
  secondsRemaining: number
  totalSeconds: number
  activeTask: PomodoroTask | null
  start: (task: PomodoroTask, minutes?: number) => void
  pause: () => void
  resume: () => void
  stop: () => void
}

const PomodoroContext = createContext<PomodoroContextValue | null>(null)

const DEFAULT_MINUTES = 25

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const [activeTask, setActiveTask] = useState<PomodoroTask | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [secondsRemaining, setSecondsRemaining] = useState(0)
  const [totalSeconds, setTotalSeconds] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const handleComplete = useCallback(() => {
    clearTimer()
    setIsRunning(false)
    setIsPaused(false)

    // Show notification (browser-only)
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Taski — Pomodoro concluído!', {
        body: `Sessao de foco para "${activeTask?.title}" finalizada. Hora de uma pausa!`,
        icon: '/icons/icon.svg',
      })
    }

    // Play a subtle sound via Web Audio API (browser-only)
    try {
      if (typeof window === 'undefined') throw new Error('SSR')
      const audioCtx = new AudioContext()
      const oscillator = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      oscillator.connect(gain)
      gain.connect(audioCtx.destination)
      oscillator.frequency.value = 800
      gain.gain.value = 0.1
      oscillator.start()
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1)
      oscillator.stop(audioCtx.currentTime + 1)
    } catch {
      // Audio not supported — silently ignore
    }

    setActiveTask(null)
    setSecondsRemaining(0)
  }, [clearTimer, activeTask])

  const start = useCallback((task: PomodoroTask, minutes = DEFAULT_MINUTES) => {
    clearTimer()
    const total = minutes * 60
    setActiveTask(task)
    setTotalSeconds(total)
    setSecondsRemaining(total)
    setIsRunning(true)
    setIsPaused(false)

    intervalRef.current = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [clearTimer])

  // Watch for timer completion
  useEffect(() => {
    if (isRunning && !isPaused && secondsRemaining === 0 && totalSeconds > 0) {
      handleComplete()
    }
  }, [secondsRemaining, isRunning, isPaused, totalSeconds, handleComplete])

  const pause = useCallback(() => {
    clearTimer()
    setIsPaused(true)
  }, [clearTimer])

  const resume = useCallback(() => {
    setIsPaused(false)
    intervalRef.current = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) return 0
        return prev - 1
      })
    }, 1000)
  }, [])

  const stop = useCallback(() => {
    clearTimer()
    setIsRunning(false)
    setIsPaused(false)
    setActiveTask(null)
    setSecondsRemaining(0)
    setTotalSeconds(0)
  }, [clearTimer])

  // Cleanup on unmount
  useEffect(() => clearTimer, [clearTimer])

  return (
    <PomodoroContext.Provider value={{
      isRunning, isPaused, secondsRemaining, totalSeconds,
      activeTask, start, pause, resume, stop,
    }}>
      {children}
    </PomodoroContext.Provider>
  )
}

export function usePomodoro() {
  const ctx = useContext(PomodoroContext)
  if (!ctx) throw new Error('usePomodoro must be used within PomodoroProvider')
  return ctx
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}
