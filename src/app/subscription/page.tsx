'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BuyCreditsModal } from '@/components/subscription/BuyCreditsModal';
import { CancelSubscriptionModal } from '@/components/subscription/CancelSubscriptionModal';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/Spinner';
import type { Subscription } from '@/types/subscription';

const SUBSCRIPTION_PLANS = {
  monthly: {
    id: 'monthly',
    name: 'Monthly Plan',
    price: 9.9,
    period: 'month',
    features: [
      '150 credits monthly',
      'All creative spaces',
      'Priority support',
      'Advanced features'
    ]
  },
  annual: {
    id: 'annual',
    name: 'Annual Plan',
    price: 99,
    period: 'year',
    features: [
      '1800 credits yearly',
      'All creative spaces',
      'Priority support',
      'Advanced features',
      '15% discount'
    ]
  }
};

export default function SubscriptionPage() {
  const { data: session } = useSession();
  const [showBuyCreditsModal, setShowBuyCreditsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // TODO: 从 API 获取用户当前订阅状态
  const currentPlan = subscription?.plan || null;

  const fetchSubscription = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/subscription');
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      toast.error('Failed to fetch subscription status');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  // 处理支付结果
  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');

    if (success) {
      toast.success('Subscription successful!');
      // 刷新订阅状态
      fetchSubscription();
      router.replace('/subscription');
    }

    if (canceled) {
      toast.info('Subscription canceled.');
      router.replace('/subscription');
    }
  }, [searchParams, router]);

  const handleBuyCredits = async (credits: number) => {
    try {
      const response = await fetch('/api/credits/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credits }),
      });

      if (!response.ok) throw new Error('Failed to purchase credits');
      setShowBuyCreditsModal(false);
    } catch (error) {
      console.error('Error purchasing credits:', error);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      // 更新本地状态
      setSubscription(prev => ({ ...prev, status: 'cancelled' }));
      setShowCancelModal(false);
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    }
  };

  const handleSubscribe = async (planType: 'monthly' | 'annual') => {
    try {
      setIsLoading(true);
      const stripePriceId = planType === 'monthly' 
        ? process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID 
        : process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID;

      if (!stripePriceId) {
        console.error('Missing Stripe price ID');
        return;
      }

      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: stripePriceId }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create subscription');
      }
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create subscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <div className="py-12">
        <h1 className="text-3xl font-heading mb-8">Subscription</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Spinner className="h-8 w-8" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Monthly Plan */}
              <Card className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-heading mb-2">{SUBSCRIPTION_PLANS.monthly.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-heading">
                      ${SUBSCRIPTION_PLANS.monthly.price}
                    </span>
                    <span className="text-text-secondary font-body">
                      /month
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {SUBSCRIPTION_PLANS.monthly.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 font-body text-text-secondary">
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full"
                  variant={currentPlan === 'monthly' ? 'secondary' : 'default'}
                  disabled={currentPlan === 'monthly' || isLoading}
                  onClick={() => currentPlan !== 'monthly' && handleSubscribe('monthly')}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Spinner className="h-4 w-4" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    currentPlan === 'monthly' ? 'Active' : 'Subscribe Now'
                  )}
                </Button>
              </Card>

              {/* Annual Plan */}
              <Card className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-heading mb-2">{SUBSCRIPTION_PLANS.annual.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-heading">
                      ${SUBSCRIPTION_PLANS.annual.price}
                    </span>
                    <span className="text-text-secondary font-body">
                      /year
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {SUBSCRIPTION_PLANS.annual.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 font-body text-text-secondary">
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full"
                  variant={currentPlan === 'annual' ? 'secondary' : 'default'}
                  disabled={currentPlan === 'annual' || isLoading}
                  onClick={() => currentPlan !== 'annual' && handleSubscribe('annual')}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Spinner className="h-4 w-4" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    currentPlan === 'annual' ? 'Active' : 'Subscribe Now'
                  )}
                </Button>
              </Card>

              {/* Buy Additional Credits */}
              <Card className="p-6">
                <h2 className="text-xl font-heading mb-6">Buy Additional Credits</h2>
                <p className="text-text-secondary font-body mb-4">
                  Need more credits? Purchase additional credits to continue creating.
                </p>
                <Button 
                  className="w-full mt-auto"
                  onClick={() => setShowBuyCreditsModal(true)}
                >
                  Buy Credits
                </Button>
              </Card>
            </div>

            {/* Billing & Payment Section */}
            <div className="mt-8">
              <Card className="p-6">
                <h2 className="text-xl font-heading mb-6">Billing & Payment</h2>
                {subscription ? (
                  <>
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-text-secondary font-body">Billing period</span>
                        <span className="font-body capitalize">{subscription.billingCycle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary font-body">Next renewal</span>
                        <span className="font-body">
                          {subscription.endDate 
                            ? new Date(subscription.endDate).toLocaleDateString()
                            : 'Auto-renews'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary font-body">Status</span>
                        <span className="font-body capitalize">{subscription.status}</span>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => window.open('https://billing.stripe.com/p/login/test', '_blank')}
                      >
                        View Invoices
                      </Button>
                      {subscription.status === 'active' && (
                        <Button 
                          variant="outline" 
                          className="flex-1 text-red-500 hover:bg-red-50"
                          onClick={() => setShowCancelModal(true)}
                        >
                          Cancel Subscription
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-text-secondary font-body">
                    No active subscription found. Subscribe to a plan to get started.
                  </p>
                )}
              </Card>
            </div>
          </>
        )}
      </div>

      <BuyCreditsModal 
        isOpen={showBuyCreditsModal}
        onClose={() => setShowBuyCreditsModal(false)}
        onSelect={handleBuyCredits}
      />

      <CancelSubscriptionModal 
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelSubscription}
      />
    </Container>
  );
} 