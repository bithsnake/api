-- AlterTable
ALTER TABLE "Reminder" ADD COLUMN     "billingId" INTEGER,
ADD COLUMN     "scheduledFor" TIMESTAMP(3),
ADD COLUMN     "sentAt" TIMESTAMP(3),
ADD COLUMN     "status" "ReminderStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "userId" INTEGER,
ALTER COLUMN "appointmentId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Reminder_billingId_idx" ON "Reminder"("billingId");

-- CreateIndex
CREATE INDEX "Reminder_userId_idx" ON "Reminder"("userId");

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_billingId_fkey" FOREIGN KEY ("billingId") REFERENCES "Billing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
