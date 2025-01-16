'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'sonner';

import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CreditHistory } from '@/components/credits/CreditHistory';
import { BuyCreditsModal } from '@/components/credits/BuyCreditsModal';
import { CancelSubscriptionModal } from '@/components/subscription/CancelSubscriptionModal';
import { SubscriptionModals } from '@/components/subscription/SubscriptionModals';
import { TransactionHistory } from '@/components/subscription/TransactionHistory';
import { logger } from '@/lib/logger';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function SubscriptionPage() {
  logger.debug('Rendering SubscriptionPage');
  
  const { data: session } = useSession();
  console.log('Current session:', session);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [credits, setCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchCredits();
  }, []);

  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');

    if (success) {
      toast.success('Credits purchased successfully!');
      fetchCredits();
      router.replace('/dashboard/subscription');
    }
    if (canceled) {
      toast.error('Credit purchase canceled.');
      router.replace('/dashboard/subscription');
    }
  }, [searchParams, router]);

  const fetchCredits = async () => {
    try {
      const response = await fetch('/api/user/credits');
      const data = await response.json();
      if (response.ok) {
        setCredits(data.credits);
      }
    } catch (error) {
      console.error('Failed to fetch credits:', error);
    }
  };

  const handleBuyCredits = async (amount: number) => {
    try {
      setIsLoading(true);
      console.log('Initiating purchase for amount:', amount);

      const response = await fetch('/api/credits/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();
      console.log('Purchase API response:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Failed to initiate credits purchase:', error);
      toast.error('Failed to initiate purchase');
    } finally {
      setIsLoading(false);
      setShowBuyModal(false);
    }
  };

  const handleCancelSubscription = useCallback(async () => {
    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to cancel subscription');
      }

      toast.success('Subscription canceled successfully!');
      router.replace('/dashboard/subscription');
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to cancel subscription');
    } finally {
      setShowCancelModal(false);
    }
  }, [router]);

  const loadMore = async () => {
    try {
      const response = await fetch('/api/transactions/history', {
        method: 'GET',
      });

      const data = await response.json();
      if (response.ok) {
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('Failed to load more transactions:', error);
    }
  };

  return (
    <Container>
      <div className="py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl mb-2">Manage Subscription</h1>
            <p className="font-body text-text-secondary">Manage your plan and credits</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="font-subheading text-xl mb-6">Usage Details</h2>
            <div className="space-y-4 font-body">
              <div className="flex justify-between">
                <span className="text-text-secondary">Remaining credits:</span>
                <span className="font-medium">{credits}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Monthly credits:</span>
                <span className="font-medium">150</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Next renewal:</span>
                <span className="font-medium">Feb 14, 2024</span>
              </div>
            </div>

            <Button 
              variant="outline"
              className="w-full mt-6 font-mono"
              onClick={() => setShowBuyModal(true)}
            >
              Buy additional credits
            </Button>

            <div className="mt-8">
              <h3 className="font-subheading font-medium mb-4">Recent Transactions</h3>
              <TransactionHistory />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-subheading text-xl mb-6">Subscription Management</h2>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium font-mono">Current Plan</span>
                <span className="text-primary font-mono">$9.9/month</span>
              </div>
              <p className="text-sm text-text-secondary font-body">
                Your next billing date is Feb 14, 2024
              </p>
            </div>

            <Button 
              variant="outline" 
              className="w-full font-mono"
              onClick={() => {
                console.log('Cancel subscription clicked');
                setShowCancelModal(true);
              }}
            >
              Cancel Subscription
            </Button>
            <p className="text-xs text-text-secondary text-center mt-2">
              You&apos;ll continue to have access until the end of your billing period
            </p>
          </Card>
        </div>

        <SubscriptionModals
          showCancelModal={showCancelModal}
          showBuyModal={showBuyModal}
          onCloseCancelModal={() => setShowCancelModal(false)}
          onCloseBuyModal={() => setShowBuyModal(false)}
          onConfirmCancel={handleCancelSubscription}
          onSelectBuyCredits={handleBuyCredits}
        />
      </div>
    </Container>
  );
} 