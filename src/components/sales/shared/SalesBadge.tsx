export type BadgeVariant = 'primary' | 'success' | 'warning';

export interface SalesBadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function SalesBadge({
  variant = 'primary',
  children,
  className = '',
}: SalesBadgeProps) {
  const baseClass = 'sales-badge';
  const variantClass = `sales-badge-${variant}`;

  const combinedClassName = [baseClass, variantClass, className]
    .filter(Boolean)
    .join(' ');

  return <span className={combinedClassName}>{children}</span>;
}
