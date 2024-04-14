-- CreateTable
CREATE TABLE "ue" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,

    CONSTRAINT "ue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_ue" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "ue_id" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,

    CONSTRAINT "sub_ue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topic" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "sub_ue_id" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,

    CONSTRAINT "topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rank" INTEGER NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "card" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rank" INTEGER NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_study" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rank" INTEGER NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "case_study_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rank" INTEGER NOT NULL,

    CONSTRAINT "quiz_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sub_ue" ADD CONSTRAINT "sub_ue_ue_id_fkey" FOREIGN KEY ("ue_id") REFERENCES "ue"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "topic" ADD CONSTRAINT "topic_sub_ue_id_fkey" FOREIGN KEY ("sub_ue_id") REFERENCES "sub_ue"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
