// app/api/dashboard/route.ts

import { NextResponse } from 'next/server';
import prisma from '../../../lib/client';

export async function GET() {
  try {
    const allPredictions = await prisma.dropoutPrediction.findMany({
      orderBy: { predictionDate: 'desc' },
      select: {
        studentId: true,
        probability: true,
        predictionDate: true,
      },
    });

    const dropoutCount = allPredictions.filter(p => p.probability >= 0.5).length;
    const safeCount = allPredictions.filter(p => p.probability < 0.5).length;

    const recentPredictions = allPredictions.slice(0, 10).map(p => ({
      ...p,
      prediction: p.probability >= 0.5 ? 'Dropout Risk' : 'Safe',
    }));

    return NextResponse.json({
      total: allPredictions.length,
      dropoutCount,
      safeCount,
      recentPredictions,
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Dashboard summary failed' }, { status: 500 });
  }
}
