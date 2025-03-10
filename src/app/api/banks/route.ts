// src/app/api/banks/route.ts
import { NextResponse } from 'next/server';
import { listBanks } from '@/lib/paystack';

export async function GET() {
  try {
    const banks = await listBanks();
    return NextResponse.json({ success: true, data: banks });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch banks' }, 
      { status: 500 }
    );
  }
}