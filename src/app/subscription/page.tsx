import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { SubscriptionInfo } from '@/components/subscription/SubscriptionInfo';
import { SubscriptionPlans } from '@/components/subscription/SubscriptionPlans';

export default async function SubscriptionPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: session.user.id,
      status: 'active',
    },
  });

  return (
    <div className="container max-w-6xl py-6 space-y-8">
      <h1 className="text-2xl font-heading">Subscription</h1>

      {subscription ? (
        <SubscriptionInfo subscription={subscription} />
      ) : (
        <SubscriptionPlans userId={session.user.id} />
      )}
    </div>
  );
} 