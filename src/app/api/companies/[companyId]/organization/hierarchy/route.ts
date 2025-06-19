import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const hierarchyCreateSchema = z.object({
  subordinateId: z.string().cuid(),
  supervisorId: z.string().cuid(),
  startDate: z.coerce.date().optional(),
}).refine(data => data.subordinateId !== data.supervisorId, {
    message: "Um colaborador não pode ser seu próprio supervisor.",
    path: ["subordinateId", "supervisorId"],
});

// GET: Retorna a lista de todas as relações hierárquicas ativas
export async function GET(
  request: Request,
  { params }: { params: { companyId: string } }
) {
  try {
    const relations = await prisma.organizationHierarchy.findMany({
      where: {
        subordinate: { companyId: params.companyId },
        isActive: true,
      },
      include: {
        subordinate: { select: { name: true } },
        supervisor: { select: { name: true } },
      },
    });
    return NextResponse.json(relations);
  } catch (error) {
    console.error("Erro ao buscar hierarquia:", error);
    return NextResponse.json({ message: "Erro interno do servidor." }, { status: 500 });
  }
}


// POST: Cria uma nova relação hierárquica
export async function POST(
  request: Request,
  { params }: { params: { companyId: string } }
) {
  try {
    const body = await request.json();
    const validatedData = hierarchyCreateSchema.parse(body);

    // TODO: Adicionar lógica para prevenir ciclos (A -> B -> A)
    // Isso requer uma busca recursiva na hierarquia, que pode ser complexa.
    // Por agora, vamos focar na criação direta.

    // Desativa qualquer relação ativa anterior para este subordinado
    await prisma.organizationHierarchy.updateMany({
        where: {
            subordinateId: validatedData.subordinateId,
            isActive: true,
        },
        data: {
            isActive: false,
            endDate: new Date(),
        }
    });

    const newRelation = await prisma.organizationHierarchy.create({
      data: {
        subordinateId: validatedData.subordinateId,
        supervisorId: validatedData.supervisorId,
        startDate: validatedData.startDate || new Date(),
        isActive: true,
      },
    });

    return NextResponse.json(newRelation, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    console.error("Erro ao criar relação hierárquica:", error);
    return NextResponse.json({ message: "Erro interno do servidor." }, { status: 500 });
  }
} 