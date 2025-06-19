import { Prisma } from '@prisma/client';
import prisma from '../prisma';

// Supondo que esses tipos sejam definidos em algum lugar
// ou que possamos inferi-los dos dados de entrada.
type ActivityScoreInput = {
  activityId: string;
  isPrimary: boolean; // Precisamos saber se a atividade é primária ou secundária
  efficiency: number; // 0-100
  effectiveness: number; // 0-100
};

type SkillScoreInput = {
  category: 'CULTURA_ORGANIZACIONAL' | 'ESPECIFICAS_CARGO';
  average: number; // 0-100
};

type EvaluationInput = {
  companyId: string;
  activityScores: ActivityScoreInput[];
  skillScores: SkillScoreInput[];
  educationScore: number; // 0-100
  experienceScore: number; // 0-100
};

/**
 * Calcula a pontuação final consolidada de uma avaliação de desempenho.
 * Esta função agrega as pontuações de atividades, perfil comportamental,
 * educação e experiência para formar uma nota final.
 *
 * @param {EvaluationInput} data - Os dados de entrada contendo todas as pontuações.
 * @returns {Promise<number>} A pontuação final da avaliação (0-100).
 */
export async function calculateFinalEvaluationScore(
  data: EvaluationInput
): Promise<number> {
  const settings = await prisma.evaluationSettings.findUnique({
    where: { companyId: data.companyId },
  });

  if (!settings) {
    throw new Error(
      `Configurações de avaliação não encontradas para a empresa ${data.companyId}`
    );
  }

  // 1. Calcular a pontuação ponderada das atividades
  const primaryScores = data.activityScores.filter((s) => s.isPrimary);
  const secondaryScores = data.activityScores.filter((s) => !s.isPrimary);

  const avgPrimaryScore =
    primaryScores.reduce(
      (acc, s) => acc + (s.efficiency + s.effectiveness) / 2,
      0
    ) / (primaryScores.length || 1);

  const avgSecondaryScore =
    secondaryScores.reduce(
      (acc, s) => acc + (s.efficiency + s.effectiveness) / 2,
      0
    ) / (secondaryScores.length || 1);

  const totalActivityScore =
    avgPrimaryScore * settings.primaryActivityWeight +
    avgSecondaryScore * settings.secondaryActivityWeight;

  // 2. Calcular a pontuação ponderada das habilidades
  const orgSkillScore =
    data.skillScores.find((s) => s.category === 'CULTURA_ORGANIZACIONAL')
      ?.average || 0;
  const jobSkillScore =
    data.skillScores.find((s) => s.category === 'ESPECIFICAS_CARGO')
      ?.average || 0;

  const totalSkillScore =
    orgSkillScore * settings.organizationalSkillsWeight +
    jobSkillScore * settings.jobSpecificSkillsWeight;

  // 3. Pontuações de Educação e Experiência (já vêm calculadas)
  const { educationScore, experienceScore } = data;

  // 4. Calcular a pontuação final (média simples dos 4 pilares)
  // Adicionamos uma verificação para evitar divisão por zero se não houver pontuações
  const scores = [
    totalActivityScore,
    totalSkillScore,
    educationScore,
    experienceScore,
  ].filter(score => score > 0);
  
  const finalScore = scores.reduce((acc, score) => acc + score, 0) / (scores.length || 1);

  return parseFloat(finalScore.toFixed(2));
} 