'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { SubscriptionPlans } from '@/components/subscription/SubscriptionPlans';
import { SubscriptionInfo } from '@/components/subscription/SubscriptionInfo';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/Spinner';
import { Subscription } from '@prisma/client';

export default function SubscriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscription = async () => {
    if (session?.user?.id) {
      try {
        const response = await fetch('/api/subscription', {
          cache: 'no-store',
        });
        
        if (response.ok) {
          const data = await response.json();
          setSubscription(data);
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Handle subscription success
    const success = searchParams.get('success');
    if (success === 'true') {
      toast.success('Subscription activated successfully!');
      // Remove the success parameter and refresh data
      router.replace('/subscription', { scroll: false });
      fetchSubscription();
    } else {
      fetchSubscription();
    }
  }, [searchParams, session?.user?.id]);

  if (status === 'loading' || isLoading) {
    return (
      <Container>
        <div className="flex justify-center items-center min-h-[400px]">
          <Spinner className="h-8 w-8" />
        </div>
      </Container>
    );
  }

  if (!session?.user) {
    router.push('/login');
    return null;
  }

  return (
    <Container>
      <div className="py-12">
        <h1 className="text-3xl font-heading mb-8 text-center">Subscription</h1>
        <div className="max-w-3xl mx-auto">
          {subscription ? (
            <SubscriptionInfo subscription={subscription} />
          ) : (
            <SubscriptionPlans userId={session.user.id} />
          )}
        </div>
      </div>
    </Container>
  );
} 