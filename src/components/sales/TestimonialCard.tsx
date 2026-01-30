import { Quote } from 'lucide-react';

export interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export function TestimonialCard({
  quote,
  author,
  role,
  company,
}: TestimonialCardProps) {
  return (
    <div className="sales-testimonial-card">
      <Quote className="sales-testimonial-quote-icon" size={32} />
      <blockquote className="sales-testimonial-quote">{quote}</blockquote>
      <div className="sales-testimonial-author">
        <span className="sales-testimonial-name">{author}</span>
        <span className="sales-testimonial-role">
          {role}, {company}
        </span>
      </div>
    </div>
  );
}
