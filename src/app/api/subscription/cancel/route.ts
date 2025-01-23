import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get the active subscription from database
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: 'active',
      },
    });

    if (!subscription?.stripeSubscriptionId) {
      return new NextResponse('No active subscription found', { status: 404 });
    }

    // Cancel the subscription in Stripe
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    // Update subscription status in database
    await prisma.subscription.update({
      where: {
        id: subscription.id,
      },
      data: {
        status: 'canceled',
      },
    });

    // Update user subscription status
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        isSubscribed: false,
      },
    });

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return new NextResponse(
      error instanceof Error ? error.message : 'Internal error',
      { status: 500 }
    );
  }
} 