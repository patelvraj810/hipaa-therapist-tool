import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Check for conflicts
    // In production, check Supabase for time conflicts
    return NextResponse.json({ success: true, appointment: { id: crypto.randomUUID(), ...body } });
  } catch {
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Schedule API - use dashboard for demo' });
}