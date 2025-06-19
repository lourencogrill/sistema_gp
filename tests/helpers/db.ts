import prisma from '@/lib/prisma';
import { Company, EvaluationSettings, JobPosition, Collaborator, User, Prisma } from '@prisma/client';

type UserCreateInput = Prisma.UserCreateInput;

export async function createTestCompany(name: string, slug: string): Promise<Company> {
  return prisma.company.create({
    data: {
      name: `${name}-${slug}`,
      cnpj: `${Math.floor(Math.random() * 100000000000000)}`,
    },
  });
}

export async function createTestEvaluationSettings(companyId: string): Promise<EvaluationSettings> {
  // Usando os pesos padrão para consistência nos testes
  return prisma.evaluationSettings.create({
    data: {
      companyId,
      primaryActivityWeight: 0.7,
      secondaryActivityWeight: 0.3,
      organizationalSkillsWeight: 0.5,
      jobSpecificSkillsWeight: 0.5,
      minimumEducationBaseScore: 0.8,
      minimumExperienceBaseScore: 0.8,
      targetAchievementForGrowth: 0.8,
    },
  });
}

export async function createTestUser(email: string, role: UserCreateInput['role'] = 'EMPLOYEE'): Promise<User> {
    return prisma.user.create({
        data: {
            email,
            name: 'Test User',
            role,
        }
    })
}

export async function createTestCollaborator(companyId: string, jobPositionId: string, user: User): Promise<Collaborator> {
    return prisma.collaborator.create({
        data: {
            companyId,
            jobPositionId,
            userId: user.id,
            email: user.email!,
            name: user.name!,
            department: 'Testing',
        }
    })
}


export async function createTestJobPosition(companyId: string, name: string): Promise<JobPosition> {
    return prisma.jobPosition.create({
        data: {
            companyId,
            name: name,
            area: 'Testing',
            careerType: 'TECNICA',
            mainObjective: 'Objective for testing purposes',
        }
    });
}


/**
 * Limpa todas as tabelas do banco de dados para garantir um estado limpo entre os testes.
 * A ordem é importante para respeitar as constraints de chave estrangeira.
 */
export async function cleanupDatabase() {
  // A ordem de exclusão é importante para evitar erros de restrição de chave estrangeira.
  // Começamos pelos modelos que dependem de outros.
  await prisma.activityEvaluation.deleteMany();
  await prisma.indicatorEvaluation.deleteMany();
  await prisma.profileEvaluation.deleteMany();
  await prisma.performanceEvaluation.deleteMany();
  await prisma.jobIndicator.deleteMany();
  await prisma.jobActivity.deleteMany();
  await prisma.jobBehavioralProfile.deleteMany();
  await prisma.jobKnowledgeRequirement.deleteMany();
  await prisma.jobExperienceRequirement.deleteMany();
  await prisma.jobEducationRequirement.deleteMany();
  await prisma.organizationHierarchy.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.climateCheckIn.deleteMany();
  await prisma.kanbanCard.deleteMany();
  await prisma.kanbanColumn.deleteMany();
  await prisma.kanbanBoard.deleteMany();
  
  // Modelos que outros dependem são excluídos por último.
  await prisma.collaborator.deleteMany();
  await prisma.jobPosition.deleteMany();
  await prisma.evaluationSettings.deleteMany();
  await prisma.pushSubscription.deleteMany();
  
  // Account e Session são ligados ao User, que será deletado
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  
  await prisma.company.deleteMany();

  // Não mexemos na EvaluationScale, pois são dados de seed que queremos manter.

  await prisma.$disconnect();
} 