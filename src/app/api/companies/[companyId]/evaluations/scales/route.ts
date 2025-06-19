import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { companyId: string } }
) {
  try {
    // A validação de que a empresa existe pode ser feita aqui,
    // mas as escalas são universais no momento.
    // No futuro, poderiam ser por empresa.
    const scales = await prisma.evaluationScale.findMany({
      orderBy: {
        percentage: "asc",
      },
    });

    return NextResponse.json(scales);
  } catch (error) {
    console.error("Erro ao buscar escalas de avaliação:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor." },
      { status: 500 }
    );
  }
} 