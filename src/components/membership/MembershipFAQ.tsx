import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";

const faqs = [
  {
    question: "How do I use my free creations?",
    answer: "After signing up, you'll receive 10 creation credits. Simply choose any tool and start creating - each generation uses one credit."
  },
  {
    question: "What happens when I run out of free creations?",
    answer: "You can continue exploring your gallery and downloading your creations. To create more, simply choose a subscription that suits you."
  },
  {
    question: "Can I change or cancel my subscription?",
    answer: "Yes, you can change or cancel your subscription at any time. Your benefits will continue until the end of your billing period."
  },
  {
    question: "What's included in the subscription?",
    answer: "Your subscription includes monthly credits for creations, access to all creative tools, priority support, and advanced features. Annual subscribers get additional benefits and savings."
  }
];

export function MembershipFAQ() {
  return (
    <Accordion type="single" collapsible className="space-y-4">
      {faqs.map((faq, index) => (
        <AccordionItem 
          key={index} 
          value={`faq-${index}`}
          className="bg-white rounded-xl border border-border"
        >
          <AccordionTrigger className="px-6 text-left">
            <h3 className="text-lg font-medium">{faq.question}</h3>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <p className="text-text-secondary">{faq.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
} 
