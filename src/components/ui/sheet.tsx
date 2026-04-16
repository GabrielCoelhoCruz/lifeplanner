import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "@phosphor-icons/react"
import { cva, type VariantProps } from "class-variance-authority"

interface SheetContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SheetContext = React.createContext<SheetContextValue>({
  open: false,
  onOpenChange: () => {},
})

interface SheetProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

function Sheet({ open = false, onOpenChange, children }: SheetProps) {
  const value = React.useMemo(
    () => ({ open, onOpenChange: onOpenChange ?? (() => {}) }),
    [open, onOpenChange]
  )
  return <SheetContext.Provider value={value}>{children}</SheetContext.Provider>
}

function SheetTrigger({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { onOpenChange } = React.useContext(SheetContext)
  return (
    <button onClick={() => onOpenChange(true)} {...props}>
      {children}
    </button>
  )
}

function SheetPortal({ children }: { children: React.ReactNode }) {
  const { open } = React.useContext(SheetContext)
  if (!open) return null
  return <>{children}</>
}

function SheetOverlay({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { onOpenChange } = React.useContext(SheetContext)
  return (
    <div
      className={cn("fixed inset-0 z-50 bg-text-primary/60 backdrop-blur-sm", className)}
      onClick={() => onOpenChange(false)}
      {...props}
    />
  )
}

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-bg-elevated shadow-lg transition-transform duration-300 ease-in-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b border-border",
        bottom: "inset-x-0 bottom-0 border-t border-border",
        left: "inset-y-0 left-0 h-full w-3/4 border-r border-border sm:max-w-sm",
        right: "inset-y-0 right-0 h-full border-l border-border",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

interface SheetContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ side = "right", className, children, ...props }, ref) => {
    const { onOpenChange } = React.useContext(SheetContext)

    React.useEffect(() => {
      function onKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape") onOpenChange(false)
      }
      document.addEventListener("keydown", onKeyDown)
      document.body.style.overflow = "hidden"
      return () => {
        document.removeEventListener("keydown", onKeyDown)
        document.body.style.overflow = ""
      }
    }, [onOpenChange])

    return (
      <SheetPortal>
        <SheetOverlay />
        <div
          ref={ref}
          className={cn(
            sheetVariants({ side }),
            "w-full md:w-[480px]",
            className
          )}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          <button
            className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none cursor-pointer z-10"
            onClick={() => onOpenChange(false)}
          >
            <X size={16} />
            <span className="sr-only">Fechar</span>
          </button>
          {children}
        </div>
      </SheetPortal>
    )
  }
)
SheetContent.displayName = "SheetContent"

function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-2 text-left", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("text-lg font-semibold text-text-primary", className)}
      {...props}
    />
  )
}

function SheetDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-text-secondary", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
