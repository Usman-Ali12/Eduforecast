import { NextResponse } from 'next/server';
import prisma from '@/lib/client';

export async function POST(req: Request) {
  try {
    const { predictions } = await req.json();

    if (!Array.isArray(predictions)) {
      return NextResponse.json({ message: 'Invalid predictions format' }, { status: 400 });
    }

    const validData = predictions.filter((p: any) =>
      typeof p.student_id === 'number' &&
      typeof p.prediction === 'string' &&
      typeof p.probability_dropout === 'number'
    );

    if (validData.length === 0) {
      return NextResponse.json({ message: 'No valid predictions to save' }, { status: 400 });
    }

    const result = await prisma.dropoutPrediction.createMany({
      data: validData.map((p: any) => ({
        studentId: p.student_id,
        prediction: p.prediction,
        probability: p.probability_dropout,
      })),
      skipDuplicates: true,
    });

    return NextResponse.json({ message: 'Predictions saved', count: result.count });
  } catch (error: any) {
    console.error('Save error:', error.message);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
