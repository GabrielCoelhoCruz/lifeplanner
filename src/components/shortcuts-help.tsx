import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Keyboard } from '@phosphor-icons/react'

interface ShortcutsHelpProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const shortcuts = [
  { keys: ['N'], description: 'Nova tarefa' },
  { keys: ['P'], description: 'Novo projeto' },
  { keys: ['/'], description: 'Buscar' },
  { keys: ['G', 'H'], description: 'Ir para Dashboard' },
  { keys: ['G', 'T'], description: 'Ir para Hoje' },
  { keys: ['G', 'S'], description: 'Ir para Configurações' },
  { keys: ['?'], description: 'Mostrar atalhos' },
  { keys: ['Esc'], description: 'Fechar painel/dialog' },
]

export function ShortcutsHelp({ open, onOpenChange }: ShortcutsHelpProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard size={20} />
            Atalhos de teclado
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2 mt-2">
          {shortcuts.map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <span className="text-sm text-text-secondary">
                {s.description}
              </span>
              <div className="flex items-center gap-1">
                {s.keys.map((k, j) => (
                  <span key={j}>
                    <kbd className="px-2 py-1 text-xs font-mono bg-bg-secondary text-text-primary rounded border border-border">
                      {k}
                    </kbd>
                    {j < s.keys.length - 1 && (
                      <span className="text-text-muted mx-1">then</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
