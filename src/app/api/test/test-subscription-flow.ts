import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 1. 创建测试用户
    console.log('Creating test user...');
    const userResponse = await fetch('http://localhost:3000/api/test/create-user', {
      method: 'POST'
    });
    const userData = await userResponse.json();
    console.log('User created:', userData);

    // 2. 创建订阅
    console.log('\nCreating subscription...');
    const subscriptionResponse = await fetch('http://localhost:3000/api/test/create-subscription', {
      method: 'POST'
    });
    const subscriptionData = await subscriptionResponse.json();
    console.log('Subscription created:', subscriptionData);

    // 3. 验证数据
    const user = await prisma.user.findUnique({
      where: { id: 'test00' },
      include: {
        subscription: true
      }
    });
    console.log('\nFinal user data:', user);

    return NextResponse.json({
      success: true,
      testResults: {
        user: userData,
        subscription: subscriptionData,
        finalUserState: user
      }
    });
  } catch (error) {
    console.error('Test failed:', error);
    return NextResponse.json(
      { error: 'Test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 