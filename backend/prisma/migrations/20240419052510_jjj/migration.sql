/*
  Warnings:

  - Added the required column `negative_points` to the `quiz_choice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `positive_points` to the `quiz_choice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "quiz_choice" ADD COLUMN     "negative_points" INTEGER NOT NULL,
ADD COLUMN     "positive_points" INTEGER NOT NULL;
