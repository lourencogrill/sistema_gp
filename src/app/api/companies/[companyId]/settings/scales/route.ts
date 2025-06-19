import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const scales = await prisma.evaluationScale.findMany({
      orderBy: {
        percentage: 'asc',
      },
    });
    return NextResponse.json(scales);
  } catch (error) {
    console.error('Error fetching evaluation scales:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 