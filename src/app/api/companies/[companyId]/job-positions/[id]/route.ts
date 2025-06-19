import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
  ActivityFrequency,
  BehavioralCategory,
  CareerType,
  EducationLevel,
  ExperienceType,
  KnowledgeLevel,
  RequirementType,
} from "@prisma/client";
import { z } from "zod";

export async function GET(
  request: Request,
  { params }: { params: { companyId: string; id: string } }
) {
  try {
    const { companyId, id } = params;

    const jobPosition = await prisma.jobPosition.findFirst({
      where: {
        id,
        companyId,
      },
      include: {
        educationRequirements: true,
        experienceRequirements: true,
        knowledgeRequirements: true,
        behavioralProfiles: true,
        activities: {
          orderBy: {
            order: "asc",
          },
          include: {
            // Inclui indicadores que estão associados a esta atividade
            indicators: {
              orderBy: {
                name: "asc",
              },
            },
          },
        },
        // Inclui apenas os indicadores que NÃO estão associados a nenhuma atividade
        indicators: {
          where: {
            activityId: null,
          },
          orderBy: {
            name: "asc",
          },
        },
      },
    });

    if (!jobPosition) {
      return NextResponse.json(
        { message: "Cargo não encontrado ou não pertence a esta empresa." },
        { status: 404 }
      );
    }

    return NextResponse.json(jobPosition);
  } catch (error) {
    console.error("Erro ao buscar cargo:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}

// Esquema de validação para os indicadores (aninhados ou não)
const jobIndicatorUpdateSchema = z.object({
  name: z.string().min(1, "O nome do indicador é obrigatório."),
  dataSource: z.string(),
  calculationMethod: z.string(),
  measurementUnit: z.string(),
  target: z.string(),
  weight: z.number().default(1.0),
});

// Esquema para as atividades, que podem conter indicadores
const jobActivityUpdateSchema = z.object({
  description: z.string().min(1, "A descrição da atividade é obrigatória."),
  isPrimary: z.boolean().default(false),
  frequency: z.nativeEnum(ActivityFrequency),
  order: z.number(),
  indicators: z.array(jobIndicatorUpdateSchema).optional(),
});

// Esquema principal para a atualização do cargo
const jobPositionUpdateSchema = z
  .object({
    name: z.string().optional(),
    area: z.string().optional(),
    immediateSuperiorPosition: z.string().nullish(),
    careerType: z.nativeEnum(CareerType).optional(),
    mainObjective: z.string().optional(),
    additionalBenefits: z.string().nullish(),
    requiresTravel: z.boolean().optional(),
    travelDetails: z.string().nullish(),
    requiresVehicle: z.boolean().optional(),
    vehicleType: z.string().nullish(),
    requiresDriverLicense: z.boolean().optional(),
    driverLicenseType: z.string().nullish(),

    educationRequirements: z
      .array(
        z.object({
          requirementType: z.nativeEnum(RequirementType),
          educationLevel: z.nativeEnum(EducationLevel),
          specificArea: z.string().nullish(),
        })
      )
      .optional(),
    experienceRequirements: z
      .array(
        z.object({
          requirementType: z.nativeEnum(RequirementType),
          minimumYears: z.number(),
          experienceType: z.nativeEnum(ExperienceType),
          specificArea: z.string().nullish(),
          description: z.string().nullish(),
        })
      )
      .optional(),
    knowledgeRequirements: z
      .array(
        z.object({
          requirementType: z.nativeEnum(RequirementType),
          knowledgeName: z.string(),
          knowledgeLevel: z.nativeEnum(KnowledgeLevel),
          description: z.string().nullish(),
        })
      )
      .optional(),
    behavioralProfiles: z
      .array(
        z.object({
          category: z.nativeEnum(BehavioralCategory),
          description: z.string(),
          weight: z.number().default(1.0),
        })
      )
      .optional(),
    activities: z.array(jobActivityUpdateSchema).optional(),
    indicators: z.array(jobIndicatorUpdateSchema).optional(),
  })
  .partial(); // .partial() torna todos os campos de primeiro nível opcionais

export async function PUT(
  request: Request,
  { params }: { params: { companyId: string; id: string } }
) {
  try {
    const { companyId, id } = params;
    const body = await request.json();

    // 1. Validação do corpo da requisição
    const validatedData = jobPositionUpdateSchema.parse(body);
    const {
      educationRequirements,
      experienceRequirements,
      knowledgeRequirements,
      behavioralProfiles,
      activities,
      indicators: directIndicators, // indicadores diretos do cargo
      ...jobPositionData
    } = validatedData;

    // 2. Verificar se o cargo existe e pertence à empresa
    const existingJobPosition = await prisma.jobPosition.findFirst({
      where: { id, companyId },
    });

    if (!existingJobPosition) {
      return NextResponse.json(
        { message: "Cargo não encontrado ou não pertence a esta empresa." },
        { status: 404 }
      );
    }

    // 3. Executar a atualização de forma transacional
    const updatedJobPosition = await prisma.$transaction(async (tx) => {
      // Deletar relacionamentos existentes para recriá-los (padrão "delete and recreate")
      await tx.jobEducationRequirement.deleteMany({ where: { jobPositionId: id } });
      await tx.jobExperienceRequirement.deleteMany({ where: { jobPositionId: id } });
      await tx.jobKnowledgeRequirement.deleteMany({ where: { jobPositionId: id } });
      await tx.jobBehavioralProfile.deleteMany({ where: { jobPositionId: id } });
      await tx.jobIndicator.deleteMany({ where: { jobPositionId: id } });
      await tx.jobActivity.deleteMany({ where: { jobPositionId: id } });

      // Atualizar os campos diretos do cargo
      await tx.jobPosition.update({
        where: { id },
        data: { ...jobPositionData },
      });

      // Recriar os relacionamentos
      if (educationRequirements) {
        await tx.jobEducationRequirement.createMany({
          data: educationRequirements.map((req) => ({ ...req, jobPositionId: id })),
        });
      }
      if (experienceRequirements) {
        await tx.jobExperienceRequirement.createMany({
          data: experienceRequirements.map((req) => ({ ...req, jobPositionId: id })),
        });
      }
      if (knowledgeRequirements) {
        await tx.jobKnowledgeRequirement.createMany({
          data: knowledgeRequirements.map((req) => ({ ...req, jobPositionId: id })),
        });
      }
      if (behavioralProfiles) {
        await tx.jobBehavioralProfile.createMany({
          data: behavioralProfiles.map((prof) => ({ ...prof, jobPositionId: id })),
        });
      }
      if (directIndicators) {
        await tx.jobIndicator.createMany({
          data: directIndicators.map((ind) => ({ ...ind, jobPositionId: id })),
        });
      }
      if (activities) {
        for (const activity of activities) {
          const { indicators: activityIndicators, ...activityData } = activity;
          const createdActivity = await tx.jobActivity.create({
            data: {
              ...activityData,
              jobPositionId: id,
            },
          });
          if (activityIndicators) {
            await tx.jobIndicator.createMany({
              data: activityIndicators.map((ind) => ({
                ...ind,
                jobPositionId: id,
                activityId: createdActivity.id,
              })),
            });
          }
        }
      }
      
      // Buscar o resultado final com todos os dados incluídos para retornar ao cliente
      const result = await tx.jobPosition.findUnique({
        where: { id },
        include: {
          educationRequirements: true,
          experienceRequirements: true,
          knowledgeRequirements: true,
          behavioralProfiles: true,
          activities: {
            orderBy: { order: "asc" },
            include: { indicators: { orderBy: { name: "asc" } } },
          },
          indicators: { where: { activityId: null }, orderBy: { name: "asc" } },
        },
      });

      return result;
    });

    return NextResponse.json(updatedJobPosition);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    console.error("Erro ao atualizar cargo:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor." },
      { status: 500 }
    );
  }
} 