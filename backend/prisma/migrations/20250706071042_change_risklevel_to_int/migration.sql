/*
  Warnings:

  - Added the required column `Risk_Level` to the `Threat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Threat" DROP COLUMN "Risk_Level",
ADD COLUMN     "Risk_Level" INTEGER NOT NULL;
