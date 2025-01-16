import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';
import { generateVerificationToken } from './utils';

// 调试用：打印环境变量
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY);

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined in environment variables');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, userId: string) {
  if (!email) throw new Error('Email is required');
  
  const verificationToken = generateVerificationToken();
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;

  // 保存 token 到数据库
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: verificationToken,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  // 发送邮件
  const { data, error } = await resend.emails.send({
    from: 'MindfulArt Studio <onboarding@resend.dev>',
    to: email,
    subject: 'Verify your email address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Welcome to MindfulArt Studio!</h1>
        <p style="color: #666; text-align: center;">Please click the button below to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #6366f1; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p style="color: #666; text-align: center; font-size: 14px;">
          This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
        </p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
} 