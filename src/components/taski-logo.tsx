interface TaskiLogoProps {
  size?: number
  className?: string
  strokeColor?: string
  checkColor?: string
  /** Stroke width (default scales with size) */
  strokeWidth?: number
}

/**
 * Taski logo — calendar + check icon.
 * Uses currentColor by default so it adapts to parent text color.
 */
export function TaskiLogo({
  size = 32,
  className,
  strokeColor = 'currentColor',
  checkColor = 'currentColor',
  strokeWidth,
}: TaskiLogoProps) {
  const sw = strokeWidth ?? Math.max(1.5, size / 18)

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Calendar body */}
      <rect
        x="5"
        y="10"
        width="38"
        height="32"
        rx="6"
        stroke={strokeColor}
        strokeWidth={sw}
        fill="none"
      />
      {/* Top divider */}
      <line
        x1="5"
        y1="20"
        x2="43"
        y2="20"
        stroke={strokeColor}
        strokeWidth={sw}
        strokeLinecap="round"
      />
      {/* Left pin */}
      <line
        x1="16"
        y1="5"
        x2="16"
        y2="13"
        stroke={strokeColor}
        strokeWidth={sw}
        strokeLinecap="round"
      />
      {/* Right pin */}
      <line
        x1="32"
        y1="5"
        x2="32"
        y2="13"
        stroke={strokeColor}
        strokeWidth={sw}
        strokeLinecap="round"
      />
      {/* Checkmark inside */}
      <path
        d="M 15 30 L 21 36 L 33 24"
        stroke={checkColor}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

/**
 * Taski logo lockup: icon + wordmark horizontally.
 * Use in headers, branding sections.
 */
interface TaskiLockupProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  color?: string
}

export function TaskiLockup({ size = 'md', className, color }: TaskiLockupProps) {
  const config = {
    sm: { icon: 24, text: 'text-lg', gap: 'gap-2' },
    md: { icon: 32, text: 'text-2xl', gap: 'gap-2.5' },
    lg: { icon: 44, text: 'text-4xl', gap: 'gap-3.5' },
  }[size]

  return (
    <div
      className={`flex items-center ${config.gap} ${className ?? ''}`}
      style={color ? { color } : undefined}
    >
      <TaskiLogo size={config.icon} />
      <span
        className={`${config.text} font-semibold tracking-tight`}
        style={{ letterSpacing: '-0.03em' }}
      >
        Taski
      </span>
    </div>
  )
}
