import type { Stripe } from 'stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  console.log('------------------------');
  console.log('Stripe Webhook received');
  
  const payload = await req.text();
  const headersList = headers();
  const signature = headersList.get('stripe-signature') || '';

  console.log('Request headers:', {
    'stripe-signature': signature ? 'Present' : 'Missing',
    'content-type': headersList.get('content-type'),
  });

  try {
    console.log('Verifying Stripe signature with secret:', process.env.STRIPE_WEBHOOK_SECRET ? 'Present' : 'Missing');
    
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log('Event constructed successfully:', {
      type: event.type,
      id: event.id,
    });

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Checkout session completed:', {
        id: session.id,
        mode: session.mode,
        metadata: session.metadata,
        customer: session.customer,
        subscription: session.subscription,
      });

      // 确保这是订阅类型的支付
      if (session.mode === 'subscription' && session.metadata?.type === 'subscription') {
        console.log('Processing subscription payment:', {
          userId: session.metadata.userId,
          billingCycle: session.metadata.billingCycle,
          plan: session.metadata.plan,
        });

        const isMonthly = session.metadata.billingCycle === 'monthly';
        const credits = isMonthly ? 150 : 1800;

        try {
          console.log('Starting database transaction');
          
          const result = await prisma.$transaction([
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

          console.log('Database transaction completed successfully:', {
            subscription: {
              id: result[0].id,
              userId: result[0].userId,
              status: result[0].status,
            },
            user: {
              id: result[1].id,
              credits: result[1].credits,
              isSubscribed: result[1].isSubscribed,
            },
            creditHistory: {
              id: result[2].id,
              amount: result[2].amount,
            },
          });
        } catch (error) {
          console.error('Database transaction failed:', error);
          throw error;
        }
      } else {
        console.log('Skipping webhook processing:', {
          mode: session.mode,
          type: session.metadata?.type,
        });
      }
    } else {
      console.log('Skipping non-checkout event:', event.type);
    }

    console.log('Webhook processed successfully');
    console.log('------------------------');
    return new NextResponse(JSON.stringify({ received: true }));
  } catch (err) {
    console.error('Webhook error:', {
      error: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
    });
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