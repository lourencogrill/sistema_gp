/*
  Warnings:

  - You are about to drop the column `role` on the `Collaborator` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CareerType" AS ENUM ('APOIO', 'CONSULTORIA', 'TECNICA', 'GERENCIAL');

-- CreateEnum
CREATE TYPE "EducationLevel" AS ENUM ('ENSINO_FUNDAMENTAL_COMPLETO', 'CURSANDO_ENSINO_MEDIO', 'ENSINO_MEDIO_COMPLETO', 'CURSANDO_ENSINO_TECNICO', 'ENSINO_TECNICO_COMPLETO', 'CURSANDO_ENSINO_SUPERIOR', 'ENSINO_SUPERIOR_COMPLETO', 'CURSANDO_POS_GRADUACAO', 'POS_GRADUACAO_COMPLETA');

-- CreateEnum
CREATE TYPE "RequirementType" AS ENUM ('PRE_REQUISITO', 'DESEJAVEL', 'POS_REQUISITO');

-- CreateEnum
CREATE TYPE "KnowledgeLevel" AS ENUM ('NOCAO', 'BASICO', 'INTERMEDIARIO', 'AVANCADO');

-- CreateEnum
CREATE TYPE "ExperienceType" AS ENUM ('CARGO', 'AREA');

-- CreateEnum
CREATE TYPE "ActivityFrequency" AS ENUM ('DIARIAMENTE', 'SEMANALMENTE', 'QUINZENALMENTE', 'MENSALMENTE', 'BIMENSAL', 'TRIMESTRAL', 'SEMESTRALMENTE', 'ANUALMENTE', 'SEMPRE_QUE_NECESSARIO');

-- CreateEnum
CREATE TYPE "BehavioralCategory" AS ENUM ('CULTURA_ORGANIZACIONAL', 'ESPECIFICAS_CARGO', 'POSTURA_COMPORTAMENTO');

-- CreateEnum
CREATE TYPE "EvaluationStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'SUBMITTED', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Collaborator" DROP COLUMN "role",
ADD COLUMN     "currentEducationLevel" "EducationLevel",
ADD COLUMN     "currentExperienceYears" DOUBLE PRECISION,
ADD COLUMN     "hireDate" TIMESTAMP(3),
ADD COLUMN     "jobPositionId" TEXT;

-- CreateTable
CREATE TABLE "EvaluationSettings" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "primaryActivityWeight" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
    "secondaryActivityWeight" DOUBLE PRECISION NOT NULL DEFAULT 0.3,
    "organizationalSkillsWeight" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "jobSpecificSkillsWeight" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "minimumEducationBaseScore" DOUBLE PRECISION NOT NULL DEFAULT 0.8,
    "minimumExperienceBaseScore" DOUBLE PRECISION NOT NULL DEFAULT 0.8,
    "targetAchievementForGrowth" DOUBLE PRECISION NOT NULL DEFAULT 0.8,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EvaluationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobPosition" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "immediateSuperiorPosition" TEXT,
    "careerType" "CareerType" NOT NULL,
    "mainObjective" TEXT NOT NULL,
    "additionalBenefits" TEXT,
    "requiresTravel" BOOLEAN NOT NULL DEFAULT false,
    "travelDetails" TEXT,
    "requiresVehicle" BOOLEAN NOT NULL DEFAULT false,
    "vehicleType" TEXT,
    "requiresDriverLicense" BOOLEAN NOT NULL DEFAULT false,
    "driverLicenseType" TEXT,
    "creationDate" TIMESTAMP(3),
    "lastRevisionDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobEducationRequirement" (
    "id" TEXT NOT NULL,
    "jobPositionId" TEXT NOT NULL,
    "requirementType" "RequirementType" NOT NULL,
    "educationLevel" "EducationLevel" NOT NULL,
    "specificArea" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobEducationRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobExperienceRequirement" (
    "id" TEXT NOT NULL,
    "jobPositionId" TEXT NOT NULL,
    "requirementType" "RequirementType" NOT NULL,
    "minimumYears" DOUBLE PRECISION NOT NULL,
    "experienceType" "ExperienceType" NOT NULL,
    "specificArea" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobExperienceRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobKnowledgeRequirement" (
    "id" TEXT NOT NULL,
    "jobPositionId" TEXT NOT NULL,
    "requirementType" "RequirementType" NOT NULL,
    "knowledgeName" TEXT NOT NULL,
    "knowledgeLevel" "KnowledgeLevel" NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobKnowledgeRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobActivity" (
    "id" TEXT NOT NULL,
    "jobPositionId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "frequency" "ActivityFrequency" NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobIndicator" (
    "id" TEXT NOT NULL,
    "jobPositionId" TEXT NOT NULL,
    "activityId" TEXT,
    "name" TEXT NOT NULL,
    "dataSource" TEXT NOT NULL,
    "calculationMethod" TEXT NOT NULL,
    "measurementUnit" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobIndicator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobBehavioralProfile" (
    "id" TEXT NOT NULL,
    "jobPositionId" TEXT NOT NULL,
    "category" "BehavioralCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobBehavioralProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationHierarchy" (
    "id" TEXT NOT NULL,
    "subordinateId" TEXT NOT NULL,
    "supervisorId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrganizationHierarchy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluationScale" (
    "id" TEXT NOT NULL,
    "percentage" INTEGER NOT NULL,
    "efficiencyDescription" TEXT NOT NULL,
    "effectivenessDescription" TEXT NOT NULL,
    "skillDescription" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvaluationScale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformanceEvaluation" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "collaboratorId" TEXT NOT NULL,
    "jobPositionId" TEXT NOT NULL,
    "submissionDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3) NOT NULL,
    "evaluationPeriodStart" TIMESTAMP(3) NOT NULL,
    "evaluationPeriodEnd" TIMESTAMP(3) NOT NULL,
    "currentEducationLevel" "EducationLevel",
    "experienceYears" DOUBLE PRECISION,
    "educationScore" DOUBLE PRECISION,
    "experienceScore" DOUBLE PRECISION,
    "activitiesScore" DOUBLE PRECISION,
    "indicatorsScore" DOUBLE PRECISION,
    "skillsScore" DOUBLE PRECISION,
    "finalScore" DOUBLE PRECISION,
    "status" "EvaluationStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PerformanceEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityEvaluation" (
    "id" TEXT NOT NULL,
    "evaluationId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "efficiencyPercentage" INTEGER NOT NULL,
    "effectivenessPercentage" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "finalScore" DOUBLE PRECISION NOT NULL,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndicatorEvaluation" (
    "id" TEXT NOT NULL,
    "evaluationId" TEXT NOT NULL,
    "indicatorId" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "achievementPercentage" DOUBLE PRECISION NOT NULL,
    "evaluationPercentage" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "finalScore" DOUBLE PRECISION NOT NULL,
    "classification" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IndicatorEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileEvaluation" (
    "id" TEXT NOT NULL,
    "evaluationId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "percentage" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "finalScore" DOUBLE PRECISION NOT NULL,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfileEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EvaluationSettings_companyId_key" ON "EvaluationSettings"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationHierarchy_subordinateId_supervisorId_startDate_key" ON "OrganizationHierarchy"("subordinateId", "supervisorId", "startDate");

-- CreateIndex
CREATE UNIQUE INDEX "EvaluationScale_percentage_key" ON "EvaluationScale"("percentage");

-- AddForeignKey
ALTER TABLE "EvaluationSettings" ADD CONSTRAINT "EvaluationSettings_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collaborator" ADD CONSTRAINT "Collaborator_jobPositionId_fkey" FOREIGN KEY ("jobPositionId") REFERENCES "JobPosition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobPosition" ADD CONSTRAINT "JobPosition_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobEducationRequirement" ADD CONSTRAINT "JobEducationRequirement_jobPositionId_fkey" FOREIGN KEY ("jobPositionId") REFERENCES "JobPosition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobExperienceRequirement" ADD CONSTRAINT "JobExperienceRequirement_jobPositionId_fkey" FOREIGN KEY ("jobPositionId") REFERENCES "JobPosition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobKnowledgeRequirement" ADD CONSTRAINT "JobKnowledgeRequirement_jobPositionId_fkey" FOREIGN KEY ("jobPositionId") REFERENCES "JobPosition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobActivity" ADD CONSTRAINT "JobActivity_jobPositionId_fkey" FOREIGN KEY ("jobPositionId") REFERENCES "JobPosition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobIndicator" ADD CONSTRAINT "JobIndicator_jobPositionId_fkey" FOREIGN KEY ("jobPositionId") REFERENCES "JobPosition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobIndicator" ADD CONSTRAINT "JobIndicator_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "JobActivity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobBehavioralProfile" ADD CONSTRAINT "JobBehavioralProfile_jobPositionId_fkey" FOREIGN KEY ("jobPositionId") REFERENCES "JobPosition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationHierarchy" ADD CONSTRAINT "OrganizationHierarchy_subordinateId_fkey" FOREIGN KEY ("subordinateId") REFERENCES "Collaborator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationHierarchy" ADD CONSTRAINT "OrganizationHierarchy_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "Collaborator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceEvaluation" ADD CONSTRAINT "PerformanceEvaluation_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceEvaluation" ADD CONSTRAINT "PerformanceEvaluation_collaboratorId_fkey" FOREIGN KEY ("collaboratorId") REFERENCES "Collaborator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceEvaluation" ADD CONSTRAINT "PerformanceEvaluation_jobPositionId_fkey" FOREIGN KEY ("jobPositionId") REFERENCES "JobPosition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityEvaluation" ADD CONSTRAINT "ActivityEvaluation_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "PerformanceEvaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityEvaluation" ADD CONSTRAINT "ActivityEvaluation_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "JobActivity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndicatorEvaluation" ADD CONSTRAINT "IndicatorEvaluation_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "PerformanceEvaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndicatorEvaluation" ADD CONSTRAINT "IndicatorEvaluation_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "JobIndicator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileEvaluation" ADD CONSTRAINT "ProfileEvaluation_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "PerformanceEvaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileEvaluation" ADD CONSTRAINT "ProfileEvaluation_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "JobBehavioralProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
