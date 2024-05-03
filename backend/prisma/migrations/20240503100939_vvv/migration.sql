/*
  Warnings:

  - Added the required column `answer` to the `user_quiz_choice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_quiz_choice" ADD COLUMN     "answer" BOOLEAN NOT NULL;
