ALTER TABLE `users`
  ADD COLUMN `username` varchar(80) UNIQUE,
  ADD COLUMN `passwordHash` text,
  ADD COLUMN `licenseKeyHash` varchar(128) UNIQUE,
  ADD COLUMN `licenseExpiresAt` timestamp NULL,
  ADD COLUMN `licenseStatus` enum('active','revoked') NOT NULL DEFAULT 'active',
  ADD COLUMN `deviceId` varchar(128) UNIQUE;
