/*
  Warnings:

  - Made the column `github_user` on table `instructor` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "instructor" ALTER COLUMN "github_user" SET NOT NULL;
