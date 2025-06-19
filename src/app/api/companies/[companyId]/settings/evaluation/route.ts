import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const evaluationSettingsSchema = z.object({
  primaryActivityWeight: z.number().min(0).max(1),
  secondaryActivityWeight: z.number().min(0).max(1),
  organizationalSkillsWeight: z.number().min(0).max(1),
  jobSpecificSkillsWeight: z.number().min(0).max(1),
  minimumEducationBaseScore: z.number().min(0).max(1),
  minimumExperienceBaseScore: z.number().min(0).max(1),
  targetAchievementForGrowth: z.number().min(0).max(1),
});

async function checkUserCompany(session: any, companyId: string) {
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { collaborator: true },
  });

  if (!user?.collaborator || user.collaborator.companyId !== companyId) {
    return null;
  }
  return user;
}

export async function GET(
  req: Request,
  { params }: { params: { companyId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await checkUserCompany(session, params.companyId);
  if (!user) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const settings = await prisma.evaluationSettings.findUnique({
      where: { companyId: params.companyId },
    });

    if (!settings) {
      // Se não houver configurações, podemos retornar as padrões ou um 404
      return NextResponse.json(
        { error: 'Evaluation settings not found for this company.' },
        { status: 404 }
      );
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching evaluation settings:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { companyId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await checkUserCompany(session, params.companyId);
  if (!user) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const validatedData = evaluationSettingsSchema.parse(body);

    const updatedSettings = await prisma.evaluationSettings.update({
      where: { companyId: params.companyId },
      data: validatedData,
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error updating evaluation settings:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 