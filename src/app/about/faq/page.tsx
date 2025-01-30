import { Container } from '@/components/ui/Container';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";

export default function FAQPage() {
  const faqs = [
    {
      category: 'General',
      questions: [
        {
          question: 'What is MindfulArt Studio?',
          answer: 'MindfulArt Studio is an AI-powered platform that combines art creation with mindfulness practices. We provide tools and spaces for creating various forms of art while maintaining a mindful approach to creativity.'
        },
        {
          question: 'How do I get started?',
          answer: 'You can start by signing up for a free account, which gives you initial credits to explore our creative spaces. Browse through our galleries, try out different art creation tools, and join our community of mindful artists.'
        },
        {
          question: "Do I need to be an experienced artist?",
          answer: "Not at all! MindfulArt Studio welcomes creators of all skill levels. Our platform is designed to be intuitive and accessible, whether you're a beginner or an experienced artist."
        }
      ]
    },
    {
      category: 'Membership & Pricing',
      questions: [
        {
          question: 'What are credits and how do they work?',
          answer: "Credits are our platform's currency for creating art. Each creation consumes a certain number of credits, and you can earn credits through various activities or purchase them directly."
        },
        {
          question: 'What are the benefits of a subscription?',
          answer: 'Subscribers receive monthly credits, access to all creative spaces, priority support, and advanced features. Our subscription plans are designed to provide the best value for regular users.'
        },
        {
          question: 'Can I cancel my subscription anytime?',
          answer: 'Yes, you can cancel your subscription at any time. Your benefits will continue until the end of your current billing period.'
        }
      ]
    },
    {
      category: 'Creating Art',
      questions: [
        {
          question: 'What types of art can I create?',
          answer: 'We offer various creative spaces including AI-powered vision boards, mindful coloring pages, and meditation-inspired art. Each space offers unique tools and features for different artistic expressions.'
        },
        {
          question: 'Can I download my creations?',
          answer: 'Yes, all your creations can be downloaded in high quality formats. Premium members have access to additional download options and formats.'
        },
        {
          question: 'How do I share my artwork?',
          answer: 'You can share your artwork directly from the platform to social media, or download and share them manually. We also have a community gallery where you can showcase your work.'
        }
      ]
    },
    {
      category: 'Technical Support',
      questions: [
        {
          question: 'What browsers are supported?',
          answer: 'We support all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of your preferred browser.'
        },
        {
          question: 'How do I report a technical issue?',
          answer: "You can report technical issues through our contact form or by emailing support@mindfulart.studio. Please include as much detail as possible about the issue you're experiencing."
        },
        {
          question: 'Is my data secure?',
          answer: 'Yes, we take data security seriously. All your personal information and artwork are protected using industry-standard encryption and security practices.'
        }
      ]
    }
  ];

  return (
    <main className="py-12">
      <Container>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-heading mb-6">Frequently Asked Questions</h1>
          <p className="text-lg text-text-secondary mb-12">
            Find answers to common questions about MindfulArt Studio. Can't find what you're looking for? 
            Feel free to contact us.
          </p>

          <div className="space-y-12">
            {faqs.map((category, index) => (
              <div key={index}>
                <h2 className="text-2xl font-heading mb-6">{category.category}</h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {category.questions.map((faq, faqIndex) => (
                    <AccordionItem 
                      key={faqIndex} 
                      value={`${index}-${faqIndex}`}
                      className="bg-card rounded-lg border border-border"
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
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-text-secondary mb-4">
              Still have questions? We're here to help!
            </p>
            <a
              href="/about/contact"
              className="text-primary hover:text-primary/80 font-medium"
            >
              Contact our support team →
            </a>
          </div>
        </div>
      </Container>
    </main>
  );
} 
