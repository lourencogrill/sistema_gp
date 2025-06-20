import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from 'zod';
import { 
  validateCompanyExists, 
  validateJobPositionBelongsToCompany, 
  validateUserEmailIsUnique, 
  validateCollaboratorEmailInCompany 
} from '@/lib/utils';

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
  department: z.string().min(2, 'O departamento é obrigatório.'),
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
      return NextResponse.json(
        { 
          message: "Dados inválidos fornecidos.",
          errors: validation.error.format()
        }, 
        { status: 400 }
      );
    }

    const { name, email, department, jobPositionId, hireDate } = validation.data;
    const { companyId } = params;

    // 1. Validar se a empresa existe
    const company = await validateCompanyExists(companyId);
    if (!company) {
      return NextResponse.json(
        { message: 'Empresa não encontrada.' }, 
        { status: 404 }
      );
    }

    // 2. Validar se o cargo existe e pertence à empresa
    const jobPosition = await validateJobPositionBelongsToCompany(jobPositionId, companyId);
    if (!jobPosition) {
      return NextResponse.json(
        { message: 'Cargo não encontrado ou não pertence a esta empresa.' }, 
        { status: 404 }
      );
    }

    // 3. Verificar se já existe um colaborador com este email na empresa
    const existingCollaborator = await validateCollaboratorEmailInCompany(email, companyId);
    if (existingCollaborator) {
      return NextResponse.json(
        { message: 'Já existe um colaborador com este email nesta empresa.' }, 
        { status: 409 }
      );
    }

    // 4. Verificar email de usuário
    const emailValidation = await validateUserEmailIsUnique(email, companyId);
    if (!emailValidation.isUnique) {
      return NextResponse.json(
        { message: 'Este usuário já é colaborador de outra empresa.' }, 
        { status: 409 }
      );
    }

    let userId: string;

    // 5. Usar usuário existente ou criar novo
    if (emailValidation.user) {
      userId = emailValidation.user.id;
    } else {
      const newUser = await prisma.user.create({
        data: {
          name: name,
          email: email,
          role: 'EMPLOYEE',
        },
      });
      userId = newUser.id;
    }

    // 6. Criar o colaborador
    const newCollaborator = await prisma.collaborator.create({
      data: {
        name,
        email,
        department,
        hireDate,
        userId: userId,
        companyId: companyId,
        jobPositionId: jobPositionId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        jobPosition: {
          select: {
            id: true,
            name: true,
            area: true
          }
        },
        company: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json(newCollaborator, { status: 201 });

  } catch (error) {
    console.error('Falha ao criar colaborador:', error);
    
    // Tratamento específico para erros do Prisma
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as any;
      
      switch (prismaError.code) {
        case 'P2002':
          const target = prismaError.meta?.target;
          if (target?.includes('email')) {
            return NextResponse.json(
              { message: 'Um colaborador com este email já existe.' }, 
              { status: 409 }
            );
          }
          return NextResponse.json(
            { message: 'Violação de restrição única nos dados fornecidos.' }, 
            { status: 409 }
          );
          
        case 'P2025':
          return NextResponse.json(
            { message: 'Dados relacionados não encontrados. Verifique se a empresa e o cargo existem.' }, 
            { status: 404 }
          );
          
        case 'P2003':
          return NextResponse.json(
            { message: 'Erro de relacionamento: verifique se os dados fornecidos são válidos.' }, 
            { status: 400 }
          );
          
        default:
          console.error('Erro Prisma não tratado:', prismaError);
      }
    }
    
    return NextResponse.json(
      { message: 'Erro interno do servidor.' }, 
      { status: 500 }
    );
  }
} 