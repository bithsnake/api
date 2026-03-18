/*
  Warnings:

  - The primary key for the `Appointment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Appointment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Billing` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Billing` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ReminderNotification` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ReminderNotification` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `UserEventLog` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `UserEventLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `appointmentId` on the `Billing` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `appointmentId` on the `ReminderNotification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `appointmentId` on the `UserEventLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Billing" DROP CONSTRAINT "Billing_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "ReminderNotification" DROP CONSTRAINT "ReminderNotification_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "UserEventLog" DROP CONSTRAINT "UserEventLog_appointmentId_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Billing" DROP CONSTRAINT "Billing_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "appointmentId",
ADD COLUMN     "appointmentId" INTEGER NOT NULL,
ADD CONSTRAINT "Billing_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ReminderNotification" DROP CONSTRAINT "ReminderNotification_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "appointmentId",
ADD COLUMN     "appointmentId" INTEGER NOT NULL,
ADD CONSTRAINT "ReminderNotification_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "UserEventLog" DROP CONSTRAINT "UserEventLog_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "appointmentId",
ADD COLUMN     "appointmentId" INTEGER NOT NULL,
ADD CONSTRAINT "UserEventLog_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Billing_appointmentId_key" ON "Billing"("appointmentId");

-- CreateIndex
CREATE INDEX "ReminderNotification_appointmentId_idx" ON "ReminderNotification"("appointmentId");

-- CreateIndex
CREATE INDEX "UserEventLog_appointmentId_idx" ON "UserEventLog"("appointmentId");

-- AddForeignKey
ALTER TABLE "Billing" ADD CONSTRAINT "Billing_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReminderNotification" ADD CONSTRAINT "ReminderNotification_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEventLog" ADD CONSTRAINT "UserEventLog_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
