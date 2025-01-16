import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth.config';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // 更新订阅状态
    await prisma.subscription.update({
      where: {
        userId: session.user.id,
        status: 'active',
      },
      data: {
        status: 'cancelled',
        canceledAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 });
  }
} 