import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session:', session);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 获取用户的订阅信息
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        status: true,
        plan: true,
        stripeSubscriptionId: true
      }
    });

    if (!subscription || subscription.status !== 'active') {
      return NextResponse.json(
        { message: 'No active subscription found' },
        { status: 400 }
      );
    }

    // 更新数据库
    await prisma.$transaction([
      // 更新订阅状态
      prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: 'canceled',
          endDate: new Date()
        }
      }),
      // 更新用户会员身份
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          membership: 'FREE_SOUL'
        }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to cancel subscription:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 