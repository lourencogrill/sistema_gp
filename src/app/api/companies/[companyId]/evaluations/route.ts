import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  calculateEducationScore,
} from "@/lib/calculations/educationScoreCalculator";
import {
  calculateExperienceScore,
} from "@/lib/calculations/experienceScoreCalculator";

const evaluationCreateSchema = z.object({
  collaboratorId: z.string().cuid(),
  evaluationPeriodStart: z.coerce.date(),
  evaluationPeriodEnd: z.coerce.date(),
});

export async function POST(
  request: Request,
  { params }: { params: { companyId: string } }
) {
  try {
    const { companyId } = params;
    const body = await request.json();
    const validatedData = evaluationCreateSchema.parse(body);
    const { collaboratorId, evaluationPeriodStart, evaluationPeriodEnd } = validatedData;

    // 1. Buscar todos os dados necessários em paralelo
    const collaborator = await prisma.collaborator.findUnique({
      where: { id: collaboratorId },
    });

    if (!collaborator || !collaborator.jobPositionId) {
      return NextResponse.json({ message: "Colaborador ou cargo não encontrado." }, { status: 404 });
    }

    const [jobPosition, settings] = await Promise.all([
      prisma.jobPosition.findUnique({
        where: { id: collaborator.jobPositionId },
        include: {
          educationRequirements: true,
          experienceRequirements: true,
          activities: true,
          indicators: true,
          behavioralProfiles: true,
        },
      }),
      prisma.evaluationSettings.findUnique({ where: { companyId } }),
    ]);

    if (!jobPosition) return NextResponse.json({ message: "Cargo não encontrado." }, { status: 404 });
    if (!settings) return NextResponse.json({ message: "Configurações da empresa não encontradas." }, { status: 404 });

    // 2. Calcular pontuações iniciais
    const minEducationReq = jobPosition.educationRequirements.find(r => r.requirementType === 'PRE_REQUISITO');
    const educationScore = collaborator.currentEducationLevel && minEducationReq
      ? calculateEducationScore(collaborator.currentEducationLevel, minEducationReq.educationLevel, settings.minimumEducationBaseScore)
      : null;

    const minExperienceReq = jobPosition.experienceRequirements.find(r => r.requirementType === 'PRE_REQUISITO' && r.experienceType === 'CARGO');
    const experienceScore = (collaborator.currentExperienceYears !== null && minExperienceReq)
      ? calculateExperienceScore(collaborator.currentExperienceYears, minExperienceReq.minimumYears, settings.minimumExperienceBaseScore)
      : null;

    // 3. Criar a avaliação e todos os seus sub-itens em uma transação
    const newEvaluation = await prisma.performanceEvaluation.create({
      data: {
        companyId,
        collaboratorId,
        jobPositionId: jobPosition.id,
        evaluationPeriodStart,
        evaluationPeriodEnd,
        dueDate: evaluationPeriodEnd, // Pode ser ajustado no futuro
        currentEducationLevel: collaborator.currentEducationLevel,
        experienceYears: collaborator.currentExperienceYears,
        educationScore,
        experienceScore,
        status: "DRAFT",
        // Pré-popular os itens a serem avaliados
        activityEvaluations: {
          create: jobPosition.activities.map(act => ({
            activityId: act.id,
            efficiencyPercentage: 0,
            effectivenessPercentage: 0,
            weight: (act as any).weight,
            finalScore: 0,
          })),
        },
        indicatorEvaluations: {
          create: jobPosition.indicators.map(ind => ({
            indicatorId: ind.id,
            target: ind.target,
            result: "",
            achievementPercentage: 0,
            evaluationPercentage: 0,
            weight: (ind as any).weight,
            finalScore: 0,
          })),
        },
        profileEvaluations: {
            create: jobPosition.behavioralProfiles.map(prof => ({
                profileId: prof.id,
                percentage: 0,
                weight: prof.weight,
                finalScore: 0,
            })),
        },
      },
      include: {
          activityEvaluations: true,
          indicatorEvaluations: true,
          profileEvaluations: true,
      }
    });

    return NextResponse.json(newEvaluation, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    console.error("Erro ao criar avaliação:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor." },
      { status: 500 }
    );
  }
} 