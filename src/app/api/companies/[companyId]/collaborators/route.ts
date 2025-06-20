import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from 'zod';

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

// Zod schema para validação da entrada
const createCollaboratorSchema = z.object({
  name: z.string().min(3, 'O nome é obrigatório e precisa de no mínimo 3 caracteres.'),
  email: z.string().email('O email fornecido é inválido.'),
  jobPositionId: z.string().cuid('O ID do cargo é inválido.'),
  hireDate: z.string().optional().transform((val) => val ? new Date(val) : null),
});

export async function POST(
  request: Request,
  { params }: { params: { companyId: string } }
) {
  try {
    const body = await request.json();
    const validation = createCollaboratorSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.format(), { status: 400 });
    }

    const { name, email, jobPositionId, hireDate } = validation.data;
    const { companyId } = params;

    // TODO: Adicionar lógica para garantir que a empresa existe
    // const company = await prisma.company.findUnique({ where: { id: companyId } });
    // if (!company) {
    //   return NextResponse.json({ message: 'Empresa não encontrada' }, { status: 404 });
    // }

    // Primeiro, criar o User associado
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        role: 'EMPLOYEE', // Por padrão, novos colaboradores são do tipo EMPLOYEE
        // A senha pode ser definida posteriormente ou via um fluxo de convite
      },
    });

    // Depois, criar o Collaborator e conectar ao User e JobPosition
    const newCollaborator = await prisma.collaborator.create({
      data: {
        name,
        email,
        hireDate,
        company: {
          connect: { id: companyId },
        },
        user: {
          connect: { id: newUser.id },
        },
        jobPosition: {
          connect: { id: jobPositionId },
        },
      },
    });

    return NextResponse.json(newCollaborator, { status: 201 });
  } catch (error) {
    console.error('Falha ao criar colaborador:', error);
    // Verificar se o erro é por email duplicado
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2002') {
         return NextResponse.json({ message: 'Um colaborador com este email já existe.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
} 