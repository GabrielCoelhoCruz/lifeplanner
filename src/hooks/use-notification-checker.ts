import { useEffect, useRef } from 'react'
import { api } from '@/lib/api'
import { getNotificationSetting, showTaskNotification } from '@/lib/notifications'

const CHECK_INTERVAL = 15 * 60 * 1000 // Check every 15 minutes
const NOTIFIED_KEY = 'taski:notified-tasks'

function getNotifiedTasks(): Set<string> {
  try {
    const stored = localStorage.getItem(NOTIFIED_KEY)
    return stored ? new Set(JSON.parse(stored)) : new Set()
  } catch {
    return new Set()
  }
}

function markTaskNotified(taskId: string) {
  const notified = getNotifiedTasks()
  notified.add(taskId)
  // Keep only last 100 entries to prevent localStorage bloat
  const arr = Array.from(notified).slice(-100)
  localStorage.setItem(NOTIFIED_KEY, JSON.stringify(arr))
}

function formatDueDate(dueDate: string | Date): string {
  const date = new Date(dueDate)
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffHours = Math.round(diffMs / (1000 * 60 * 60))

  if (diffHours < 0) return 'atrasada!'
  if (diffHours < 1) return 'menos de 1 hora'
  if (diffHours < 24) return `${diffHours} horas`
  return `${Math.round(diffHours / 24)} dias`
}

async function checkAndNotify() {
  if (!getNotificationSetting()) return
  if (Notification.permission !== 'granted') return

  try {
    // Use the existing today endpoint — returns all overdue + due-today tasks in ONE query
    const todayTasks = await api.views.today()
    const notified = getNotifiedTasks()

    for (const { task } of todayTasks) {
      if (notified.has(task.id)) continue
      if (!task.dueDate) continue

      showTaskNotification(task.title, formatDueDate(task.dueDate))
      markTaskNotified(task.id)
    }
  } catch (error) {
    console.error('Notification check failed:', error)
  }
}

export { checkAndNotify }

export function useNotificationChecker() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    // Check once on mount (with a small delay to not block initial render)
    const timeout = setTimeout(checkAndNotify, 5000)

    // Then check periodically
    intervalRef.current = setInterval(checkAndNotify, CHECK_INTERVAL)

    return () => {
      clearTimeout(timeout)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])
}
