"use client";

import { ChevronDown, ChevronUp } from "lucide-react";

interface AccordionProps {
  question: string;
  answer: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

const Accordion: React.FC<AccordionProps> = ({
  question,
  answer,
  isOpen = false,
  onToggle,
}) => {
  return (
    <div className=" rounded-xl border border-gray-200 shadow-lg transition-all bg-white">
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 text-left focus:outline-none focus:ring-0 group"
        aria-expanded={isOpen}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
          <span className="lg:text-lg bg-[linear-gradient(105deg,#1070FF_0%,#BA8CFF_17%,rgba(167,108,255,0.80)_30%,#FFBEE6_40%,#FF9C4B_75%,#FFC18E_83%,#FF7A00_100%)] bg-clip-text text-transparent">✦</span>
            <h3 className="font-bold lg:text-lg lg:font-semibold text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
              {question}
            </h3>
          </div>
          <div className="ml-4 flex-shrink-0">
            {isOpen ? (
              <ChevronUp className="h-5 w-5 text-gray-500 transition-transform duration-200" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500 transition-transform duration-200" />
            )}
          </div>
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6 pt-0">
          <p className="text-gray-600 text-sm lg:text-base leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
};

export default Accordion;
