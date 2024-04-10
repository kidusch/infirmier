-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('admin', 'student');

-- CreateTable
CREATE TABLE "user_action" (
    "id" SERIAL NOT NULL,
    "time" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "action" TEXT NOT NULL,

    CONSTRAINT "user_action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT,
    "password" TEXT,
    "type" "UserType" NOT NULL DEFAULT 'student',
    "google_id" TEXT,
    "name" TEXT,
    "picture" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_sub_unique" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "uses_google_id_unique" ON "user"("google_id");

-- AddForeignKey
ALTER TABLE "user_action" ADD CONSTRAINT "user_action_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
