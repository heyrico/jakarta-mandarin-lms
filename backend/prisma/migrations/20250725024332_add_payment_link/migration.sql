-- AlterTable
ALTER TABLE `invoice` ADD COLUMN `customerAddress` VARCHAR(191) NULL,
    ADD COLUMN `customerContact` VARCHAR(191) NULL,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'DRAFT';
