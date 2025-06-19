import { PrismaClient } from '@prisma/client';
import { evaluationScales } from './data/evaluationScales';
import { defaultEvaluationSettings } from './data/defaultSettings';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  for (const scale of evaluationScales) {
    const scaleInDb = await prisma.evaluationScale.upsert({
      where: { percentage: scale.percentage },
      update: {},
      create: {
        percentage: scale.percentage,
        efficiencyDescription: scale.efficiencyDescription,
        effectivenessDescription: scale.effectivenessDescription,
        skillDescription: scale.skillDescription,
      },
    });
    console.log(`Created/updated scale with percentage: ${scaleInDb.percentage}`);
  }

  const testCompany = await prisma.company.upsert({
    where: { name: 'Lume Corporate' },
    update: {},
    create: {
      name: 'Lume Corporate',
      cnpj: '00.000.000/0001-00',
    },
  });
  console.log(`Created/updated test company: ${testCompany.name}`);

  const settings = await prisma.evaluationSettings.upsert({
    where: { companyId: testCompany.id },
    update: {},
    create: {
      companyId: testCompany.id,
      ...defaultEvaluationSettings,
    },
  });
  console.log(`Created/updated evaluation settings for ${testCompany.name}`);

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 