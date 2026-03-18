-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'NEW';

-- AlterTable
ALTER TABLE "Specialization" ADD COLUMN     "type" "SpecializationType",
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
