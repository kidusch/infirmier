/*
  Warnings:

  - Added the required column `question` to the `quiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "quiz" ADD COLUMN     "question" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "quiz_choice" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quiz_id" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "answer" BOOLEAN NOT NULL,
    "comment" TEXT NOT NULL,

    CONSTRAINT "quiz_choice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "quiz_choice" ADD CONSTRAINT "quiz_choice_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quiz"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
