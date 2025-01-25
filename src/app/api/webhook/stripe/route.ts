import type { Stripe } from 'stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const payload = await req.text();
  const headersList = headers();
  const signature = headersList.get('stripe-signature') || '';

  logger.info('Webhook received:', {
    signature: signature.substring(0, 20) + '...',  // 只记录签名的一部分
    payloadLength: payload.length,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET?.substring(0, 5) + '...'  // 只记录密钥的一部分
  });

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    logger.info('Webhook event constructed successfully:', {
      type: event.type,
      id: event.id
    });

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      logger.info('Processing checkout session:', {
        metadata: session.metadata,
        customerId: session.customer,
        subscriptionId: session.subscription,
        paymentStatus: session.payment_status
      });

      if (session.metadata?.type === 'subscription' && session.metadata.userId) {
        const isMonthly = session.metadata.billingCycle === 'monthly';
        const credits = isMonthly ? 150 : 1800;

        try {
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

          logger.info('Database transaction completed:', {
            subscription: result[0],
            user: result[1],
            creditHistory: result[2]
          });
        } catch (error) {
          logger.error('Database transaction failed:', error);
          throw error;
        }
      }
    }

    return new NextResponse(JSON.stringify({ received: true }));
  } catch (err) {
    logger.error('Webhook error:', {
      error: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined
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