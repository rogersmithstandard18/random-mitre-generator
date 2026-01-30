import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FAQItemProps {
  question: string;
  answer: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function FAQItem({
  question,
  answer,
  isOpen = false,
  onToggle,
}: FAQItemProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = onToggle !== undefined;
  const open = isControlled ? isOpen : internalOpen;

  const handleToggle = () => {
    if (isControlled) {
      onToggle?.();
    } else {
      setInternalOpen(!internalOpen);
    }
  };

  return (
    <div className={`sales-faq-item ${open ? 'sales-faq-item-open' : ''}`}>
      <button
        type="button"
        className="sales-faq-question"
        onClick={handleToggle}
        aria-expanded={open}
      >
        <span>{question}</span>
        <ChevronDown
          size={20}
          className={`sales-faq-chevron ${open ? 'open' : ''}`}
        />
      </button>
      <div className={`sales-faq-answer ${open ? 'open' : ''}`}>
        <p>{answer}</p>
      </div>
    </div>
  );
}
