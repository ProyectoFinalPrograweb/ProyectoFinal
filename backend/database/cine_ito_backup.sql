CREATE DATABASE IF NOT EXISTS `cine_ito`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `cine_ito`;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `favoritos`;
DROP TABLE IF EXISTS `resenas`;
DROP TABLE IF EXISTS `peliculas`;
DROP TABLE IF EXISTS `failed_jobs`;
DROP TABLE IF EXISTS `job_batches`;
DROP TABLE IF EXISTS `jobs`;
DROP TABLE IF EXISTS `cache_locks`;
DROP TABLE IF EXISTS `cache`;
DROP TABLE IF EXISTS `sessions`;
DROP TABLE IF EXISTS `password_reset_tokens`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `generos`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `migrations`;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `migrations` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` VARCHAR(255) NOT NULL,
  `batch` INT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `roles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `descripcion` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_nombre_unique` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `generos` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `descripcion` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `generos_nombre_unique` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `email_verified_at` TIMESTAMP NULL,
  `password` VARCHAR(255) NOT NULL,
  `role_id` BIGINT UNSIGNED NOT NULL,
  `remember_token` VARCHAR(100) NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_role_id_foreign` (`role_id`),
  CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `password_reset_tokens` (
  `email` VARCHAR(255) NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `sessions` (
  `id` VARCHAR(255) NOT NULL,
  `user_id` BIGINT UNSIGNED NULL,
  `ip_address` VARCHAR(45) NULL,
  `user_agent` TEXT NULL,
  `payload` LONGTEXT NOT NULL,
  `last_activity` INT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cache` (
  `key` VARCHAR(255) NOT NULL,
  `value` MEDIUMTEXT NOT NULL,
  `expiration` INT NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cache_locks` (
  `key` VARCHAR(255) NOT NULL,
  `owner` VARCHAR(255) NOT NULL,
  `expiration` INT NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `jobs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue` VARCHAR(255) NOT NULL,
  `payload` LONGTEXT NOT NULL,
  `attempts` TINYINT UNSIGNED NOT NULL,
  `reserved_at` INT UNSIGNED NULL,
  `available_at` INT UNSIGNED NOT NULL,
  `created_at` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `job_batches` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `total_jobs` INT NOT NULL,
  `pending_jobs` INT NOT NULL,
  `failed_jobs` INT NOT NULL,
  `failed_job_ids` LONGTEXT NOT NULL,
  `options` MEDIUMTEXT NULL,
  `cancelled_at` INT NULL,
  `created_at` INT NOT NULL,
  `finished_at` INT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `failed_jobs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` VARCHAR(255) NOT NULL,
  `connection` TEXT NOT NULL,
  `queue` TEXT NOT NULL,
  `payload` LONGTEXT NOT NULL,
  `exception` LONGTEXT NOT NULL,
  `failed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `peliculas` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(255) NOT NULL,
  `director` VARCHAR(255) NOT NULL,
  `anio` SMALLINT UNSIGNED NOT NULL,
  `sinopsis` TEXT NOT NULL,
  `imagen` VARCHAR(255) NULL,
  `genero_id` BIGINT UNSIGNED NOT NULL,
  `usuario_id` BIGINT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  KEY `peliculas_genero_id_foreign` (`genero_id`),
  KEY `peliculas_usuario_id_foreign` (`usuario_id`),
  CONSTRAINT `peliculas_genero_id_foreign` FOREIGN KEY (`genero_id`) REFERENCES `generos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `peliculas_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `resenas` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `comentario` TEXT NOT NULL,
  `calificacion` DECIMAL(3,1) NOT NULL,
  `usuario_id` BIGINT UNSIGNED NOT NULL,
  `pelicula_id` BIGINT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `resenas_usuario_id_pelicula_id_unique` (`usuario_id`, `pelicula_id`),
  KEY `resenas_pelicula_id_foreign` (`pelicula_id`),
  CONSTRAINT `resenas_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `resenas_pelicula_id_foreign` FOREIGN KEY (`pelicula_id`) REFERENCES `peliculas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `favoritos` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `usuario_id` BIGINT UNSIGNED NOT NULL,
  `pelicula_id` BIGINT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `favoritos_usuario_id_pelicula_id_unique` (`usuario_id`, `pelicula_id`),
  KEY `favoritos_pelicula_id_foreign` (`pelicula_id`),
  CONSTRAINT `favoritos_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favoritos_pelicula_id_foreign` FOREIGN KEY (`pelicula_id`) REFERENCES `peliculas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0000_01_01_000000_create_roles_table', 1),
(2, '0000_01_01_000000_create_users_table', 1),
(3, '0001_01_01_000001_create_cache_table', 1),
(4, '0001_01_01_000002_create_jobs_table', 1),
(5, '2026_07_26_204031_create_generos_table', 1),
(6, '2026_07_26_204031_create_peliculas_table', 1),
(7, '2026_07_26_204032_create_resenas_table', 1),
(8, '2026_07_26_204032_create_favoritos_table', 1);

INSERT INTO `roles` (`id`, `nombre`, `descripcion`, `created_at`, `updated_at`) VALUES
(1, 'Administrador', 'Acceso total al sistema', NOW(), NOW()),
(2, 'Moderador', 'Revision de peliculas y resenas', NOW(), NOW()),
(3, 'Cinefilo', 'Usuario estandar de la comunidad', NOW(), NOW());

INSERT INTO `generos` (`id`, `nombre`, `descripcion`, `created_at`, `updated_at`) VALUES
(1, 'Drama', 'Historias centradas en conflictos humanos y sociales', NOW(), NOW()),
(2, 'Comedia', 'Peliculas con tono ligero, humor o satira', NOW(), NOW()),
(3, 'Terror', 'Relatos de miedo, suspenso y elementos sobrenaturales', NOW(), NOW()),
(4, 'Ciencia ficcion', 'Futuros posibles, tecnologia y especulacion social', NOW(), NOW()),
(5, 'Documental', 'Narrativas basadas en hechos reales', NOW(), NOW()),
(6, 'Romance', 'Historias sobre relaciones afectivas', NOW(), NOW()),
(7, 'Fantasia', 'Mundos imaginarios y elementos magicos', NOW(), NOW()),
(8, 'Accion', 'Ritmo rapido, persecuciones y escenas de riesgo', NOW(), NOW()),
(9, 'Suspenso', 'Tension, misterio y giros narrativos', NOW(), NOW()),
(10, 'Animacion', 'Obras creadas con tecnicas animadas', NOW(), NOW());

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role_id`, `created_at`, `updated_at`) VALUES
(1, 'Admin CinemaITO', 'admin@cinemaito.com', '$2y$10$J0yVVG7lpkhCs/EHcNFLDue7G8r7hIw7ZOPrgiGF5wnTbTu26t4SC', 1, NOW(), NOW()),
(2, 'Moderador ITO', 'mod@cinemaito.com', '$2y$10$XDL0ovGixtV.eEf56IsgXOAJtoWSd9TDEtPZ.oVRA/LtXIyKBtnpa', 2, NOW(), NOW()),
(3, 'Usuario Cinefilo', 'user@cinemaito.com', '$2y$10$t5A9uaZgMJPJhYr5X36JN.clJEJVO1nlyTad2Ue/3YGIn5Kzg.MES', 3, NOW(), NOW()),
(4, 'Developer Evaluador', 'developer@cinemaito.com', '$2y$10$qS.T.AfKT5.HfWk/IfjP4eeswceB5KPrAXTizomMifS056Rnw9Rya', 1, NOW(), NOW()),
(5, 'Ana Lopez', 'ana@cinemaito.com', '$2y$10$t5A9uaZgMJPJhYr5X36JN.clJEJVO1nlyTad2Ue/3YGIn5Kzg.MES', 3, NOW(), NOW()),
(6, 'Carlos Ruiz', 'carlos@cinemaito.com', '$2y$10$t5A9uaZgMJPJhYr5X36JN.clJEJVO1nlyTad2Ue/3YGIn5Kzg.MES', 3, NOW(), NOW()),
(7, 'Diana Perez', 'diana@cinemaito.com', '$2y$10$t5A9uaZgMJPJhYr5X36JN.clJEJVO1nlyTad2Ue/3YGIn5Kzg.MES', 3, NOW(), NOW()),
(8, 'Eduardo Vega', 'eduardo@cinemaito.com', '$2y$10$t5A9uaZgMJPJhYr5X36JN.clJEJVO1nlyTad2Ue/3YGIn5Kzg.MES', 3, NOW(), NOW()),
(9, 'Fernanda Soto', 'fernanda@cinemaito.com', '$2y$10$t5A9uaZgMJPJhYr5X36JN.clJEJVO1nlyTad2Ue/3YGIn5Kzg.MES', 3, NOW(), NOW()),
(10, 'Gabriel Torres', 'gabriel@cinemaito.com', '$2y$10$t5A9uaZgMJPJhYr5X36JN.clJEJVO1nlyTad2Ue/3YGIn5Kzg.MES', 2, NOW(), NOW()),
(11, 'Hilda Ramos', 'hilda@cinemaito.com', '$2y$10$t5A9uaZgMJPJhYr5X36JN.clJEJVO1nlyTad2Ue/3YGIn5Kzg.MES', 3, NOW(), NOW()),
(12, 'Ivan Castillo', 'ivan@cinemaito.com', '$2y$10$t5A9uaZgMJPJhYr5X36JN.clJEJVO1nlyTad2Ue/3YGIn5Kzg.MES', 3, NOW(), NOW());

INSERT INTO `peliculas` (`id`, `titulo`, `director`, `anio`, `sinopsis`, `imagen`, `genero_id`, `usuario_id`, `created_at`, `updated_at`) VALUES
(1, 'Amores Perros', 'Alejandro Gonzalez Inarritu', 2000, 'Tres historias se cruzan despues de un accidente en la Ciudad de Mexico.', NULL, 1, 2, NOW(), NOW()),
(2, 'Roma', 'Alfonso Cuaron', 2018, 'Retrato intimo de una familia y su trabajadora domestica en los anos setenta.', NULL, 1, 1, NOW(), NOW()),
(3, 'Macario', 'Roberto Gavaldon', 1960, 'Un campesino hambriento se encuentra con la Muerte durante Dia de Muertos.', NULL, 7, 1, NOW(), NOW()),
(4, 'Cronos', 'Guillermo del Toro', 1993, 'Un anticuario descubre un artefacto que ofrece vida eterna a un alto costo.', NULL, 3, 2, NOW(), NOW()),
(5, 'Gueros', 'Alonso Ruizpalacios', 2014, 'Dos jovenes recorren la ciudad durante una huelga universitaria.', NULL, 2, 1, NOW(), NOW()),
(6, 'Noche de Fuego', 'Tatiana Huezo', 2021, 'Tres ninas crecen en una comunidad marcada por la violencia.', NULL, 1, 1, NOW(), NOW()),
(7, 'Temporada de Patos', 'Fernando Eimbcke', 2004, 'Un domingo sin adultos transforma la rutina de dos adolescentes.', NULL, 2, 2, NOW(), NOW()),
(8, 'La Jaula de Oro', 'Diego Quemada-Diez', 2013, 'Jovenes migrantes viajan hacia el norte buscando una nueva vida.', NULL, 1, 1, NOW(), NOW()),
(9, 'Ya No Estoy Aqui', 'Fernando Frias', 2019, 'Un joven de Monterrey enfrenta el exilio y la nostalgia por su barrio.', NULL, 1, 1, NOW(), NOW()),
(10, 'Sueno en Otro Idioma', 'Ernesto Contreras', 2017, 'Un linguista intenta rescatar una lengua indigena a punto de desaparecer.', NULL, 7, 2, NOW(), NOW()),
(11, 'Museo', 'Alonso Ruizpalacios', 2018, 'Dos estudiantes planean el robo de piezas arqueologicas del museo nacional.', NULL, 9, 1, NOW(), NOW()),
(12, 'El Infierno', 'Luis Estrada', 2010, 'Un migrante deportado entra al mundo del crimen organizado.', NULL, 8, 1, NOW(), NOW()),
(13, 'La Camarista', 'Lila Aviles', 2018, 'Una trabajadora de hotel busca oportunidades en medio de una rutina exigente.', NULL, 1, 2, NOW(), NOW()),
(14, 'Hasta los Dientes', 'Alberto Arnaut', 2018, 'Investigacion sobre una injusticia cometida contra estudiantes del Tec de Monterrey.', NULL, 5, 1, NOW(), NOW()),
(15, 'Ana y Bruno', 'Carlos Carrera', 2017, 'Una nina emprende una aventura para ayudar a su madre.', NULL, 10, 1, NOW(), NOW());

INSERT INTO `resenas` (`id`, `usuario_id`, `pelicula_id`, `comentario`, `calificacion`, `created_at`, `updated_at`) VALUES
(1, 3, 1, 'Una pelicula intensa que se siente viva desde la primera escena.', 9.5, NOW(), NOW()),
(2, 5, 2, 'Visualmente hermosa y con una mirada muy humana.', 9.7, NOW(), NOW()),
(3, 6, 3, 'Un clasico con una atmosfera inolvidable.', 9.0, NOW(), NOW()),
(4, 7, 4, 'Terror elegante con sello muy personal.', 8.6, NOW(), NOW()),
(5, 8, 5, 'Fresca, rara y muy entretenida.', 8.3, NOW(), NOW()),
(6, 9, 6, 'Dura, sensible y muy bien actuada.', 9.2, NOW(), NOW()),
(7, 11, 7, 'Minimalista, divertida y llena de detalles.', 8.5, NOW(), NOW()),
(8, 12, 8, 'Una historia necesaria y conmovedora.', 9.1, NOW(), NOW()),
(9, 10, 9, 'Tiene identidad, musica y una gran energia visual.', 9.4, NOW(), NOW()),
(10, 3, 10, 'Una propuesta poetica sobre memoria y lenguaje.', 8.7, NOW(), NOW()),
(11, 5, 11, 'Muy buen ritmo y una historia atrapante.', 8.4, NOW(), NOW()),
(12, 6, 12, 'Satira fuerte, incomoda y efectiva.', 8.8, NOW(), NOW()),
(13, 7, 13, 'Sencilla en apariencia, pero muy poderosa.', 8.9, NOW(), NOW()),
(14, 8, 14, 'Un documental claro, doloroso y necesario.', 9.0, NOW(), NOW()),
(15, 9, 15, 'Una aventura animada con buen corazon.', 8.0, NOW(), NOW());

INSERT INTO `favoritos` (`id`, `usuario_id`, `pelicula_id`, `created_at`, `updated_at`) VALUES
(1, 3, 2, NOW(), NOW()),
(2, 3, 3, NOW(), NOW()),
(3, 5, 1, NOW(), NOW()),
(4, 5, 13, NOW(), NOW()),
(5, 6, 12, NOW(), NOW()),
(6, 6, 11, NOW(), NOW()),
(7, 7, 4, NOW(), NOW()),
(8, 7, 6, NOW(), NOW()),
(9, 8, 5, NOW(), NOW()),
(10, 8, 9, NOW(), NOW()),
(11, 9, 15, NOW(), NOW()),
(12, 10, 14, NOW(), NOW()),
(13, 11, 7, NOW(), NOW()),
(14, 12, 8, NOW(), NOW()),
(15, 4, 10, NOW(), NOW());
