export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  const result = await Notification.requestPermission()
  return result === 'granted'
}

export function getNotificationSetting(): boolean {
  return localStorage.getItem('lifeplanner-notifications') === 'true'
}

export function setNotificationSetting(enabled: boolean) {
  localStorage.setItem('lifeplanner-notifications', String(enabled))
}

export function showTaskNotification(taskTitle: string, timeInfo: string) {
  if (!getNotificationSetting()) return
  if (Notification.permission !== 'granted') return

  new Notification('LifePlanner', {
    body: `"${taskTitle}" — prazo em ${timeInfo}`,
    icon: '/icons/icon.svg',
    tag: `task-${taskTitle.slice(0, 20)}`,
    requireInteraction: false,
  })
}
