import { salesPageCopy } from '../../constants/salesPageCopy';
import { SalesSection } from './shared';
import { TestimonialCard } from './TestimonialCard';

export function TestimonialsSection() {
  const { testimonials } = salesPageCopy;

  return (
    <SalesSection background="white">
      <h2 className="sales-section-title">{testimonials.headline}</h2>
      <div className="sales-grid-3">
        {testimonials.items.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            quote={testimonial.quote}
            author={testimonial.author}
            role={testimonial.role}
            company={testimonial.company}
          />
        ))}
      </div>
    </SalesSection>
  );
}
