/*
  Warnings:

  - Added the required column `course_id` to the `card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `course_id` to the `case_study` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topic_id` to the `course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `course_id` to the `quiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "card" ADD COLUMN     "course_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "case_study" ADD COLUMN     "course_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "course" ADD COLUMN     "topic_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "quiz" ADD COLUMN     "course_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topic"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "card" ADD CONSTRAINT "card_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "case_study" ADD CONSTRAINT "case_study_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
