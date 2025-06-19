import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Rota para buscar colaboradores de uma empresa para preencher seletores
export async function GET(
  request: Request,
  { params }: { params: { companyId: string } }
) {
  try {
    const { companyId } = params;

    const collaborators = await prisma.collaborator.findMany({
      where: {
        companyId: companyId,
        status: 'ACTIVE' // Apenas colaboradores ativos
      },
      select: {
        id: true,
        name: true,
        jobPosition: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(collaborators);
  } catch (error) {
    console.error("Erro ao buscar colaboradores:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor." },
      { status: 500 }
    );
  }
} 