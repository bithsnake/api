-- CreateEnum
CREATE TYPE "BillingStatus" AS ENUM ('DRAFT', 'INVOICED', 'PAID', 'CANCELED', 'DELETED');

-- AlterTable
ALTER TABLE "Billing" ADD COLUMN     "status" "BillingStatus" NOT NULL DEFAULT 'DRAFT';
