import type { Stripe } from 'stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const payload = await req.text();
    const headersList = headers();
    const signature = headersList.get('stripe-signature') || '';

    console.log('Webhook received:', {
      signature: !!signature,
      payloadLength: payload.length
    });

    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log('Processing webhook event:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Checkout session completed:', {
        metadata: session.metadata,
        customerId: session.customer,
        subscriptionId: session.subscription
      });

      if (session.metadata?.type === 'subscription' && session.metadata.userId) {
        const isMonthly = session.metadata.billingCycle === 'monthly';
        const credits = isMonthly ? 150 : 1800;

        try {
          await prisma.$transaction([
            prisma.subscription.create({
              data: {
                userId: session.metadata.userId,
                plan: session.metadata.plan,
                status: 'active',
                billingCycle: session.metadata.billingCycle,
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: session.subscription as string,
                startDate: new Date(),
              },
            }),
            prisma.user.update({
              where: { id: session.metadata.userId },
              data: {
                isSubscribed: true,
                credits: {
                  increment: credits,
                },
              },
            }),
            prisma.creditHistory.create({
              data: {
                userId: session.metadata.userId,
                amount: credits,
                type: 'subscription',
                description: `${isMonthly ? 'Monthly' : 'Annual'} subscription credits`,
              },
            }),
          ]);

          console.log('Subscription created successfully:', {
            userId: session.metadata.userId,
            plan: session.metadata.plan,
            credits
          });
        } catch (error) {
          console.error('Error processing subscription:', error);
          throw error;
        }
      }
    }

    return new NextResponse(JSON.stringify({ received: true }));
  } catch (err) {
    console.error('Webhook error:', err);
    return new NextResponse(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 400 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false
  }
}; 