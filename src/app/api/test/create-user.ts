import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const user = await prisma.user.create({
      data: {
        id: "test00",
        email: "test@example.com",
        name: "Test User",
        membership: "PEACEFUL_MIND"
      }
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Failed to create test user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
} 