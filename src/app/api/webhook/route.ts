import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

// 添加 runtime 配置
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = headers().get('stripe-signature');

    console.log('=== Webhook Debug ===');
    console.log('Raw body length:', rawBody.length);
    console.log('Signature present:', !!signature);

    if (!signature) {
      throw new Error('No signature found');
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('Missing webhook secret');
    }

    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log('Event constructed successfully:', event.type);

    // 处理 checkout.session.completed 事件
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Processing checkout session:', {
        id: session.id,
        metadata: session.metadata,
      });

      if (session.metadata?.type === 'subscription') {
        try {
          const isMonthly = session.metadata.billingCycle === 'monthly';
          const credits = isMonthly ? 150 : 1800;
          
          console.log('Processing subscription:', {
            billingCycle: session.metadata.billingCycle,
            credits,
            plan: session.metadata.plan,
          });

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
                endDate: null,
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
          console.log('Subscription processed successfully');
        } catch (error) {
          console.error('Database transaction failed:', error);
          throw error;
        }
      }
    }

    // 在 checkout.session.completed 事件处理后添加
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      
      // 查找并更新订阅记录
      const dbSubscription = await prisma.subscription.findFirst({
        where: {
          stripeSubscriptionId: subscription.id,
        },
      });

      if (dbSubscription) {
        await prisma.$transaction([
          prisma.subscription.update({
            where: { id: dbSubscription.id },
            data: {
              status: 'canceled',
              endDate: new Date(),
            },
          }),
          prisma.user.update({
            where: { id: dbSubscription.userId },
            data: {
              isSubscribed: false,
            },
          }),
        ]);
      }
    }

    return new NextResponse(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Webhook Error:', err);
    return new NextResponse(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      { 
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
} 