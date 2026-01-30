export type SectionBackground = 'white' | 'gray' | 'dark';

export interface SalesSectionProps {
  id?: string;
  background?: SectionBackground;
  className?: string;
  children: React.ReactNode;
}

export function SalesSection({
  id,
  background = 'white',
  className = '',
  children,
}: SalesSectionProps) {
  const baseClass = 'sales-section';
  const bgClass = `sales-section-${background}`;

  const combinedClassName = [baseClass, bgClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <section id={id} className={combinedClassName}>
      <div className="sales-section-inner">{children}</div>
    </section>
  );
}
