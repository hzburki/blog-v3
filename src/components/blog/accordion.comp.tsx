import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AccordionProps {
  heading: string;
  children: React.ReactNode;
}

export const Accordion: React.FC<AccordionProps> = ({ heading, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`my-4 mb-4 flex ${isOpen ? "flex-col" : "flex-row"} rounded-md border p-4 shadow-sm transition-all duration-300 ease-in-out`}
    >
      <div className="flex cursor-pointer items-center" onClick={toggleOpen}>
        {isOpen ? <ChevronUp /> : <ChevronDown />}
        <h3 className="ml-2 mt-0 font-semibold">{heading}</h3>
      </div>
      <div
        className={`mt-2 overflow-hidden transition-all duration-300 ${isOpen ? "max-h-screen" : "max-h-0"}`}
      >
        {isOpen && children}
      </div>
    </div>
  );
};
