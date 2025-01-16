import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const transactions = await prisma.transaction.findMany({
      where: { 
        userId: session.user.id,
        status: 'SUCCESS'  // 只显示成功的交易
      },
      orderBy: { createdAt: 'desc' },
      take: 10  // 最近10条记录
    });

    return NextResponse.json({ transactions });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
} 