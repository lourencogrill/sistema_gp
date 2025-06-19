import prisma from "@/lib/prisma";
import {
  calculateEducationScore,
} from "@/lib/calculations/educationScoreCalculator";
import {
  calculateExperienceScore,
} from "@/lib/calculations/experienceScoreCalculator";
import { EducationLevel } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Esquema para validar os query params
const previewQuerySchema = z.object({
  currentEducationLevel: z.nativeEnum(EducationLevel).optional(),
  currentExperienceYears: z.coerce.number().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { companyId: string; id: string } }
) {
  try {
    const { companyId, id: jobPositionId } = params;

    // 1. Validar query params
    const queryParseResult = previewQuerySchema.safeParse(
      Object.fromEntries(request.nextUrl.searchParams)
    );

    if (!queryParseResult.success) {
      return NextResponse.json(
        { errors: queryParseResult.error.errors },
        { status: 400 }
      );
    }
    const { currentEducationLevel, currentExperienceYears } =
      queryParseResult.data;

    // 2. Buscar dados essenciais em paralelo
    const [jobPosition, settings] = await Promise.all([
      prisma.jobPosition.findFirst({
        where: { id: jobPositionId, companyId },
        include: {
          educationRequirements: true,
          experienceRequirements: true,
          knowledgeRequirements: true,
          behavioralProfiles: {
            orderBy: { category: "asc" },
          },
          activities: {
            orderBy: { order: "asc" },
            include: {
              indicators: { orderBy: { name: "asc" } },
            },
          },
          indicators: {
            where: { activityId: null },
            orderBy: { name: "asc" },
          },
        },
      }),
      prisma.evaluationSettings.findUnique({
        where: { companyId },
      }),
    ]);

    if (!jobPosition) {
      return NextResponse.json(
        { message: "Cargo não encontrado." },
        { status: 404 }
      );
    }
    if (!settings) {
      return NextResponse.json(
        { message: "Configurações de avaliação não encontradas para a empresa." },
        { status: 404 }
      );
    }

    // 3. Calcular pontuações de educação e experiência

    // Encontrar o requisito mínimo de educação (pré-requisito)
    const minEducationRequirement = jobPosition.educationRequirements.find(
      (req) => req.requirementType === "PRE_REQUISITO"
    );

    let educationScore = null;
    if (currentEducationLevel && minEducationRequirement) {
      educationScore = calculateEducationScore(
        currentEducationLevel,
        minEducationRequirement.educationLevel,
        settings.minimumEducationBaseScore
      );
    }

    // Encontrar o requisito mínimo de experiência no cargo (pré-requisito)
    const minExperienceRequirement = jobPosition.experienceRequirements.find(
      (req) =>
        req.requirementType === "PRE_REQUISITO" &&
        req.experienceType === "CARGO"
    );

    let experienceScore = null;
    if (
      currentExperienceYears !== undefined &&
      minExperienceRequirement
    ) {
      experienceScore = calculateExperienceScore(
        currentExperienceYears,
        minExperienceRequirement.minimumYears,
        settings.minimumExperienceBaseScore
      );
    }

    // 4. Estruturar a resposta do preview
    const preview = {
      jobPositionId: jobPosition.id,
      jobPositionName: jobPosition.name,
      evaluationPeriodStart: new Date(), // Datas de exemplo
      evaluationPeriodEnd: new Date(),
      status: "DRAFT",
      scores: {
        educationScore,
        experienceScore,
      },
      evaluationForm: {
        activities: jobPosition.activities.map((act) => ({
          id: act.id,
          description: act.description,
          isPrimary: act.isPrimary,
          weight: (act as any).weight,
        })),
        directIndicators: jobPosition.indicators.map((ind) => ({
            id: ind.id,
            name: ind.name,
            calculationMethod: ind.calculationMethod,
            target: ind.target,
            weight: ind.weight,
        })),
        behavioralSkills: jobPosition.behavioralProfiles.map((prof) => ({
          id: prof.id,
          category: prof.category,
          description: prof.description,
          weight: prof.weight,
        })),
      },
    };

    return NextResponse.json(preview);
  } catch (error) {
    console.error("Erro ao gerar preview da avaliação:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor." },
      { status: 500 }
    );
  }
} 