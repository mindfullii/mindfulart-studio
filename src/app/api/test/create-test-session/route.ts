import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET(req: Request) {
  try {
    const userId = 'cm68q9hkc0002kyajknwhun2d';
    const priceId = process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID;
    
    if (!priceId) {
      throw new Error('NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID is not configured');
    }
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL}/subscription?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/subscription?canceled=true`,
      metadata: {
        userId: userId,
        type: 'subscription'
      },
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
    });

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error) {
    console.error('Error creating test session:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 