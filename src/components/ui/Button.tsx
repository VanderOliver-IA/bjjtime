import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  ...buttonProps
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={[
        'button',
        `button--${variant}`,
        `button--${size}`,
        fullWidth ? 'button--full' : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      {...buttonProps}
    >
      {children}
    </button>
  )
}
