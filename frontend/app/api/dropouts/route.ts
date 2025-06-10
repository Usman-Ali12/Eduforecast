import { NextResponse } from 'next/server';
import prisma from '../../../lib/client';

// GET: Return all dropout predictions
export async function GET() {
  try {
    const allDropouts = await prisma.fact_dropout.findMany({
      orderBy: {
        predictionDate: 'desc',
      },
    });

    return NextResponse.json(allDropouts);
  } catch (error) {
    console.error('Error fetching dropouts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dropout data' },
      { status: 500 }
    );
  }
}

// POST: Add a new dropout prediction
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { studentName, predictedDropout } = body;

    if (!studentName || typeof predictedDropout !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing or invalid studentName or predictedDropout' },
        { status: 400 }
      );
    }

    const newDropout = await prisma.fact_dropout.create({
      data: {
        studentName,
        predictedDropout,
        predictionDate: new Date(), // optional, handled by default
      },
    });

    return NextResponse.json(newDropout, { status: 201 });
  } catch (error) {
    console.error('Error inserting dropout:', error);
    return NextResponse.json(
      { error: 'Failed to insert dropout record' },
      { status: 500 }
    );
  }
}

