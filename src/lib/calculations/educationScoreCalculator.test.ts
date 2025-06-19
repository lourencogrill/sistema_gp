import { EducationLevel } from '@prisma/client';
import { calculateEducationScore } from './educationScoreCalculator';

describe('calculateEducationScore', () => {
  it('should return 1.0 (100%) when current level is 2 or more levels above minimum', () => {
    const score = calculateEducationScore(
      EducationLevel.POS_GRADUACAO_COMPLETA,
      EducationLevel.ENSINO_SUPERIOR_COMPLETO
    );
    expect(score).toBe(1.0);
  });

  it('should return 0.9 (90%) when current level is 1 level above minimum', () => {
    const score = calculateEducationScore(
      EducationLevel.CURSANDO_POS_GRADUACAO,
      EducationLevel.ENSINO_SUPERIOR_COMPLETO
    );
    expect(score).toBe(0.9);
  });

  it('should return the base score (default 0.8) when current level is equal to minimum', () => {
    const score = calculateEducationScore(
      EducationLevel.ENSINO_SUPERIOR_COMPLETO,
      EducationLevel.ENSINO_SUPERIOR_COMPLETO
    );
    expect(score).toBe(0.8);
  });

  it('should return a custom base score when provided', () => {
    const score = calculateEducationScore(
      EducationLevel.ENSINO_SUPERIOR_COMPLETO,
      EducationLevel.ENSINO_SUPERIOR_COMPLETO,
      0.75 // Custom base score
    );
    expect(score).toBe(0.75);
  });

  it('should return 0.64 when current level is 1 level below minimum', () => {
    const score = calculateEducationScore(
      EducationLevel.CURSANDO_ENSINO_SUPERIOR,
      EducationLevel.ENSINO_SUPERIOR_COMPLETO
    );
    expect(score).toBe(0.64);
  });

  it('should return 0.0 when current level is 2 or more levels below minimum', () => {
    const score = calculateEducationScore(
      EducationLevel.ENSINO_TECNICO_COMPLETO,
      EducationLevel.ENSINO_SUPERIOR_COMPLETO
    );
    expect(score).toBe(0.0);
  });

  it('should return 0 if currentLevel is null or undefined', () => {
    const score = calculateEducationScore(
      null as any,
      EducationLevel.ENSINO_SUPERIOR_COMPLETO
    );
    expect(score).toBe(0);
  });
}); 