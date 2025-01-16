import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    // 验证邮箱和密码
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // 检查邮箱是否已被使用
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already exists' },
        { status: 400 }
      );
    }

    // 创建新用户
    const hashedPassword = await hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        credits: 10,
      }
    });

    // 发送验证邮件
    await sendVerificationEmail(user.email, user.id);

    return NextResponse.json(
      { message: 'Registration successful! Please check your email for verification.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
} 