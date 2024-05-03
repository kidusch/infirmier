/*
  Warnings:

  - Added the required column `answer` to the `user_case_study` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_case_study" ADD COLUMN     "answer" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "user_quiz_choice" (
    "id" SERIAL NOT NULL,
    "time" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "quiz_choice_id" INTEGER NOT NULL,

    CONSTRAINT "user_quiz_choice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_quiz_choice_user_id_quiz_choice_id_key" ON "user_quiz_choice"("user_id", "quiz_choice_id");

-- AddForeignKey
ALTER TABLE "user_quiz_choice" ADD CONSTRAINT "user_quiz_choice_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_quiz_choice" ADD CONSTRAINT "user_quiz_choice_quiz_choice_id_fkey" FOREIGN KEY ("quiz_choice_id") REFERENCES "quiz_choice"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
