import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Starting to create test subscription...');

    // 先检查是否已存在订阅
    const existingSubscription = await prisma.subscription.findUnique({
      where: { userId: 'test00' }
    });

    if (existingSubscription) {
      console.log('Deleting existing subscription...');
      await prisma.subscription.delete({
        where: { userId: 'test00' }
      });
    }

    // 创建新的订阅
    const subscription = await prisma.subscription.create({
      data: {
        userId: "test00",
        plan: "PEACEFUL_MIND",
        status: "active",
        billingCycle: "monthly",
        startDate: new Date(),
        stripeSubscriptionId: "test_sub_123"
      }
    });

    console.log('Test subscription created successfully:', subscription);
    return NextResponse.json({ success: true, subscription });

  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create subscription',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
} 