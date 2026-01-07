-- CreateEnum
CREATE TYPE "DogStatus" AS ENUM ('Available', 'Pending', 'Adopted');

-- AlterTable
ALTER TABLE "Dog" ADD COLUMN     "status" "DogStatus" NOT NULL DEFAULT 'Available';
