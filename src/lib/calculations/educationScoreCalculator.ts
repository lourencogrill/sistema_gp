import { EducationLevel } from '@prisma/client';

/**
 * Calculates the score for the collaborator's education level compared to the job's minimum requirement.
 * @param currentLevel - The current education level of the collaborator.
 * @param minimumLevel - The minimum education level required for the job.
 * @param baseScore - The base score for meeting the minimum requirement (defaults to 0.8).
 * @returns A score between 0.0 and 1.0.
 */
export function calculateEducationScore(
  currentLevel: EducationLevel,
  minimumLevel: EducationLevel,
  baseScore: number = 0.8
): number {
  const levelValues: Record<EducationLevel, number> = {
    ENSINO_FUNDAMENTAL_COMPLETO: 1,
    CURSANDO_ENSINO_MEDIO: 2,
    ENSINO_MEDIO_COMPLETO: 3,
    CURSANDO_ENSINO_TECNICO: 4,
    ENSINO_TECNICO_COMPLETO: 5,
    CURSANDO_ENSINO_SUPERIOR: 6,
    ENSINO_SUPERIOR_COMPLETO: 7,
    CURSANDO_POS_GRADUACAO: 8,
    POS_GRADUACAO_COMPLETA: 9,
  };

  if (!currentLevel || !minimumLevel) {
    return 0;
  }

  const difference = levelValues[currentLevel] - levelValues[minimumLevel];

  if (difference >= 2) return 1.0; // 100%
  if (difference === 1) return 0.9; // 90%
  if (difference === 0) return baseScore; // 80%
  if (difference === -1) return 0.64; // 64% (80% de 80%)
  if (difference <= -2) return 0.0; // 0%

  return 0;
} 