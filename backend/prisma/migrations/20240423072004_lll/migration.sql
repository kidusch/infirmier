/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `user_topic` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "user_topic" DROP CONSTRAINT "user_topic_user_id_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "user_topic_user_id_key" ON "user_topic"("user_id");

-- AddForeignKey
ALTER TABLE "user_topic" ADD CONSTRAINT "user_topic_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
