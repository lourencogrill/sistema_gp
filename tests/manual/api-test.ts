import prisma from '../../src/lib/prisma';

const BASE_URL = 'http://localhost:3000';

async function testApi() {
  console.log('Buscando empresa de teste...');
  const company = await prisma.company.findUnique({
    where: { name: 'Lume Corporate' },
  });

  if (!company) {
    console.error('Empresa "Lume Corporate" não encontrada. Execute `npm run db:seed` primeiro.');
    await prisma.$disconnect();
    process.exit(1);
  }
//oi
  const companyId = company.id;
  console.log(`Empresa encontrada. ID: ${companyId}`);
  
  try {
    // === TESTE 1: GET Configurações Padrão ===
    console.log('\n=== TESTE 1: GET Configurações Padrão ===');
    const getResponse1 = await fetch(`${BASE_URL}/api/companies/${companyId}/settings/evaluation`);
    const initialSettings = await getResponse1.json();
    console.log('Resposta GET 1:', initialSettings);

    // === TESTE 2: PUT Novas Configurações ===
    console.log('\n=== TESTE 2: PUT Novas Configurações ===');
    const putData = {
      primaryActivityWeight: 0.8,
      secondaryActivityWeight: 0.2,
      organizationalSkillsWeight: 0.6,
      jobSpecificSkillsWeight: 0.4,
      minimumEducationBaseScore: 0.8,
      minimumExperienceBaseScore: 0.8,
      targetAchievementForGrowth: 0.8,
    };

    const putResponse = await fetch(`${BASE_URL}/api/companies/${companyId}/settings/evaluation`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(putData),
    });
    const updatedSettings = await putResponse.json();
    console.log('Resposta PUT:', updatedSettings);

    // === TESTE 3: GET para Verificar Alteração ===
    console.log('\n=== TESTE 3: GET para Verificar Alteração ===');
    const getResponse2 = await fetch(`${BASE_URL}/api/companies/${companyId}/settings/evaluation`);
    const finalSettings = await getResponse2.json();
    console.log('Resposta GET 2:', finalSettings);

    // Verificação final
    if(finalSettings.primaryActivityWeight === 0.8) {
        console.log('\n✅ Sucesso! As configurações foram atualizadas corretamente.');
    } else {
        console.error('\n❌ Falha! As configurações não foram atualizadas.');
    }

  } catch (error) {
    console.error('Erro durante o teste de API:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testApi();
