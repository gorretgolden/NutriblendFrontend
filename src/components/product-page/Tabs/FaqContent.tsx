import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FaqItem = {
  question: string;
  answer: string;
};

const faqsData: FaqItem[] = [
  {
    question: "Are the products on NutriBlend Haven authentic and safe?",
    answer:
      "Yes. Every product we carry is sourced directly from verified manufacturers and authorised distributors. We carry out quality checks before listing any item. If you have concerns about a specific product, contact our support team.",
  },
  {
    question: "How should I store my supplements?",
    answer:
      "Most supplements should be stored in a cool, dry place away from direct sunlight and moisture. Check the product label for specific storage instructions — some items such as probiotics may require refrigeration.",
  },
  {
    question: "Can I take multiple supplements at the same time?",
    answer:
      "While many supplements can be combined safely, we recommend consulting a qualified healthcare professional before starting any new supplement regimen, especially if you are on medication or have an existing health condition.",
  },
  {
    question: "What is your delivery policy?",
    answer:
      "We deliver across Uganda. Delivery fees vary by town and are calculated at checkout. Orders placed before 12 PM are typically dispatched the same business day. You will receive updates via SMS/email once your order is on the way.",
  },
  {
    question: "What is your returns and refund policy?",
    answer:
      "We accept returns within 7 days of delivery for sealed, unopened products in their original condition. Perishable items and opened supplements are not eligible for return. Contact our support team to initiate a return.",
  },
  {
    question: "How do I apply for a wholesale account?",
    answer:
      "Visit the Wholesale Registration page and fill in your business details. Our team reviews applications within 1–2 business days. Once approved, you'll have access to wholesale pricing on qualifying products.",
  },
];

const FaqContent = () => {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 text-center sm:text-left">
        Frequently Asked Questions
      </h3>
      <div className="max-w-4xl">
        <Accordion type="single" collapsible className="space-y-4">
          {faqsData.map((faq, idx) => (
            <AccordionItem 
              key={idx} 
              value={`item-${idx + 1}`}
              className="border border-gray-100 rounded-xl px-5 bg-gray-50/50 overflow-hidden"
            >
              <AccordionTrigger className="text-left font-semibold text-gray-800 py-4 hover:text-[#009E3C] hover:no-underline transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed pb-5 pt-1">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FaqContent;
