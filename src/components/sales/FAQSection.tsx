import { useState } from 'react';
import { salesPageCopy } from '../../constants/salesPageCopy';
import { SalesSection } from './shared';
import { FAQItem } from './FAQItem';

export function FAQSection() {
  const { faq } = salesPageCopy;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <SalesSection id="faq" background="white">
      <h2 className="sales-section-title">{faq.headline}</h2>
      <div className="sales-faq-list">
        {faq.items.map((item, index) => (
          <FAQItem
            key={index}
            question={item.question}
            answer={item.answer}
            isOpen={openIndex === index}
            onToggle={() => handleToggle(index)}
          />
        ))}
      </div>
    </SalesSection>
  );
}
