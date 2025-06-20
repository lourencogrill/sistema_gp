import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import {
  type Prisma,
  RequirementType,
  EducationLevel,
  ExperienceType,
  KnowledgeLevel,
  ActivityFrequency,
  BehavioralCategory,
  CareerType,
} from '@prisma/client';

// Helper de autorização
async function checkUserCompany(session: any, companyId: string) {
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { collaborator: true },
  });
  return user?.collaborator?.companyId === companyId;
}

// Schemas de validação Zod detalhados
const educationRequirementSchema = z.object({
  // @ts-ignore
  requirementType: z.nativeEnum(Prisma.RequirementType),
  // @ts-ignore
  educationLevel: z.nativeEnum(Prisma.EducationLevel),
  specificArea: z.string().optional(),
});

const experienceRequirementSchema = z.object({
  // @ts-ignore
  requirementType: z.nativeEnum(Prisma.RequirementType),
  minimumYears: z.number().positive(),
  // @ts-ignore
  experienceType: z.nativeEnum(Prisma.ExperienceType),
  specificArea: z.string().optional(),
  description: z.string().optional(),
});

const knowledgeRequirementSchema = z.object({
  // @ts-ignore
  requirementType: z.nativeEnum(Prisma.RequirementType),
  knowledgeName: z.string(),
  // @ts-ignore
  knowledgeLevel: z.nativeEnum(Prisma.KnowledgeLevel),
  description: z.string().optional(),
});

const activitySchema = z.object({
  description: z.string(),
  isPrimary: z.boolean().default(false),
  // @ts-ignore
  frequency: z.nativeEnum(Prisma.ActivityFrequency),
  order: z.number().int(),
});

const indicatorSchema = z.object({
  name: z.string(),
  dataSource: z.string(),
  calculationMethod: z.string(),
  measurementUnit: z.string(),
  target: z.string(),
  weight: z.number().default(1.0),
});

const behavioralProfileSchema = z.object({
  // @ts-ignore
  category: z.nativeEnum(Prisma.BehavioralCategory),
  description: z.string(),
  weight: z.number().default(1.0),
});

const jobPositionCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  area: z.string().min(1, 'Area is required'),
  // @ts-ignore
  careerType: z.nativeEnum(Prisma.CareerType),
  mainObjective: z.string().min(1, 'Main objective is required'),
  educationRequirements: z.array(educationRequirementSchema).optional(),
  experienceRequirements: z.array(experienceRequirementSchema).optional(),
  knowledgeRequirements: z.array(knowledgeRequirementSchema).optional(),
  activities: z.array(activitySchema).optional(),
  indicators: z.array(indicatorSchema).optional(),
  behavioralProfiles: z.array(behavioralProfileSchema).optional(),
});

export async function GET(
  req: Request,
  { params }: { params: { companyId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !(await checkUserCompany(session, params.companyId))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const jobPositions = await prisma.jobPosition.findMany({
      where: { companyId: params.companyId },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(jobPositions);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { companyId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !(await checkUserCompany(session, params.companyId))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsedData = jobPositionCreateSchema.parse(body);
    const {
      educationRequirements,
      experienceRequirements,
      knowledgeRequirements,
      activities,
      indicators,
      behavioralProfiles,
      ...jobPositionData
    } = parsedData;

    if (activities && Array.isArray(activities)) {
      const primaryActivitiesCount = activities.filter(a => a.isPrimary).length;
      if (primaryActivitiesCount > 5) {
        return NextResponse.json(
          { error: 'A maximum of 5 primary activities is allowed.' },
          { status: 400 }
        );
      }
    }

    const newJobPosition = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const createdJobPosition = await tx.jobPosition.create({
        data: {
          ...jobPositionData,
          companyId: params.companyId,
        },
      });
      const jobPositionId = createdJobPosition.id;

      if (educationRequirements && Array.isArray(educationRequirements)) {
        await tx.jobEducationRequirement.createMany({
          data: educationRequirements.map((req) => ({ ...req, jobPositionId })),
        });
      }
      if (experienceRequirements && Array.isArray(experienceRequirements)) {
        await tx.jobExperienceRequirement.createMany({
          data: experienceRequirements.map((req) => ({ ...req, jobPositionId })),
        });
      }
      if (knowledgeRequirements && Array.isArray(knowledgeRequirements)) {
        await tx.jobKnowledgeRequirement.createMany({
          data: knowledgeRequirements.map((req) => ({ ...req, jobPositionId })),
        });
      }
      if (activities && Array.isArray(activities)) {
        await tx.jobActivity.createMany({
          data: activities.map((act) => ({ ...act, jobPositionId })),
        });
      }
      if (indicators && Array.isArray(indicators)) {
        await tx.jobIndicator.createMany({
          data: indicators.map((ind) => ({ ...ind, jobPositionId })),
        });
      }
      if (behavioralProfiles && Array.isArray(behavioralProfiles)) {
        await tx.jobBehavioralProfile.createMany({
          data: behavioralProfiles.map((prof) => ({ ...prof, jobPositionId })),
        });
      }

      return createdJobPosition;
    });

    return NextResponse.json(newJobPosition, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    const errorMessage =
      error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 