import { calculateFinalEvaluationScore } from '@/lib/calculations/evaluationScoreCalculator';
import {
  createTestCompany,
  createTestEvaluationSettings,
  createTestJobPosition,
  createTestUser,
  createTestCollaborator,
  cleanupDatabase,
} from '../helpers/db';

describe('Integration - Evaluation Calculation System', () => {
  // Limpa o banco antes de cada teste no describe para garantir isolamento
  beforeEach(async () => {
    await cleanupDatabase();
  });

  test('should calculate final score correctly for a complete evaluation', async () => {
    // 1. Setup: Criar a estrutura básica no banco de dados de teste
    const company = await createTestCompany('TestCorp', 'test-eval');
    await createTestEvaluationSettings(company.id);
    const jobPosition = await createTestJobPosition(company.id, 'Test Engineer');
    const user = await createTestUser('test.evaluator@example.com');
    await createTestCollaborator(company.id, jobPosition.id, user);

    // 2. Definir os dados de entrada para o cálculo
    const evaluationInput = {
      companyId: company.id,
      activityScores: [
        { activityId: 'primary-1', isPrimary: true, efficiency: 80, effectiveness: 100 },
        { activityId: 'secondary-1', isPrimary: false, efficiency: 60, effectiveness: 60 },
      ],
      skillScores: [
        { category: 'CULTURA_ORGANIZACIONAL' as const, average: 80 },
        { category: 'ESPECIFICAS_CARGO' as const, average: 60 },
      ],
      educationScore: 80,
      experienceScore: 90,
    };

    // 3. Executar a função de cálculo
    const finalScore = await calculateFinalEvaluationScore(evaluationInput);

    // 4. Verificar o resultado
    const expectedScore = 80.25;
    expect(finalScore).toBeCloseTo(expectedScore, 2);
  });
}); 