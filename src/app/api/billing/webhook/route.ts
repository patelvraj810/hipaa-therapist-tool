import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // In production, verify Stripe webhook signature
    const body = await request.text();
    console.log('Stripe webhook received:', body.substring(0, 100));
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}