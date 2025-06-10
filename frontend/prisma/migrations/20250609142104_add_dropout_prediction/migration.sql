-- CreateTable
CREATE TABLE "dropoutPrediction" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "prediction" TEXT NOT NULL,
    "probability" DOUBLE PRECISION NOT NULL,
    "predictionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dropoutPrediction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dropoutPrediction_studentId_predictionDate_key" ON "dropoutPrediction"("studentId", "predictionDate");
