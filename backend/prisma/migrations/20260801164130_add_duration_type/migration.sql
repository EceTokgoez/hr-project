-- CreateEnum
CREATE TYPE "LeaveDurationType" AS ENUM ('DAILY', 'HOURLY');

-- AlterTable
ALTER TABLE "LeaveRequest" ADD COLUMN     "durationType" "LeaveDurationType" NOT NULL DEFAULT 'DAILY';
