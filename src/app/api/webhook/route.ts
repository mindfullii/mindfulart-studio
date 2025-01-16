import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new NextResponse(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown Error'}`, { status: 400 });
  }

  const session = event.data.object as any;

  switch (event.type) {
    case 'checkout.session.completed':
      const checkoutSession = event.data.object as any;
      
      try {
        if (checkoutSession.metadata.type === 'credits') {
          // 处理积分购买
          await prisma.user.update({
            where: {
              id: checkoutSession.metadata.userId,
            },
            data: {
              credits: {
                increment: parseInt(checkoutSession.metadata.credits),
              },
            },
          });
        } else {
          // 获取 Stripe 订阅详情
          const stripeSubscription = await stripe.subscriptions.retrieve(
            checkoutSession.subscription
          );

          // 检查是否已存在订阅
          const existingSubscription = await prisma.subscription.findFirst({
            where: {
              userId: checkoutSession.metadata.userId,
              status: 'active',
            },
          });

          if (!existingSubscription) {
            await prisma.subscription.create({
              data: {
                userId: checkoutSession.metadata.userId,
                plan: checkoutSession.metadata.plan,
                status: 'active',
                billingCycle: checkoutSession.metadata.billingCycle,
                stripeCustomerId: checkoutSession.customer,
                stripeSubscriptionId: checkoutSession.subscription,
                startDate: new Date(),
                endDate: stripeSubscription.current_period_end 
                  ? new Date(stripeSubscription.current_period_end * 1000)
                  : null,
                user: {
                  connect: {
                    id: checkoutSession.metadata.userId
                  }
                }
              },
            });

            // 更新用户状态和积分
            await prisma.user.update({
              where: {
                id: checkoutSession.metadata.userId,
              },
              data: {
                isSubscribed: true,
                credits: {
                  increment: checkoutSession.metadata.billingCycle === 'monthly' ? 150 : 1800
                }
              },
            });
          }
        }
      } catch (error) {
        console.error('Error processing checkout session:', error);
        // 继续处理其他 webhook 事件
      }
      break;

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      // 处理订阅更新/取消
      const subscription = await prisma.subscription.findFirst({
        where: { stripeSubscriptionId: session.id },
      });

      if (subscription) {
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            status: session.status,
            endDate: session.cancel_at ? new Date(session.cancel_at * 1000) : null,
          },
        });
      }
      break;
  }

  return new NextResponse(null, { status: 200 });
} 