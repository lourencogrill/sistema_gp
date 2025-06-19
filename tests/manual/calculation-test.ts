// Teste manual dos cálculos
import { calculateEducationScore } from '@/lib/calculations/educationScoreCalculator';
import { calculateExperienceScore } from '@/lib/calculations/experienceScoreCalculator';
import { EducationLevel } from '@prisma/client';

// Teste 1: Colaborador com nível exato do cargo
console.log('=== TESTE CÁLCULO INSTRUÇÃO ===');
const test1 = calculateEducationScore(
  EducationLevel.ENSINO_SUPERIOR_COMPLETO,  // Nível atual do colaborador
  EducationLevel.ENSINO_SUPERIOR_COMPLETO,  // Nível mínimo do cargo
  0.8  // Base score (80%)
);
console.log('Colaborador com nível exato:', test1); // Esperado: 0.8 (80%)

// Teste 2: Colaborador com +1 nível
const test2 = calculateEducationScore(
  EducationLevel.POS_GRADUACAO_COMPLETA,    // +2 níveis acima
  EducationLevel.ENSINO_SUPERIOR_COMPLETO,  // Nível mínimo
  0.8
);
console.log('Colaborador +2 níveis:', test2); // Esperado: 1.0 (100%)

// Teste 3: Colaborador com -1 nível
const test3 = calculateEducationScore(
  EducationLevel.ENSINO_MEDIO_COMPLETO,     // -4 níveis abaixo
  EducationLevel.ENSINO_SUPERIOR_COMPLETO,  // Nível mínimo
  0.8
);
console.log('Colaborador -4 níveis:', test3); // Esperado: 0.0 (0%)

console.log('=== TESTE CÁLCULO EXPERIÊNCIA ===');
const expTest1 = calculateExperienceScore(2.0, 2.0, 0.8); // Exato: 80%
const expTest2 = calculateExperienceScore(4.0, 2.0, 0.8); // +2 anos: 100%
const expTest3 = calculateExperienceScore(1.0, 2.0, 0.8); // -1 ano: 40% (0.8 * (1/2))
const expTest4 = calculateExperienceScore(1.5, 2.0, 0.8); // -0.5 anos: 60% (0.8 * (1.5/2))

console.log('Experiência exata:', expTest1);
console.log('Experiência +2 anos:', expTest2);
console.log('Experiência -1 ano:', expTest3);
console.log('Experiência -0.5 anos:', expTest4);
