import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth.config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// 获取订阅状态
export async function GET() {
  try {
    console.log('Subscription API called');
    const session = await getServerSession(authOptions);
    console.log('Full session object:', JSON.stringify(session, null, 2));

    if (!session) {
      console.log('No session found');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!session.user) {
      console.log('No user in session');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!session.user.id) {
      console.log('No user ID in session');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    console.log('Authenticated user ID:', session.user.id);

    // Get user's active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        OR: [
          { status: 'active' },
          { status: 'canceled' }
        ]
      },
      orderBy: {
        createdAt: 'desc'
      },
    });

    console.log('Found subscription:', subscription);

    return NextResponse.json(subscription);
  } catch (error) {
    console.error('Error in subscription API:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 