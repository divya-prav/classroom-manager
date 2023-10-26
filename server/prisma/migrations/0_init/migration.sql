-- CreateTable
CREATE TABLE "instructor" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "gitHub_username" TEXT ,
    "password" TEXT NOT NULL,

    CONSTRAINT "instructor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cohort" TEXT NOT NULL,
    "instructorid" INTEGER NOT NULL,

    CONSTRAINT "student_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "instructor_username_key" ON "instructor"("username");

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_instructorid_fkey" FOREIGN KEY ("instructorid") REFERENCES "instructor"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

