-- A vinculação do aparelho pertence a cada usuário; não deve ser única entre todos os usuários.
ALTER TABLE `users` DROP INDEX `deviceId`;
