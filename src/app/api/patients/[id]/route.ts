import { NextResponse } from 'next/server';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  // In production, fetch single patient from Supabase with decryption
  return NextResponse.json({ id: params.id });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, patient: { id: params.id, ...body } });
  } catch {
    return NextResponse.json({ error: 'Failed to update patient' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ success: true, deleted: params.id });
}