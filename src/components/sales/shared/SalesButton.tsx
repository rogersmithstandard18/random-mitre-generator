import { Link } from 'react-router-dom';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface SalesButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  to?: string;
  onClick?: () => void;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

export function SalesButton({
  children,
  variant = 'primary',
  size = 'md',
  href,
  to,
  onClick,
  fullWidth = false,
  disabled = false,
  className = '',
}: SalesButtonProps) {
  const baseClass = 'sales-btn';
  const variantClass = `sales-btn-${variant}`;
  const sizeClass = `sales-btn-${size}`;
  const widthClass = fullWidth ? 'sales-btn-full' : '';
  const disabledClass = disabled ? 'sales-btn-disabled' : '';

  const combinedClassName = [
    baseClass,
    variantClass,
    sizeClass,
    widthClass,
    disabledClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // External link
  if (href) {
    return (
      <a
        href={href}
        className={combinedClassName}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  // Internal navigation
  if (to) {
    return (
      <Link to={to} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  // Button
  return (
    <button
      type="button"
      className={combinedClassName}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
