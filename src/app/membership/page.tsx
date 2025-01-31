import { MembershipHeader } from '@/components/membership/MembershipHeader';
import { FeatureCard } from '@/components/membership/FeatureCard';
import { PricingCard } from '@/components/membership/PricingCard';
import { MembershipFAQ } from '@/components/membership/MembershipFAQ';

const features = [
  {
    title: 'Mindful Coloring Pages',
    description: 'Create personalized coloring pages with our AI-powered system',
    imagePath: '/images/features/coloring.jpg'
  },
  {
    title: 'Visual Meditations',
    description: 'Generate calming visuals to enhance your meditation practice',
    imagePath: '/images/features/meditation.jpg'
  },
  {
    title: 'Art Journaling',
    description: 'Express yourself through AI-assisted art journaling tools',
    imagePath: '/images/features/vision.jpg'
  }
];

const plans = [
  {
    type: 'monthly' as const,
    label: 'Monthly',
    price: '$12',
    perMonth: 'per month',
    ctaText: 'Start free trial'
  },
  {
    type: 'annual' as const,
    label: 'Annual',
    price: '$8',
    perMonth: 'per month, billed annually',
    isBestValue: true,
    ctaText: 'Start free trial'
  },
  {
    type: 'enterprise' as const,
    label: 'Enterprise',
    description: 'Custom solutions for teams and organizations',
    ctaText: 'Contact sales'
  }
];

export default function MembershipPage() {
  return (
    <main>
      <MembershipHeader />

      {/* Creation Tools Section */}
      <section className="w-full bg-gray-50 py-24">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-[1.8em] font-heading text-text-primary text-center mb-20">What you can create</h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full bg-white py-24">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-[1.8em] font-heading text-text-primary">Need more creations?</h2>
            <p className="text-base font-body text-text-secondary">
              A mindful art journey starts here. Choose your plan and begin creating
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {plans.map((plan, index) => (
              <PricingCard
                key={index}
                {...plan}
              />
            ))}
          </div>

          <div className="mt-8 text-center space-y-6">
            <p className="text-sm font-body text-text-secondary">
              After your free trial, the subscription automatically renews. Cancel anytime.
            </p>

            <div className="flex items-center justify-center gap-4 text-sm font-body text-text-secondary">
              <a href="/terms" className="hover:text-text-primary">Terms & conditions</a>
              <span>•</span>
              <a href="/faq" className="hover:text-text-primary">Cancel anytime</a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full bg-gray-50 py-24">
        <div className="max-w-3xl mx-auto px-8">
          <h2 className="text-[1.8em] font-heading text-text-primary text-center mb-16">
            Frequently Asked Questions
          </h2>
          <MembershipFAQ />
        </div>
      </section>
    </main>
  );
} 