-- DropIndex
DROP INDEX "ReminderNotification_appointmentId_key";

-- DropIndex
DROP INDEX "UserEventLog_appointmentId_key";

-- AlterTable
ALTER TABLE "Specialization" ALTER COLUMN "updatedAt" DROP DEFAULT;
