import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { SubscriptionPlans } from '@/components/subscription/SubscriptionPlans';
import { SubscriptionInfo } from '@/components/subscription/SubscriptionInfo';

export default async function SubscriptionPage({
  searchParams,
}: {
  searchParams: { resubscribe?: string }
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/');

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: session.user.id,
      OR: [
        { status: 'active' },
        { status: 'canceled' }
      ]
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // 如果是重新订阅，显示订阅计划
  if (searchParams.resubscribe === 'true') {
    return (
      <div className="container max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-heading mb-8 text-center">Choose a New Plan</h1>
        <div className="max-w-4xl mx-auto">
          <SubscriptionPlans userId={session.user.id} />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-heading mb-8 text-center">Subscription</h1>
      <div className="max-w-3xl mx-auto">
        {subscription && !searchParams.resubscribe ? (
          <SubscriptionInfo subscription={subscription} />
        ) : (
          <SubscriptionPlans userId={session.user.id} />
        )}
      </div>
    </div>
  );
} 