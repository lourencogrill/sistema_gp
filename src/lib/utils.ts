import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import prisma from "./prisma"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utilitários para validação de API
export async function validateCompanyExists(companyId: string) {
  const company = await prisma.company.findUnique({
    where: { id: companyId }
  });
  return company;
}

export async function validateJobPositionBelongsToCompany(jobPositionId: string, companyId: string) {
  const jobPosition = await prisma.jobPosition.findFirst({
    where: {
      id: jobPositionId,
      companyId: companyId
    }
  });
  return jobPosition;
}

export async function validateUserEmailIsUnique(email: string, excludeCompanyId?: string) {
  // Verificar se já existe um usuário com este email
  const existingUser = await prisma.user.findUnique({
    where: { email: email }
  });

  if (!existingUser) {
    return { isUnique: true, user: null };
  }

  // Verificar se este usuário já é colaborador de alguma empresa
  const existingCollaborator = await prisma.collaborator.findUnique({
    where: { userId: existingUser.id },
    include: { company: true }
  });

  if (!existingCollaborator) {
    return { isUnique: true, user: existingUser };
  }

  // Se excludeCompanyId foi fornecido, permitir se for da mesma empresa
  if (excludeCompanyId && existingCollaborator.companyId === excludeCompanyId) {
    return { isUnique: true, user: existingUser };
  }

  return { 
    isUnique: false, 
    user: existingUser, 
    collaborator: existingCollaborator 
  };
}

export async function validateCollaboratorEmailInCompany(email: string, companyId: string, excludeCollaboratorId?: string) {
  const whereClause: any = {
    email: email,
    companyId: companyId
  };

  if (excludeCollaboratorId) {
    whereClause.id = { not: excludeCollaboratorId };
  }

  const existingCollaborator = await prisma.collaborator.findFirst({
    where: whereClause
  });

  return existingCollaborator;
}
