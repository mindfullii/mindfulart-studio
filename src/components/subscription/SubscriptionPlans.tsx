'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CheckIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface SubscriptionPlansProps {
  userId: string;
}

export function SubscriptionPlans({ userId }: SubscriptionPlansProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubscribe = async (priceId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId, userId }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Monthly Plan */}
      <Card className="p-8 hover:border-primary/30 transition-all hover:shadow-md bg-card">
        <div className="flex flex-col h-full">
          <div className="mb-8">
            <h3 className="font-heading text-2xl mb-3">Monthly Plan</h3>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-4xl">$9.9</span>
              <span className="font-mono text-text-secondary text-sm">/month</span>
            </div>
          </div>

          <div className="space-y-4 mb-8 flex-grow">
            <div className="flex items-center gap-3">
              <CheckIcon className="w-5 h-5 text-primary/80" />
              <span className="font-body text-text-secondary">150 credits monthly</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckIcon className="w-5 h-5 text-primary/80" />
              <span className="font-body text-text-secondary">All creative spaces</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckIcon className="w-5 h-5 text-primary/80" />
              <span className="font-body text-text-secondary">Priority support</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckIcon className="w-5 h-5 text-primary/80" />
              <span className="font-body text-text-secondary">Advanced features</span>
            </div>
          </div>

          <Button
            onClick={() => handleSubscribe(process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!)}
            disabled={isLoading}
            className="w-full font-mono bg-primary/90 text-white hover:bg-primary"
            size="lg"
          >
            Subscribe Now
          </Button>
        </div>
      </Card>

      {/* Annual Plan */}
      <Card className="p-8 border-primary/30 bg-card relative">
        <div className="absolute -top-3 right-8">
          <span className="bg-primary/90 text-white text-xs font-mono px-4 py-1 rounded-full shadow-sm">
            Best Value
          </span>
        </div>
        <div className="flex flex-col h-full">
          <div className="mb-8">
            <h3 className="font-heading text-2xl mb-3">Annual Plan</h3>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-4xl">$99</span>
              <span className="font-mono text-text-secondary text-sm">/year</span>
            </div>
          </div>

          <div className="space-y-4 mb-8 flex-grow">
            <div className="flex items-center gap-3">
              <CheckIcon className="w-5 h-5 text-primary/80" />
              <span className="font-body text-text-secondary">1800 credits yearly</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckIcon className="w-5 h-5 text-primary/80" />
              <span className="font-body text-text-secondary">All creative spaces</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckIcon className="w-5 h-5 text-primary/80" />
              <span className="font-body text-text-secondary">Priority support</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckIcon className="w-5 h-5 text-primary/80" />
              <span className="font-body text-text-secondary">Advanced features</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckIcon className="w-5 h-5 text-primary/80" />
              <span className="font-body text-text-secondary">15% discount</span>
            </div>
          </div>

          <Button
            onClick={() => handleSubscribe(process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID!)}
            disabled={isLoading}
            className="w-full font-mono bg-primary/90 text-white hover:bg-primary"
            size="lg"
          >
            Subscribe Now
          </Button>
        </div>
      </Card>
    </div>
  );
} 