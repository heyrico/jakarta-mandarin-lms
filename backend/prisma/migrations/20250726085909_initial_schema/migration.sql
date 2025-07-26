/*
  Warnings:

  - You are about to drop the column `code` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `customerAddress` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `customerContact` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `customerName` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `customerType` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `items` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `paymentLink` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `program` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `nama` on the `kelas` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `kelas` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[invoiceNumber]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dueDate` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiceNumber` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentName` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Journal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Journal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `JournalEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `Kelas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxStudents` to the `Kelas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Kelas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schedule` to the `Kelas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Kelas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacher` to the `Kelas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Kelas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Account_code_key` ON `account`;

-- AlterTable
ALTER TABLE `account` DROP COLUMN `code`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `invoice` DROP COLUMN `customerAddress`,
    DROP COLUMN `customerContact`,
    DROP COLUMN `customerName`,
    DROP COLUMN `customerType`,
    DROP COLUMN `date`,
    DROP COLUMN `items`,
    DROP COLUMN `paymentLink`,
    DROP COLUMN `program`,
    DROP COLUMN `total`,
    ADD COLUMN `amount` DOUBLE NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `dueDate` DATETIME(3) NOT NULL,
    ADD COLUMN `invoiceNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `studentName` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `journal` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `total` DOUBLE NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `journalentry` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `kelas` DROP COLUMN `nama`,
    DROP COLUMN `status`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `endDate` DATETIME(3) NOT NULL,
    ADD COLUMN `maxStudents` INTEGER NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `schedule` VARCHAR(191) NOT NULL,
    ADD COLUMN `startDate` DATETIME(3) NOT NULL,
    ADD COLUMN `teacher` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `birthDate` DATETIME(3) NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `gender` VARCHAR(191) NULL,
    ADD COLUMN `grade` VARCHAR(191) NULL,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `joinDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `parentName` VARCHAR(191) NULL,
    ADD COLUMN `parentPhone` VARCHAR(191) NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL DEFAULT 'password123',
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `school` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `CreditPackage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `price` DOUBLE NOT NULL,
    `creditHours` INTEGER NOT NULL,
    `packageType` VARCHAR(191) NOT NULL DEFAULT 'SATUAN',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentCredit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `creditPackageId` INTEGER NOT NULL,
    `remainingHours` DOUBLE NOT NULL DEFAULT 0,
    `totalHours` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `purchaseDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiryDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CreditTransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentCreditId` INTEGER NOT NULL,
    `transactionType` VARCHAR(191) NOT NULL,
    `hours` DOUBLE NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `referenceId` VARCHAR(191) NULL,
    `referenceType` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Invoice_invoiceNumber_key` ON `Invoice`(`invoiceNumber`);

-- AddForeignKey
ALTER TABLE `StudentCredit` ADD CONSTRAINT `StudentCredit_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentCredit` ADD CONSTRAINT `StudentCredit_creditPackageId_fkey` FOREIGN KEY (`creditPackageId`) REFERENCES `CreditPackage`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CreditTransaction` ADD CONSTRAINT `CreditTransaction_studentCreditId_fkey` FOREIGN KEY (`studentCreditId`) REFERENCES `StudentCredit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
