import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: 'Email is already verified' },
        { status: 400 }
      );
    }

    // 发送新的验证邮件
    await sendVerificationEmail(user.email, user.id);

    return NextResponse.json(
      { message: 'Verification email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { message: 'Failed to send verification email' },
      { status: 500 }
    );
  }
} 