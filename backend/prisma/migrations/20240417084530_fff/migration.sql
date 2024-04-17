/*
  Warnings:

  - You are about to drop the column `course` on the `topic` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "topic" DROP COLUMN "course",
ADD COLUMN     "course_content" TEXT NOT NULL DEFAULT '';
