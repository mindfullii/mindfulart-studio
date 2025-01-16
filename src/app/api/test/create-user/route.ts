import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function GET() {
  try {
    console.log('Starting to create test user...');

    // 先检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });

    if (existingUser) {
      console.log('Deleting existing user and related data...');
      // 使用事务删除关联数据
      await prisma.$transaction([
        // 先删除订阅
        prisma.subscription.deleteMany({
          where: { userId: existingUser.id }
        }),
        // 再删除用户
        prisma.user.delete({
          where: { email: 'test@example.com' }
        })
      ]);
    }

    // 创建新的测试用户
    const hashedPassword = await hash('test123', 10);
    console.log('Creating new user...');
    
    const user = await prisma.user.create({
      data: {
        id: "test00",
        email: "test@example.com",
        name: "Test User",
        membership: "PEACEFUL_MIND",
        password: hashedPassword,
        credits: 10
      }
    });

    console.log('Test user created successfully:', user);
    return NextResponse.json({ success: true, user });

  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
} 