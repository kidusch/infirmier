/*
  Warnings:

  - You are about to drop the column `course_id` on the `card` table. All the data in the column will be lost.
  - You are about to drop the column `course_id` on the `case_study` table. All the data in the column will be lost.
  - You are about to drop the column `course_id` on the `quiz` table. All the data in the column will be lost.
  - Added the required column `topic_id` to the `card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topic_id` to the `case_study` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topic_id` to the `quiz` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "card" DROP CONSTRAINT "card_course_id_fkey";

-- DropForeignKey
ALTER TABLE "case_study" DROP CONSTRAINT "case_study_course_id_fkey";

-- DropForeignKey
ALTER TABLE "quiz" DROP CONSTRAINT "quiz_course_id_fkey";

-- AlterTable
ALTER TABLE "card" DROP COLUMN "course_id",
ADD COLUMN     "topic_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "case_study" DROP COLUMN "course_id",
ADD COLUMN     "topic_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "quiz" DROP COLUMN "course_id",
ADD COLUMN     "topic_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "card" ADD CONSTRAINT "card_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topic"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "case_study" ADD CONSTRAINT "case_study_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topic"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topic"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
