import { useState, forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { Eye, EyeSlash } from '@phosphor-icons/react'

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  fieldClassName?: string
}

export const PasswordInput = forwardRef<HTMLInputElement, Props>(
  function PasswordInput({ fieldClassName, className, ...rest }, ref) {
    const [visible, setVisible] = useState(false)
    const base =
      'w-full h-11 pl-3.5 pr-11 text-sm text-text-primary placeholder:text-text-muted border border-border rounded-lg outline-none transition-colors focus:border-accent'
    return (
      <div className="relative">
        <input
          {...rest}
          ref={ref}
          type={visible ? 'text' : 'password'}
          className={`${base} ${fieldClassName ?? 'bg-bg-elevated'} ${className ?? ''}`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
          tabIndex={-1}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors cursor-pointer"
        >
          {visible ? <EyeSlash size={18} /> : <Eye size={18} />}
        </button>
      </div>
    )
  },
)
