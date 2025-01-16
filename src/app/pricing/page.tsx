'use client';

import { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');
  
  const price = billingCycle === 'monthly' ? 9.9 : 99;
  const savings = billingCycle === 'annually' ? 20 : 0;

  return (
    <Container>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif mb-4">Choose Your Plan</h1>
        <p className="text-text-secondary">Start your creative journey today</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Free Soul Plan */}
        <Card className="p-8">
          <h2 className="text-2xl font-medium mb-2">Free Soul</h2>
          <p className="text-text-secondary mb-6">Perfect for getting started</p>
          <div className="text-3xl font-medium mb-6">$0</div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center">
              <CheckIcon className="w-5 h-5 text-primary mr-2" />
              <span>10 creation credits to start</span>
            </li>
            <li className="flex items-center">
              <CheckIcon className="w-5 h-5 text-primary mr-2" />
              <span>Commercial License</span>
            </li>
          </ul>
          <Link href="/auth/signup?plan=free">
            <Button 
              variant="outline" 
              className="w-full"
            >
              Create Account
            </Button>
          </Link>
        </Card>

        {/* Peaceful Mind Plan */}
        <Card className="p-8 border-primary">
          <h2 className="text-2xl font-medium mb-2">Peaceful Mind</h2>
          <p className="text-text-secondary mb-6">For serious creators</p>
          
          {/* 计费周期选择器 */}
          <div className="flex justify-center gap-2 mb-6 p-1 bg-gray-50 rounded-lg">
            <button
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-white shadow text-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                billingCycle === 'annually'
                  ? 'bg-white shadow text-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
              onClick={() => setBillingCycle('annually')}
            >
              Annually
              {savings > 0 && (
                <span className="ml-2 text-xs px-2 py-0.5 bg-green-50 text-green-600 rounded-full">
                  Save {savings}%
                </span>
              )}
            </button>
          </div>

          <div className="text-3xl font-medium mb-6">
            ${price}/{billingCycle === 'monthly' ? 'month' : 'year'}
          </div>
          
          <ul className="space-y-3 mb-8">
            <li className="flex items-center">
              <CheckIcon className="w-5 h-5 text-primary mr-2" />
              <span>150 credits monthly</span>
            </li>
            <li className="flex items-center">
              <CheckIcon className="w-5 h-5 text-primary mr-2" />
              <span>All creative spaces</span>
            </li>
            <li className="flex items-center">
              <CheckIcon className="w-5 h-5 text-primary mr-2" />
              <span>Save creation history</span>
            </li>
            <li className="flex items-center">
              <CheckIcon className="w-5 h-5 text-primary mr-2" />
              <span>Download in high resolution</span>
            </li>
          </ul>

          <Link href={`/auth/signup?plan=pro&billing=${billingCycle}`}>
            <Button className="w-full">
              Start Free Trial
            </Button>
          </Link>
        </Card>
      </div>
    </Container>
  );
} 