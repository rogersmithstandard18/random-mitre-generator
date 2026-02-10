import {
  BookOpen,
  TrendingUp,
  Building,
  Filter,
  Shield,
  Route,
  Crosshair,
  LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  TrendingUp,
  Building,
  Filter,
  Shield,
  Route,
  Crosshair,
};

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  const IconComponent = iconMap[icon] || BookOpen;

  return (
    <div className="sales-feature-card">
      <div className="sales-feature-icon">
        <IconComponent size={24} />
      </div>
      <h3 className="sales-feature-title">{title}</h3>
      <p className="sales-feature-description">{description}</p>
    </div>
  );
}
