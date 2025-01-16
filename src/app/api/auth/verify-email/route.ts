import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { message: 'Token is required' },
        { status: 400 }
      );
    }

    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 400 }
      );
    }

    if (verificationToken.expires < new Date()) {
      return NextResponse.json(
        { message: 'Token has expired' },
        { status: 400 }
      );
    }

    // 更新用户的邮箱验证状态
    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() },
    });

    // 删除已使用的 token
    await prisma.verificationToken.delete({
      where: { token },
    });

    return NextResponse.redirect(new URL('/email-verified', req.url));
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
} 