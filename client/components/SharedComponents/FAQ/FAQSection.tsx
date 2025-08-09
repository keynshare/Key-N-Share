"use client";

import React, { useState } from 'react';
import Accordion from './Accordion';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  
  faqs: FAQItem[];
  className?: string;
}

const FAQSection: React.FC<FAQSectionProps> = ({ 
  title = "Frequently Asked Questions",
 
  faqs,
  className = ""
}) => {
  const [openAccordion, setOpenAccordion] = useState<string | null>(faqs[0]?.id || null);

  const handleToggle = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <section className={`py-16 px-4 ${className}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-xl md:text-3xl lg:text-[42px] font-bold font-bricola  mb-4">
            Frequently Asked Questions
          </h2>
        
        </div>

        {/* FAQ Accordions */}
      
          <div className="space-y-0 flex flex-col gap-5">
            {faqs.map((faq) => (
              <Accordion
                key={faq.id}
                question={faq.question}
                answer={faq.answer}
                isOpen={openAccordion === faq.id}
                onToggle={() => handleToggle(faq.id)}
              />
            ))}
          </div>
       
      </div>
    </section>
  );
};

export default FAQSection;