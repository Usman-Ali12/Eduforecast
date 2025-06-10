import { NextResponse } from 'next/server';
import prisma from '@/lib/client';

export async function GET() {
  try {
    const data = await prisma.dropoutPrediction.groupBy({
      by: ['prediction'],
      _count: { prediction: true },
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
