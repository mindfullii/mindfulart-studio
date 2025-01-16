import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Purchase API session:', session); // 添加调试日志

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { amount } = body;  // amount 现在是积分数量

    // 查找对应的价格包
    const priceMap = {
      100: 400,    // $4.00
      250: 800,    // $8.00
      600: 2000,   // $20.00
      1500: 4800,  // $48.00
    };

    const price = priceMap[amount];
    if (!price) {
      return new NextResponse('Invalid credit amount', { status: 400 });
    }

    // 创建 Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Credits',
              description: `${amount} credits`,
            },
            unit_amount: price, // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/dashboard/subscription?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/subscription?canceled=true`,
      metadata: {
        userId: session.user.id,
        credits: amount,
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error('Failed to create checkout session:', error);
    return new NextResponse('Failed to create checkout session', { status: 500 });
  }
} 