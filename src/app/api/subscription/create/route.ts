import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { planId } = await req.json();
    
    if (!planId) {
      return new NextResponse('Missing plan ID', { status: 400 });
    }

    // 验证价格 ID 是否是我们支持的
    const validPriceIds = [
      process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID,
      process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID,
    ];

    if (!validPriceIds.includes(planId)) {
      return new NextResponse('Invalid plan ID', { status: 400 });
    }

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      customer_email: session.user.email!,
      line_items: [
        {
          price: planId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: `${process.env.NEXTAUTH_URL}/subscription?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/subscription?canceled=true`,
      metadata: {
        userId: session.user.id,
        plan: planId.includes('monthly') ? 'monthly' : 'annual',
        billingCycle: planId.includes('monthly') ? 'monthly' : 'annual',
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error('Error:', error);
    return new NextResponse(
      error instanceof Error ? error.message : 'Internal error', 
      { status: 500 }
    );
  }
} 