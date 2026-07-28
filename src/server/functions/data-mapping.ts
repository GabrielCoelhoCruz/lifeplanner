export interface ImportPayload {
  contexts?: Array<Record<string, unknown>>
  projects: Array<Record<string, unknown>>
}

export interface PlannedContext {
  key: string
  name: string
  description: string
  color: string
  icon: string | null
  position: number
}

export interface PlannedProject {
  sourceId: string
  name: string
  description: string
  color: string
  position: number
  contextKey: string
}

function normalizeName(value: unknown, fallback?: string): string {
  if (typeof value !== 'string') return fallback ?? ''
  const normalized = value.trim().replace(/\s+/g, ' ')
  return normalized || fallback || ''
}

function contextKey(name: string): string {
  return name.toLocaleLowerCase()
}

export function planDataImport(payload: ImportPayload): {
  contexts: PlannedContext[]
  projects: PlannedProject[]
} {
  if (!Array.isArray(payload.projects)) throw new Error('Formato inválido')

  const contextsByKey = new Map<string, PlannedContext>()
  const sourceContextKeys = new Map<string, string>()

  for (const context of payload.contexts ?? []) {
    if (typeof context.id !== 'string') {
      throw new Error('Contexto inválido no arquivo de importação')
    }
    const name = normalizeName(context.name)
    if (!name) throw new Error('Contexto inválido no arquivo de importação')
    const key = contextKey(name)
    if (!contextsByKey.has(key)) {
      contextsByKey.set(key, {
        key,
        name,
        description: typeof context.description === 'string' ? context.description : '',
        color: typeof context.color === 'string' && context.color ? context.color : '#6366F1',
        icon: typeof context.icon === 'string' ? context.icon : null,
        position: typeof context.position === 'number' ? context.position : 0,
      })
    }
    sourceContextKeys.set(context.id, key)
  }

  const plannedProjects = payload.projects.map((project): PlannedProject => {
    if (
      typeof project.id !== 'string' ||
      typeof project.name !== 'string' ||
      !project.name.trim()
    ) {
      throw new Error('Projeto inválido no arquivo de importação')
    }

    const sourceContextId =
      typeof project.contextId === 'string'
        ? project.contextId
        : typeof project.context_id === 'string'
          ? project.context_id
          : null

    let key: string
    if (sourceContextId) {
      const importedKey = sourceContextKeys.get(sourceContextId)
      if (!importedKey) {
        const legacyName = normalizeName(project.context)
        if (!legacyName) {
          throw new Error('Contexto inválido no arquivo de importação')
        }
        key = contextKey(legacyName)
        if (!contextsByKey.has(key)) {
          contextsByKey.set(key, {
            key,
            name: legacyName,
            description: '',
            color: '#6366F1',
            icon: null,
            position: 0,
          })
        }
      } else {
        key = importedKey
      }
    } else {
      const name = normalizeName(project.context, 'Pessoal')
      key = contextKey(name)
      if (!contextsByKey.has(key)) {
        contextsByKey.set(key, {
          key,
          name,
          description: '',
          color: '#6366F1',
          icon: null,
          position: 0,
        })
      }
    }

    return {
      sourceId: project.id,
      name: project.name.trim(),
      description:
        typeof project.description === 'string' ? project.description : '',
      color:
        typeof project.color === 'string' && project.color
          ? project.color
          : '#6366F1',
      position: typeof project.position === 'number' ? project.position : 0,
      contextKey: key,
    }
  })

  return {
    contexts: Array.from(contextsByKey.values()),
    projects: plannedProjects,
  }
}
