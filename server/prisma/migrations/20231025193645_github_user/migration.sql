/*
  Warnings:

  - You are about to drop the column `gitHub_username` on the `instructor` table. All the data in the column will be lost.
  - Added the required column `github_user` to the `instructor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "instructor" DROP COLUMN "gitHub_username",
ADD COLUMN     "github_user" TEXT;
