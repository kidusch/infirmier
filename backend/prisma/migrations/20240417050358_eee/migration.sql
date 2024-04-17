/*
  Warnings:

  - You are about to drop the `course` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "course" DROP CONSTRAINT "course_topic_id_fkey";

-- AlterTable
ALTER TABLE "topic" ADD COLUMN     "course" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "course";
