import { describe, expect, it } from 'vitest'
import { planDataImport } from './data-mapping'

describe('planDataImport', () => {
  it('maps modern project context IDs to imported owned contexts', () => {
    const plan = planDataImport({
      contexts: [
        { id: 'ctx-lh', name: 'Learned Hand', color: '#111111' },
        { id: 'ctx-cia', name: 'CIA', color: '#222222' },
      ],
      projects: [
        { id: 'project-lh', name: 'Platform', contextId: 'ctx-lh' },
        { id: 'project-cia', name: 'Operations', context_id: 'ctx-cia' },
      ],
    })

    expect(plan.contexts.map((context) => context.name)).toEqual([
      'Learned Hand',
      'CIA',
    ])
    expect(plan.projects.map((project) => project.contextKey)).toEqual([
      'learned hand',
      'cia',
    ])
  })

  it('supports legacy labels and deduplicates them case-insensitively', () => {
    const plan = planDataImport({
      projects: [
        { id: 'project-1', name: 'One', context: '  CIA  ' },
        { id: 'project-2', name: 'Two', context: 'cia' },
        { id: 'project-3', name: 'Three', context: '   ' },
      ],
    })

    expect(plan.contexts.map((context) => context.name)).toEqual(['CIA', 'Pessoal'])
    expect(plan.projects.map((project) => project.contextKey)).toEqual([
      'cia',
      'cia',
      'pessoal',
    ])
  })

  it('restores transitional backups that contain contextId and a legacy label', () => {
    const plan = planDataImport({
      projects: [
        {
          id: 'project-1',
          name: 'One',
          contextId: 'context-not-exported-by-old-version',
          context: 'Learned Hand',
        },
      ],
    })

    expect(plan.contexts[0].name).toBe('Learned Hand')
    expect(plan.projects[0].contextKey).toBe('learned hand')
  })

  it('rejects a project that references a context absent from the backup', () => {
    expect(() =>
      planDataImport({
        contexts: [{ id: 'ctx-cia', name: 'CIA', color: '#222222' }],
        projects: [
          { id: 'project-1', name: 'One', contextId: 'ctx-other-user' },
        ],
      }),
    ).toThrow('Contexto inválido no arquivo de importação')
  })
})
