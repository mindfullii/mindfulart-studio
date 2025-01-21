import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';

export default function MembershipPage() {
  return (
    <main>
      {/* Hero Section */}
      <div className="relative h-[400px] bg-gray-50">
        <Container className="h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-heading mb-6">
              Join Our Creative Community
            </h1>
            <p className="text-lg text-text-secondary mb-8">
              Unlock exclusive benefits and join a community of mindful artists
            </p>
            <Button asChild size="lg">
              <Link href="#plans">View Membership Plans</Link>
            </Button>
          </div>
        </Container>
      </div>

      {/* Benefits Section */}
      <Container className="py-16">
        <h2 className="text-3xl font-heading mb-12 text-center">Member Benefits</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: 'Unlimited AI Art Generation',
              description: 'Create unlimited AI-powered artworks with our advanced tools.',
              icon: '/icons/ai.svg'
            },
            {
              title: 'Premium Resources',
              description: 'Access our library of premium mindfulness resources and tutorials.',
              icon: '/icons/resources.svg'
            },
            {
              title: 'Community Access',
              description: 'Join our exclusive community of mindful artists.',
              icon: '/icons/community.svg'
            },
            {
              title: 'Priority Support',
              description: '24/7 priority support for all your creative needs.',
              icon: '/icons/support.svg'
            },
            {
              title: 'Early Access',
              description: 'Be the first to try new features and tools.',
              icon: '/icons/early-access.svg'
            },
            {
              title: 'Member Events',
              description: 'Participate in exclusive online events and workshops.',
              icon: '/icons/events.svg'
            }
          ].map((benefit, index) => (
            <div key={index} className="flex gap-4 p-6 bg-white rounded-lg shadow-sm">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src={benefit.icon}
                  alt={benefit.title}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl font-heading mb-2">{benefit.title}</h3>
                <p className="text-text-secondary">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* Pricing Plans */}
      <div className="bg-gray-50 py-16" id="plans">
        <Container>
          <h2 className="text-3xl font-heading mb-12 text-center">Choose Your Plan</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Basic',
                price: 'Free',
                features: [
                  '5 AI artworks per month',
                  'Basic mindfulness resources',
                  'Community access',
                  'Standard support'
                ]
              },
              {
                name: 'Pro',
                price: '$9.99/month',
                popular: true,
                features: [
                  'Unlimited AI artworks',
                  'Premium resources',
                  'Priority support',
                  'Member events access',
                  'Early access to new features'
                ]
              },
              {
                name: 'Team',
                price: '$29.99/month',
                features: [
                  'Everything in Pro',
                  'Up to 5 team members',
                  'Team collaboration tools',
                  'Custom branding',
                  'API access'
                ]
              }
            ].map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg p-8 ${
                  plan.popular ? 'ring-2 ring-primary relative' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-heading mb-2">{plan.name}</h3>
                <p className="text-3xl font-bold mb-6">{plan.price}</p>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-primary flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.popular ? 'default' : 'outline'}
                  className="w-full"
                  asChild
                >
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* FAQ Section */}
      <Container className="py-16">
        <h2 className="text-3xl font-heading mb-12 text-center">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {[
            {
              question: 'How does the AI art generation work?',
              answer: 'Our AI art generation tool uses advanced machine learning models to create unique artworks based on your input and preferences. You can control various parameters to achieve your desired results.'
            },
            {
              question: 'Can I cancel my subscription anytime?',
              answer: 'Yes, you can cancel your subscription at any time. Your benefits will continue until the end of your current billing period.'
            },
            {
              question: 'What payment methods do you accept?',
              answer: 'We accept all major credit cards, PayPal, and various local payment methods depending on your region.'
            },
            {
              question: 'Is there a free trial available?',
              answer: 'Yes, you can try our Basic plan for free, which includes 5 AI artworks per month and access to basic mindfulness resources.'
            }
          ].map((faq, index) => (
            <div key={index} className="bg-white p-6 rounded-lg">
              <h3 className="text-xl font-heading mb-3">{faq.question}</h3>
              <p className="text-text-secondary">{faq.answer}</p>
            </div>
          ))}
        </div>
      </Container>
    </main>
  );
} 