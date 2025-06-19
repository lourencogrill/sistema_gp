import { JobExperienceRequirement, ExperienceType } from '@prisma/client';

/**
 * Calculates the score for the collaborator's experience compared to the job's minimum requirement.
 * @param currentExperienceYears - The current years of experience of the collaborator.
 * @param requiredExperienceYears - The minimum years of experience required for the job.
 * @param baseScore - The base score for meeting the minimum requirement (defaults to 0.8).
 * @returns A score between 0.0 and 1.0.
 */
export function calculateExperienceScore(
  currentExperienceYears: number,
  requiredExperienceYears: number,
  baseScore: number = 0.8
): number {
  if (requiredExperienceYears <= 0) {
    return 1.0; // Se não há requisito, a pontuação é máxima.
  }

  // Se o colaborador atende ou supera o requisito
  if (currentExperienceYears >= requiredExperienceYears) {
    const yearsAbove = currentExperienceYears - requiredExperienceYears;
    // A cada ano acima do requisito, adiciona 10% à nota base, até o máximo de 100%.
    const score = baseScore + (yearsAbove * 0.1);
    return Math.min(score, 1.0); // Garante que a nota não passe de 1.0 (100%)
  } 
  
  // Se o colaborador não atende ao requisito
  // A pontuação é proporcional ao percentual atingido, aplicado sobre a nota base.
  const percentageAchieved = currentExperienceYears / requiredExperienceYears;
  return parseFloat((baseScore * percentageAchieved).toFixed(2));
} 