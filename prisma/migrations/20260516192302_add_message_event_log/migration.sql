-- CreateTable
CREATE TABLE "MessageEventLog" (
    "id" SERIAL NOT NULL,
    "messageId" INTEGER NOT NULL,
    "eventType" "EventType" NOT NULL DEFAULT 'CREATED',
    "event" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessageEventLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MessageEventLog_messageId_idx" ON "MessageEventLog"("messageId");

-- AddForeignKey
ALTER TABLE "MessageEventLog" ADD CONSTRAINT "MessageEventLog_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
