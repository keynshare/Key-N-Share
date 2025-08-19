"use client";

import React, { useState, useEffect, useRef } from 'react';
import Accordion from './Accordion';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
  className?: string;
}

const FAQSection: React.FC<FAQSectionProps> = ({ 
  faqs,
  className = ""
}) => {
  const [openAccordion, setOpenAccordion] = useState<string | null>(faqs[0]?.id || null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

 
  useEffect(() => {
    const currentRef = sectionRef.current
    if (!currentRef) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      {
        threshold: 0.2, 
        rootMargin: '0px'
      }
    )

    observer.observe(currentRef)

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  const handleToggle = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <section ref={sectionRef} className={`py-16 px-4 ${className}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-12 transform transition-all duration-1000 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <h2 className="text-xl md:text-3xl lg:text-[42px] font-bold font-bricola  mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ Accordions */}
        <div className="space-y-0 flex flex-col gap-5">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className={`transform transition-all duration-800 ease-out ${
                isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'
              }`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              <Accordion
                question={faq.question}
                answer={faq.answer}
                isOpen={openAccordion === faq.id}
                onToggle={() => handleToggle(faq.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;