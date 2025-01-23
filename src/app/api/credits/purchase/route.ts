import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { stripe } from '@/lib/stripe';

const CREDIT_PRICES = {
  100: process.env.STRIPE_CREDIT_100_PRICE_ID,
  250: process.env.STRIPE_CREDIT_250_PRICE_ID,
  600: process.env.STRIPE_CREDIT_600_PRICE_ID,
  1500: process.env.STRIPE_CREDIT_1500_PRICE_ID,
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { credits } = await req.json();
    const priceId = CREDIT_PRICES[credits as keyof typeof CREDIT_PRICES];

    if (!priceId) {
      return new NextResponse('Invalid credit amount', { status: 400 });
    }

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      customer_email: session.user.email!,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/subscription?credits=success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/subscription?credits=canceled`,
      metadata: {
        userId: session.user.id,
        credits: credits,
        type: 'credits',
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