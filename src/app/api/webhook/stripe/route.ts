import type { Stripe } from 'stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const payload = await req.text();
  const headersList = headers();
  const signature = headersList.get('stripe-signature') || '';

  console.log('Webhook called');

  try {
    // 直接处理 checkout.session.completed 事件
    const payloadObj = JSON.parse(payload);
    
    if (payloadObj.type === 'checkout.session.completed') {
      const session = payloadObj.data.object as Stripe.Checkout.Session;
      console.log('Processing checkout session:', session.id);

      const { userId, type } = session.metadata || {};
      
      if (userId && type === 'CREDITS_PURCHASE') {
        const creditsToAdd = Math.floor((session.amount_total! / 100) * 10);
        
        // 更新用户积分和创建交易记录
        const [user, transaction] = await prisma.$transaction([
          prisma.user.update({
            where: { id: userId },
            data: {
              credits: {
                increment: creditsToAdd
              }
            }
          }),
          prisma.transaction.create({
            data: {
              userId,
              amount: session.amount_total! / 100,
              credits: creditsToAdd,
              transactionType: 'CREDITS_PURCHASE',
              status: 'SUCCESS'
            }
          })
        ]);

        console.log('Transaction completed:', {
          userId,
          newCredits: user.credits,
          transactionId: transaction.id
        });
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    console.error('Webhook error:', err);
    return new Response(
      JSON.stringify({ error: 'Webhook error' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

export const config = {
  api: {
    bodyParser: false
  }
}; 