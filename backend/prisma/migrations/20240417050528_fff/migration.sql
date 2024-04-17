/*
  Warnings:

  - Added the required column `title` to the `card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `case_study` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `quiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "card" ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "case_study" ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "quiz" ADD COLUMN     "title" TEXT NOT NULL;
