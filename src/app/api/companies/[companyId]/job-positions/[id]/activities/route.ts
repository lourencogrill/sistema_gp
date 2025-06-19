import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ActivityFrequency } from "@prisma/client";

// Esquema de validação para os indicadores que podem ser aninhados em uma atividade
const jobIndicatorCreateSchema = z.object({
  name: z.string().min(1, "O nome do indicador é obrigatório."),
  dataSource: z.string(),
  calculationMethod: z.string(),
  measurementUnit: z.string(),
  target: z.string(),
  weight: z.number().default(1.0),
});

// Esquema para a criação de uma atividade
const activityCreateSchema = z.object({
  description: z.string().min(1, "A descrição da atividade é obrigatória."),
  isPrimary: z.boolean().default(false),
  frequency: z.nativeEnum(ActivityFrequency),
  order: z.number(),
  indicators: z.array(jobIndicatorCreateSchema).optional(),
});

// Esquema para o corpo da requisição, que é um array de atividades
const activitiesPostSchema = z.array(activityCreateSchema);

export async function POST(
  request: Request,
  { params }: { params: { companyId: string; id: string } }
) {
  try {
    const { companyId, id: jobPositionId } = params;
    const body = await request.json();

    // 1. Validar o corpo da requisição
    const newActivities = activitiesPostSchema.parse(body);

    // 2. Verificar se o cargo existe e pertence à empresa
    const jobPosition = await prisma.jobPosition.findFirst({
      where: {
        id: jobPositionId,
        companyId: companyId,
      },
    });

    if (!jobPosition) {
      return NextResponse.json(
        { message: "Cargo não encontrado ou não pertence a esta empresa." },
        { status: 404 }
      );
    }
    
    // 3. Criar as atividades e seus indicadores de forma transacional
    const createdData = await prisma.$transaction(async (tx) => {
      const results = [];
      for (const activity of newActivities) {
        const { indicators, ...activityData } = activity;
        
        const createdActivity = await tx.jobActivity.create({
          data: {
            ...activityData,
            jobPositionId: jobPositionId,
          },
        });

        if (indicators && indicators.length > 0) {
          await tx.jobIndicator.createMany({
            data: indicators.map((ind) => ({
              ...ind,
              jobPositionId: jobPositionId,
              activityId: createdActivity.id,
            })),
          });
        }
        
        // Carrega a atividade criada com seus indicadores para retornar na resposta
        const fullActivity = await tx.jobActivity.findUnique({
            where: { id: createdActivity.id },
            include: { indicators: true }
        });
        results.push(fullActivity);
      }
      return results;
    });

    return NextResponse.json(createdData, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    console.error("Erro ao adicionar atividades ao cargo:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor." },
      { status: 500 }
    );
  }
} 