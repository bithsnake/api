/*
  Warnings:

  - You are about to drop the column `appointmentId` on the `UserEventLog` table. All the data in the column will be lost.
  - You are about to drop the `ReminderNotification` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ReminderStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "ReminderType" AS ENUM ('APPOINTMENT_REMINDER', 'USER_REMINDER', 'BILLING_REMINDER');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EventType" ADD VALUE 'REMINDER';
ALTER TYPE "EventType" ADD VALUE 'DELETED';

-- DropForeignKey
ALTER TABLE "ReminderNotification" DROP CONSTRAINT "ReminderNotification_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "UserEventLog" DROP CONSTRAINT "UserEventLog_appointmentId_fkey";

-- DropIndex
DROP INDEX "UserEventLog_appointmentId_idx";

-- AlterTable
ALTER TABLE "UserEventLog" DROP COLUMN "appointmentId",
ADD COLUMN     "eventType" "EventType" NOT NULL DEFAULT 'CREATED',
ADD COLUMN     "userId" INTEGER;

-- DropTable
DROP TABLE "ReminderNotification";

-- CreateTable
CREATE TABLE "Reminder" (
    "id" SERIAL NOT NULL,
    "appointmentId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppointmentEventLog" (
    "id" SERIAL NOT NULL,
    "appointmentId" INTEGER NOT NULL,
    "eventType" "EventType" NOT NULL DEFAULT 'CREATED',
    "event" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppointmentEventLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillingEventLog" (
    "id" SERIAL NOT NULL,
    "billingId" INTEGER NOT NULL,
    "eventType" "EventType" NOT NULL DEFAULT 'CREATED',
    "event" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillingEventLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReminderEventLog" (
    "id" SERIAL NOT NULL,
    "reminderId" INTEGER NOT NULL,
    "eventType" "EventType" NOT NULL DEFAULT 'CREATED',
    "event" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReminderEventLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Reminder_appointmentId_idx" ON "Reminder"("appointmentId");

-- CreateIndex
CREATE INDEX "AppointmentEventLog_appointmentId_idx" ON "AppointmentEventLog"("appointmentId");

-- CreateIndex
CREATE INDEX "BillingEventLog_billingId_idx" ON "BillingEventLog"("billingId");

-- CreateIndex
CREATE INDEX "ReminderEventLog_reminderId_idx" ON "ReminderEventLog"("reminderId");

-- CreateIndex
CREATE INDEX "User_specializationId_idx" ON "User"("specializationId");

-- CreateIndex
CREATE INDEX "UserEventLog_userId_idx" ON "UserEventLog"("userId");

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentEventLog" ADD CONSTRAINT "AppointmentEventLog_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingEventLog" ADD CONSTRAINT "BillingEventLog_billingId_fkey" FOREIGN KEY ("billingId") REFERENCES "Billing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReminderEventLog" ADD CONSTRAINT "ReminderEventLog_reminderId_fkey" FOREIGN KEY ("reminderId") REFERENCES "Reminder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEventLog" ADD CONSTRAINT "UserEventLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
