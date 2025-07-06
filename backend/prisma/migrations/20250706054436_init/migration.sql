-- CreateTable
CREATE TABLE "Threat" (
    "id" SERIAL NOT NULL,
    "Threat_Category" TEXT NOT NULL,
    "IOCs" TEXT[],
    "Threat_Actor" TEXT,
    "Attack_Vector" TEXT,
    "Geography" TEXT,
    "Sentiment" DOUBLE PRECISION,
    "Severity_Score" INTEGER NOT NULL,
    "Predicted_Threat" TEXT,
    "Suggested_Action" TEXT,
    "Risk_Level" TEXT,
    "Cleaned_Threat_Description" TEXT,
    "Keywords" TEXT[],
    "Named_Entities" TEXT[],
    "Topic_Model" TEXT,
    "Word_Count" INTEGER NOT NULL,

    CONSTRAINT "Threat_pkey" PRIMARY KEY ("id")
);
