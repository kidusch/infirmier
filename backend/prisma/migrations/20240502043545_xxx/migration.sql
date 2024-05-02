-- CreateTable
CREATE TABLE "user_quiz" (
    "id" SERIAL NOT NULL,
    "time" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "quiz_id" INTEGER NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_case_study" (
    "id" SERIAL NOT NULL,
    "time" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "case_study_id" INTEGER NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_case_study_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_quiz_user_id_quiz_id_key" ON "user_quiz"("user_id", "quiz_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_case_study_user_id_case_study_id_key" ON "user_case_study"("user_id", "case_study_id");

-- AddForeignKey
ALTER TABLE "user_quiz" ADD CONSTRAINT "user_quiz_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_quiz" ADD CONSTRAINT "user_quiz_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quiz"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_case_study" ADD CONSTRAINT "user_case_study_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_case_study" ADD CONSTRAINT "user_case_study_case_study_id_fkey" FOREIGN KEY ("case_study_id") REFERENCES "case_study"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
