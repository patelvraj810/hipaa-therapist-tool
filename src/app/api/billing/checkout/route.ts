import { NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(_request: Request) {
  try {
    // In production, create Stripe checkout session
    const stripePriceId = process.env.STRIPE_PRO_PRICE_ID || 'price_placeholder';
    return NextResponse.json({ 
      url: `/dashboard/billing?session_id=demo_${Date.now()}`,
      priceId: stripePriceId 
    });
  } catch {
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}