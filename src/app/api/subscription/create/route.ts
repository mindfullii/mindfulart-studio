import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const { priceId, userId } = await req.json();
    const authSession = await getServerSession(authOptions);
    
    if (!authSession?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    // 确定订阅类型
    const isMonthlySub = priceId === process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID;
    
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL}/subscription?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/subscription?canceled=true`,
      metadata: {
        type: 'subscription',
        userId: userId,
        billingCycle: isMonthlySub ? 'monthly' : 'annual',
        plan: isMonthlySub ? 'PEACEFUL_MIND_MONTHLY' : 'PEACEFUL_MIND_ANNUAL',
      },
      customer_email: authSession.user.email,
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new NextResponse('Error creating checkout session', { status: 500 });
  }
} 