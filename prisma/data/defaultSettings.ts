/**
 * Default evaluation settings for a new company.
 * These values are based on the defaults defined in the `schema.prisma`.
 */
export const defaultEvaluationSettings = {
  primaryActivityWeight: 0.7,
  secondaryActivityWeight: 0.3,
  organizationalSkillsWeight: 0.5,
  jobSpecificSkillsWeight: 0.5,
  minimumEducationBaseScore: 0.8,
  minimumExperienceBaseScore: 0.8,
  targetAchievementForGrowth: 0.8,
}; 