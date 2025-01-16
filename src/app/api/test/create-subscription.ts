import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
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

    return NextResponse.json({ success: true, subscription });
  } catch (error) {
    console.error('Failed to create test subscription:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
} 