import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

// 添加 runtime 配置
export const runtime = 'nodejs';

const MONTHLY_CREDITS = 150;
const ANNUAL_CREDITS = 1800;

export async function POST(req: Request) {
  console.log('------------------------');
  console.log('Webhook received - START');
  
  const body = await req.text();
  const signature = headers().get('stripe-signature');
  
  console.log('Request body:', body);
  console.log('Webhook headers:', {
    signature: !!signature,
    'content-type': headers().get('content-type'),
  });

  if (!signature) {
    console.error('No stripe signature found');
    return new NextResponse('No stripe signature', { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured');
    return new NextResponse('Webhook secret not configured', { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log('Webhook event constructed successfully:', {
      type: event.type,
      id: event.id,
      object: event.data.object,
    });
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new NextResponse(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown Error'}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Processing checkout session:', {
          id: session.id,
          mode: session.mode,
          metadata: session.metadata,
          customer: session.customer,
          subscription: session.subscription,
          userId: session.metadata?.userId,
        });
        
        // Handle subscription payment
        if (session.mode === 'subscription' && session.subscription) {
          console.log('Processing subscription payment');
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          console.log('Retrieved subscription details:', {
            id: subscription.id,
            status: subscription.status,
            items: subscription.items.data.length,
            customerId: subscription.customer,
            metadata: subscription.metadata,
          });

          if (!session.metadata?.userId) {
            console.error('No userId found in session metadata');
            return new NextResponse('No userId in metadata', { status: 400 });
          }

          const interval = subscription.items.data[0].price.recurring?.interval;
          
          console.log('Creating subscription record:', {
            userId: session.metadata.userId,
            stripeSubscriptionId: subscription.id,
            interval,
            startDate: new Date(subscription.current_period_start * 1000),
            endDate: new Date(subscription.current_period_end * 1000),
          });

          // Update user subscription status
          const dbSubscription = await prisma.subscription.create({
            data: {
              userId: session.metadata.userId,
              stripeSubscriptionId: subscription.id,
              status: 'active',
              startDate: new Date(subscription.current_period_start * 1000),
              endDate: new Date(subscription.current_period_end * 1000),
              billingCycle: interval === 'month' ? 'monthly' : 'annual',
              plan: interval === 'month' ? 'MONTHLY_PLAN' : 'ANNUAL_PLAN'
            }
          });

          console.log('Created subscription record:', dbSubscription);

          // Add subscription credits
          const creditsToAdd = interval === 'month' ? MONTHLY_CREDITS : ANNUAL_CREDITS;
          console.log('Adding subscription credits:', {
            userId: session.metadata.userId,
            credits: creditsToAdd,
          });

          const creditHistory = await prisma.creditHistory.create({
            data: {
              userId: session.metadata.userId,
              amount: creditsToAdd,
              type: 'subscription',
              description: `Credits from ${interval} subscription`
            }
          });

          console.log('Created credit history:', creditHistory);

          // Update user credits
          const updatedUser = await prisma.user.update({
            where: { id: session.metadata.userId },
            data: {
              credits: {
                increment: creditsToAdd
              },
              isSubscribed: true
            }
          });

          console.log('Updated user:', {
            id: updatedUser.id,
            credits: updatedUser.credits,
            isSubscribed: updatedUser.isSubscribed,
          });
        }
        
        // Handle one-time credit purchase
        if (session.mode === 'payment' && session.metadata?.type === 'credits') {
          const credits = parseInt(session.metadata.credits);
          console.log('Processing credit purchase:', {
            userId: session.metadata.userId,
            credits,
          });
          
          await prisma.creditHistory.create({
            data: {
              userId: session.metadata.userId,
              amount: credits,
              type: 'purchase',
              description: `Purchased ${credits} credits`
            }
          });

          await prisma.user.update({
            where: { id: session.metadata.userId },
            data: {
              credits: {
                increment: credits
              }
            }
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Processing subscription deletion:', subscription.id);
        
        const dbSubscription = await prisma.subscription.findFirst({
          where: {
            stripeSubscriptionId: subscription.id
          }
        });

        if (dbSubscription) {
          console.log('Updating subscription status to canceled:', dbSubscription.id);
          await prisma.subscription.update({
            where: {
              id: dbSubscription.id
            },
            data: {
              status: 'canceled',
              endDate: new Date(subscription.current_period_end * 1000)
            }
          });

          await prisma.user.update({
            where: {
              id: dbSubscription.userId
            },
            data: {
              isSubscribed: false
            }
          });
        }
        break;
      }
    }

    console.log('Webhook processed successfully');
    console.log('------------------------');
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new NextResponse(
      `Webhook Error: ${error instanceof Error ? error.message : 'Unknown Error'}`,
      { status: 500 }
    );
  }
} 