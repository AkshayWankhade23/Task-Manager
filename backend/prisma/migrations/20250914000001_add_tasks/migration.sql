-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('high', 'medium', 'low', 'no_priority');

-- CreateEnum
CREATE TYPE "ReminderType" AS ENUM ('on_time', 'custom');

-- CreateEnum
CREATE TYPE "RepeatType" AS ENUM ('none', 'daily', 'weekly', 'monthly', 'yearly', 'weekdays', 'weekends', 'custom');

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "taskName" TEXT NOT NULL,
    "priority" "Priority" NOT NULL DEFAULT 'no_priority',
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "reminder" "ReminderType" NOT NULL DEFAULT 'on_time',
    "reminderTimeUnit" TEXT,
    "reminderCustomDays" INTEGER,
    "reminderCustomWeeks" INTEGER,
    "reminderCustomTime" TEXT,
    "repeat" "RepeatType" NOT NULL DEFAULT 'none',
    "repeatType" TEXT,
    "repeatFrequency" TEXT,
    "repeatCount" INTEGER,
    "skipWeekends" BOOLEAN DEFAULT false,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;