import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // 获取用户的订阅信息
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: 'active',
      },
    });

    if (!subscription) {
      return new NextResponse('No active subscription found', { status: 404 });
    }

    // 获取 Stripe 发票列表
    const invoices = await stripe.invoices.list({
      customer: subscription.stripeCustomerId,
      limit: 12, // 最近12个月
    });

    return NextResponse.json(invoices.data);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return new NextResponse(
      error instanceof Error ? error.message : 'Internal error',
      { status: 500 }
    );
  }
} 