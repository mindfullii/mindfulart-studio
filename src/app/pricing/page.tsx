'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Free Soul',
      price: 0,
      features: [
        '10 credits per month',
        'Basic art styles',
        'Community support',
      ],
    },
    {
      name: 'Peaceful Mind',
      price: isAnnual ? 99 : 9.9,
      features: [
        '150 credits per month',
        'All art styles',
        'Priority support',
        'Commercial usage',
      ],
      popular: true,
    },
  ];

  return (
    <div className="py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-heading mb-4">Choose Your Plan</h1>
        <p className="text-text-secondary max-w-2xl mx-auto">
          Unlock unlimited AI art creation with our flexible plans
        </p>

        <div className="flex items-center justify-center mt-8 gap-4">
          <span className={isAnnual ? 'text-text-secondary' : 'text-primary'}>Monthly</span>
          <button
            className="relative w-12 h-6 rounded-full bg-primary/10"
            onClick={() => setIsAnnual(!isAnnual)}
          >
            <div
              className={`absolute top-1 w-4 h-4 rounded-full bg-primary transition-all ${
                isAnnual ? 'left-7' : 'left-1'
              }`}
            />
          </button>
          <span className={isAnnual ? 'text-primary' : 'text-text-secondary'}>
            Annual <span className="text-sm text-primary">Save 20%</span>
          </span>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-lg shadow-sm p-8 relative ${
                plan.popular ? 'border-2 border-primary' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-heading mb-4">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-text-secondary">/month</span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <svg
                      className="w-5 h-5 text-primary mr-2"
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

              <Button className="w-full">
                {plan.price === 0 ? 'Get Started' : 'Subscribe Now'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 