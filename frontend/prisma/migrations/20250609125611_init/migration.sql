-- CreateTable
CREATE TABLE "fact_dropout" (
    "id" SERIAL NOT NULL,
    "studentName" TEXT NOT NULL,
    "predictedDropout" BOOLEAN NOT NULL,
    "predictionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fact_dropout_pkey" PRIMARY KEY ("id")
);
