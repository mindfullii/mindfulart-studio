import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    console.log('------------------------');
    console.log('Creating subscription');
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      console.log('No authenticated user found');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    console.log('Authenticated user:', {
      id: session.user.id,
      email: session.user.email,
    });

    const { priceId } = await req.json();
    console.log('Price ID:', priceId);

    // Determine plan and billing cycle based on priceId
    const isMonthly = priceId === process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID;
    const plan = isMonthly ? 'monthly' : 'annual';
    const billingCycle = isMonthly ? 'monthly' : 'annual';

    console.log('Subscription details:', {
      isMonthly,
      plan,
      billingCycle,
      monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID,
    });

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
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL}/subscription?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/subscription?canceled=true`,
      metadata: {
        userId: session.user.id,
        type: 'subscription',
        plan,
        billingCycle,
      },
    });

    console.log('Stripe session created:', {
      id: stripeSession.id,
      url: stripeSession.url,
      metadata: stripeSession.metadata,
    });
    console.log('------------------------');

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return new NextResponse(
      error instanceof Error ? error.message : 'Internal error',
      { status: 500 }
    );
  }
} 