'use client';

import { Button } from '@/components/ui/button';

interface SubscriptionPlansProps {
  userId: string;
}

export function SubscriptionPlans({ userId }: SubscriptionPlansProps) {
  const handleSubscribe = async (priceId: string) => {
    try {
      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId, userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create subscription');
      }

      window.location.href = data.url;
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to start subscription');
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Monthly Plan */}
      <div className="rounded-lg border p-6 space-y-4">
        <h2 className="text-xl font-heading">Monthly Plan</h2>
        <p className="text-3xl font-bold">$9.9 <span className="text-sm text-muted-foreground">/month</span></p>
        <ul className="space-y-2">
          <li>• 150 credits monthly</li>
          <li>• All creative spaces</li>
          <li>• Priority support</li>
          <li>• Advanced features</li>
        </ul>
        <Button 
          className="w-full"
          onClick={() => handleSubscribe(process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!)}
        >
          Subscribe Now
        </Button>
      </div>

      {/* Annual Plan */}
      <div className="rounded-lg border p-6 space-y-4">
        <h2 className="text-xl font-heading">Annual Plan</h2>
        <p className="text-3xl font-bold">$99 <span className="text-sm text-muted-foreground">/year</span></p>
        <ul className="space-y-2">
          <li>• 1800 credits yearly</li>
          <li>• All creative spaces</li>
          <li>• Priority support</li>
          <li>• Advanced features</li>
          <li>• 15% discount</li>
        </ul>
        <Button 
          className="w-full"
          onClick={() => handleSubscribe(process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID!)}
        >
          Subscribe Now
        </Button>
      </div>
    </div>
  );
} 