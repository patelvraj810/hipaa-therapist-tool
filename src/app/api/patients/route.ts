import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // In production, save to Supabase with encryption
    // For demo, just return success
    return NextResponse.json({ success: true, patient: { id: crypto.randomUUID(), ...body } });
  } catch {
    return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 });
  }
}

export async function GET() {
  // In production, fetch from Supabase with decryption
  return NextResponse.json({ message: 'Patient API - use dashboard for demo' });
}