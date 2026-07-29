-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: cine_ito
-- ------------------------------------------------------
-- Server version	8.0.46-0ubuntu0.24.04.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `cine_ito`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `cine_ito` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `cine_ito`;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `favoritos`
--

DROP TABLE IF EXISTS `favoritos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favoritos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint unsigned NOT NULL,
  `pelicula_id` bigint unsigned NOT NULL,
  `vista` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `favoritos_usuario_id_pelicula_id_unique` (`usuario_id`,`pelicula_id`),
  KEY `favoritos_pelicula_id_foreign` (`pelicula_id`),
  CONSTRAINT `favoritos_pelicula_id_foreign` FOREIGN KEY (`pelicula_id`) REFERENCES `peliculas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favoritos_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `generos`
--

DROP TABLE IF EXISTS `generos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `generos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `generos_nombre_unique` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notifiable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notifiable_id` bigint unsigned NOT NULL,
  `data` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`,`notifiable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `peliculas`
--

DROP TABLE IF EXISTS `peliculas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `peliculas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `director` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `anio` smallint unsigned NOT NULL,
  `sinopsis` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `imagen` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `genero_id` bigint unsigned NOT NULL,
  `usuario_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `peliculas_genero_id_foreign` (`genero_id`),
  KEY `peliculas_usuario_id_foreign` (`usuario_id`),
  CONSTRAINT `peliculas_genero_id_foreign` FOREIGN KEY (`genero_id`) REFERENCES `generos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `peliculas_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `resena_reacciones`
--

DROP TABLE IF EXISTS `resena_reacciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resena_reacciones` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `resena_id` bigint unsigned NOT NULL,
  `usuario_id` bigint unsigned NOT NULL,
  `tipo` varchar(12) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `resena_reacciones_resena_id_usuario_id_unique` (`resena_id`,`usuario_id`),
  KEY `resena_reacciones_usuario_id_foreign` (`usuario_id`),
  CONSTRAINT `resena_reacciones_resena_id_foreign` FOREIGN KEY (`resena_id`) REFERENCES `resenas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `resena_reacciones_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `resena_respuestas`
--

DROP TABLE IF EXISTS `resena_respuestas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resena_respuestas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `resena_id` bigint unsigned NOT NULL,
  `usuario_id` bigint unsigned NOT NULL,
  `comentario` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `resena_respuestas_resena_id_foreign` (`resena_id`),
  KEY `resena_respuestas_usuario_id_foreign` (`usuario_id`),
  CONSTRAINT `resena_respuestas_resena_id_foreign` FOREIGN KEY (`resena_id`) REFERENCES `resenas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `resena_respuestas_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `resenas`
--

DROP TABLE IF EXISTS `resenas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resenas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `comentario` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `calificacion` decimal(3,1) NOT NULL,
  `usuario_id` bigint unsigned NOT NULL,
  `pelicula_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `resenas_usuario_id_pelicula_id_unique` (`usuario_id`,`pelicula_id`),
  KEY `resenas_pelicula_id_foreign` (`pelicula_id`),
  CONSTRAINT `resenas_pelicula_id_foreign` FOREIGN KEY (`pelicula_id`) REFERENCES `peliculas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `resenas_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_nombre_unique` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_follows`
--

DROP TABLE IF EXISTS `user_follows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_follows` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `follower_id` bigint unsigned NOT NULL,
  `followed_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_follows_follower_id_followed_id_unique` (`follower_id`,`followed_id`),
  KEY `user_follows_followed_id_foreign` (`followed_id`),
  CONSTRAINT `user_follows_followed_id_foreign` FOREIGN KEY (`followed_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_follows_follower_id_foreign` FOREIGN KEY (`follower_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `avatar` text COLLATE utf8mb4_unicode_ci,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_id` bigint unsigned NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_role_id_foreign` (`role_id`),
  CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'cine_ito'
--

--
-- Dumping routines for database 'cine_ito'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-29 22:15:53
-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: cine_ito
-- ------------------------------------------------------
-- Server version	8.0.46-0ubuntu0.24.04.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `favoritos`
--

LOCK TABLES `favoritos` WRITE;
/*!40000 ALTER TABLE `favoritos` DISABLE KEYS */;
INSERT INTO `favoritos` VALUES (28,34,63,1,'2026-07-29 19:03:39','2026-07-29 19:03:43');
/*!40000 ALTER TABLE `favoritos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `generos`
--

LOCK TABLES `generos` WRITE;
/*!40000 ALTER TABLE `generos` DISABLE KEYS */;
INSERT INTO `generos` VALUES (1,'Drama','Historias centradas en conflictos humanos y sociales','2026-07-27 18:36:38','2026-07-27 18:36:38'),(2,'Comedia','Peliculas con tono ligero, humor o satira','2026-07-27 18:36:38','2026-07-27 18:36:38'),(3,'Terror','Relatos de miedo, suspenso y elementos sobrenaturales','2026-07-27 18:36:38','2026-07-27 18:36:38'),(4,'Ciencia ficcion','Futuros posibles, tecnologia y especulacion social','2026-07-27 18:36:38','2026-07-27 18:36:38'),(5,'Documental','Narrativas basadas en hechos reales','2026-07-27 18:36:38','2026-07-27 18:36:38'),(6,'Romance','Historias sobre relaciones afectivas','2026-07-27 18:36:38','2026-07-27 18:36:38'),(7,'Fantasia','Mundos imaginarios y elementos magicos','2026-07-27 18:36:38','2026-07-27 18:36:38'),(8,'Accion','Ritmo rapido, persecuciones y escenas de riesgo','2026-07-27 18:36:38','2026-07-27 18:36:38'),(9,'Suspenso','Tension, misterio y giros narrativos','2026-07-27 18:36:38','2026-07-27 18:36:38'),(10,'Animacion','Obras creadas con tecnicas animadas','2026-07-27 18:36:38','2026-07-27 18:36:38');
/*!40000 ALTER TABLE `generos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0000_01_01_000000_create_roles_table',1),(2,'0000_01_01_000000_create_users_table',1),(3,'0001_01_01_000001_create_cache_table',1),(4,'0001_01_01_000002_create_jobs_table',1),(5,'2026_07_26_204031_create_generos_table',1),(6,'2026_07_26_204031_create_peliculas_table',1),(7,'2026_07_26_204032_create_favoritos_table',1),(8,'2026_07_26_204032_create_resenas_table',1),(9,'2026_07_27_004145_create_personal_access_tokens_table',1),(10,'2026_07_27_010000_add_profile_fields_to_users_and_favoritos',1),(11,'2026_07_29_000001_create_user_follows_table',2),(12,'2026_07_29_000002_create_resena_reacciones_table',2),(13,'2026_07_29_000003_create_resena_respuestas_table',2),(14,'2026_07_29_090639_create_notifications_table',3);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES ('14ba57f8-0296-4208-aa53-a2ecea5f0c47','App\\Notifications\\UserFollowedNotification','App\\Models\\User',20,'{\"type\":\"user_followed\",\"follower_id\":34,\"follower_name\":\"ruben\",\"follower_avatar\":\"https:\\/\\/lh3.googleusercontent.com\\/a\\/ACg8ocLPj9SXGn9c7PftrL-LXV8eA-KRaCX6ifFX9K8tNfwZbiUkGVY=s96-c\",\"message\":\"ruben ha comenzado a seguirte.\"}',NULL,'2026-07-29 18:14:54','2026-07-29 18:14:54'),('2ab5bd37-da2d-45b2-9fff-dc95193908ec','App\\Notifications\\ReviewLikedNotification','App\\Models\\User',16,'{\"type\":\"review_liked\",\"liker_id\":25,\"liker_name\":\"Adelina Martinez\",\"liker_avatar\":null,\"resena_id\":17,\"pelicula_id\":65,\"message\":\"A Adelina Martinez le ha gustado tu rese\\u00f1a de Chicuarotes.\"}','2026-07-29 14:52:09','2026-07-29 14:51:12','2026-07-29 14:52:09'),('538f2616-3c8f-4c3b-97df-29a282bdbcec','App\\Notifications\\ReviewLikedNotification','App\\Models\\User',16,'{\"type\":\"review_liked\",\"liker_id\":25,\"liker_name\":\"Adelina Martinez\",\"liker_avatar\":null,\"resena_id\":17,\"pelicula_id\":65,\"message\":\"A Adelina Martinez le ha gustado tu rese\\u00f1a de Chicuarotes.\"}',NULL,'2026-07-29 14:45:18','2026-07-29 14:45:18'),('6ab5ff0d-e984-41f3-acf5-d9544070c4ab','App\\Notifications\\ReviewRepliedNotification','App\\Models\\User',34,'{\"type\":\"review_replied\",\"replier_id\":35,\"replier_name\":\"Valencia Borja Omar Rutilio\",\"replier_avatar\":\"https:\\/\\/lh3.googleusercontent.com\\/a\\/ACg8ocLUkGaiaJuyoXn0P_wzAp9hsG2BwN4w--jqtHWG6q3LwUx4fxWKLw=s96-c\",\"resena_id\":25,\"pelicula_id\":66,\"message\":\"Valencia Borja Omar Rutilio ha respondido a tu rese\\u00f1a de Los Lobos.\"}','2026-07-29 18:07:20','2026-07-29 18:06:26','2026-07-29 18:07:20'),('8812e0a6-7564-47eb-a757-5ee2eee6171e','App\\Notifications\\UserFollowedNotification','App\\Models\\User',16,'{\"type\":\"user_followed\",\"follower_id\":25,\"follower_name\":\"Adelina Martinez\",\"follower_avatar\":null,\"message\":\"Adelina Martinez ha comenzado a seguirte.\"}',NULL,'2026-07-29 14:45:34','2026-07-29 14:45:34'),('8c5702ff-dbf3-4045-a3bc-903578be9d72','App\\Notifications\\ReviewRepliedNotification','App\\Models\\User',25,'{\"type\":\"review_replied\",\"replier_id\":16,\"replier_name\":\"Gabriel Mendooza\",\"replier_avatar\":null,\"resena_id\":23,\"pelicula_id\":65,\"message\":\"Gabriel Mendooza ha respondido a tu rese\\u00f1a de Chicuarotes.\"}','2026-07-29 14:52:53','2026-07-29 14:52:26','2026-07-29 14:52:53'),('8e84899d-62b7-4b3d-a90f-9e89227e1dbe','App\\Notifications\\ReviewRepliedNotification','App\\Models\\User',34,'{\"type\":\"review_replied\",\"replier_id\":35,\"replier_name\":\"Valencia Borja Omar Rutilio\",\"replier_avatar\":\"https:\\/\\/lh3.googleusercontent.com\\/a\\/ACg8ocLUkGaiaJuyoXn0P_wzAp9hsG2BwN4w--jqtHWG6q3LwUx4fxWKLw=s96-c\",\"resena_id\":26,\"pelicula_id\":17,\"message\":\"Valencia Borja Omar Rutilio ha respondido a tu rese\\u00f1a de Los Olvidados.\"}','2026-07-29 19:56:33','2026-07-29 19:11:27','2026-07-29 19:56:33'),('95b2940c-39fb-42b1-8565-fda2565f0e2a','App\\Notifications\\ReviewLikedNotification','App\\Models\\User',18,'{\"type\":\"review_liked\",\"liker_id\":19,\"liker_name\":\"OMAR RUTILIO VALENCIA BORJA\",\"liker_avatar\":\"https:\\/\\/lh3.googleusercontent.com\\/a\\/ACg8ocLPj9SXGn9c7PftrL-LXV8eA-KRaCX6ifFX9K8tNfwZbiUkGVY=s96-c\",\"resena_id\":19,\"pelicula_id\":65,\"message\":\"A OMAR RUTILIO VALENCIA BORJA le ha gustado tu rese\\u00f1a de Chicuarotes.\"}',NULL,'2026-07-29 13:58:58','2026-07-29 13:58:58'),('9788e5b5-a664-400d-86ec-4e8e8038513d','App\\Notifications\\UserFollowedNotification','App\\Models\\User',14,'{\"type\":\"user_followed\",\"follower_id\":34,\"follower_name\":\"ruben\",\"follower_avatar\":null,\"message\":\"ruben ha comenzado a seguirte.\"}',NULL,'2026-07-29 18:04:30','2026-07-29 18:04:30'),('9ef42835-d927-4f8b-9389-4bf189858246','App\\Notifications\\UserFollowedNotification','App\\Models\\User',34,'{\"type\":\"user_followed\",\"follower_id\":35,\"follower_name\":\"Valencia Borja Omar Rutilio\",\"follower_avatar\":\"https:\\/\\/lh3.googleusercontent.com\\/a\\/ACg8ocLUkGaiaJuyoXn0P_wzAp9hsG2BwN4w--jqtHWG6q3LwUx4fxWKLw=s96-c\",\"message\":\"Valencia Borja Omar Rutilio ha comenzado a seguirte.\"}','2026-07-29 18:07:22','2026-07-29 18:06:18','2026-07-29 18:07:22'),('a704618c-9f36-49d7-8853-c3951a390122','App\\Notifications\\ReviewLikedNotification','App\\Models\\User',16,'{\"type\":\"review_liked\",\"liker_id\":19,\"liker_name\":\"OMAR RUTILIO VALENCIA BORJA\",\"liker_avatar\":\"https:\\/\\/lh3.googleusercontent.com\\/a\\/ACg8ocLPj9SXGn9c7PftrL-LXV8eA-KRaCX6ifFX9K8tNfwZbiUkGVY=s96-c\",\"resena_id\":17,\"pelicula_id\":65,\"message\":\"A OMAR RUTILIO VALENCIA BORJA le ha gustado tu rese\\u00f1a de Chicuarotes.\"}',NULL,'2026-07-29 13:58:56','2026-07-29 13:58:56'),('b78bb431-7595-4011-a22d-ee00f6d63de3','App\\Notifications\\ReviewLikedNotification','App\\Models\\User',14,'{\"type\":\"review_liked\",\"liker_id\":34,\"liker_name\":\"ruben\",\"liker_avatar\":null,\"resena_id\":16,\"pelicula_id\":16,\"message\":\"A ruben le ha gustado tu rese\\u00f1a de Avatar.\"}',NULL,'2026-07-29 18:04:25','2026-07-29 18:04:25'),('bdf836cc-a6f1-4411-a0d4-0217751d0f18','App\\Notifications\\ReviewLikedNotification','App\\Models\\User',16,'{\"type\":\"review_liked\",\"liker_id\":25,\"liker_name\":\"Adelina Martinez\",\"liker_avatar\":null,\"resena_id\":17,\"pelicula_id\":65,\"message\":\"A Adelina Martinez le ha gustado tu rese\\u00f1a de Chicuarotes.\"}',NULL,'2026-07-29 14:51:10','2026-07-29 14:51:10'),('c912bea9-f860-4732-a689-5c9b4d2bf082','App\\Notifications\\ReviewLikedNotification','App\\Models\\User',16,'{\"type\":\"review_liked\",\"liker_id\":25,\"liker_name\":\"Adelina Martinez\",\"liker_avatar\":null,\"resena_id\":17,\"pelicula_id\":65,\"message\":\"A Adelina Martinez le ha gustado tu rese\\u00f1a de Chicuarotes.\"}',NULL,'2026-07-29 14:45:17','2026-07-29 14:45:17'),('d624e12b-ee89-4d07-bed0-0847e30d7882','App\\Notifications\\ReviewLikedNotification','App\\Models\\User',34,'{\"type\":\"review_liked\",\"liker_id\":35,\"liker_name\":\"Valencia Borja Omar Rutilio\",\"liker_avatar\":\"https:\\/\\/lh3.googleusercontent.com\\/a\\/ACg8ocLUkGaiaJuyoXn0P_wzAp9hsG2BwN4w--jqtHWG6q3LwUx4fxWKLw=s96-c\",\"resena_id\":25,\"pelicula_id\":66,\"message\":\"A Valencia Borja Omar Rutilio le ha gustado tu rese\\u00f1a de Los Lobos.\"}','2026-07-29 18:07:24','2026-07-29 18:06:15','2026-07-29 18:07:24'),('e19f47d4-71fe-46d8-8bb3-2c0bd958e569','App\\Notifications\\UserFollowedNotification','App\\Models\\User',25,'{\"type\":\"user_followed\",\"follower_id\":27,\"follower_name\":\"ANGEL GABRIEL ANTONIO MENDEZ\",\"follower_avatar\":\"https:\\/\\/lh3.googleusercontent.com\\/a\\/ACg8ocKHpdwXWxHtdKWAxNfTV6jK_vvQunuHSnaLng3gjume28pz1Q=s96-c\",\"message\":\"ANGEL GABRIEL ANTONIO MENDEZ ha comenzado a seguirte.\"}',NULL,'2026-07-29 17:50:39','2026-07-29 17:50:39'),('e1e59518-a1c8-4938-b0f8-a8b533368a54','App\\Notifications\\ReviewLikedNotification','App\\Models\\User',25,'{\"type\":\"review_liked\",\"liker_id\":16,\"liker_name\":\"Gabriel Mendooza\",\"liker_avatar\":null,\"resena_id\":23,\"pelicula_id\":65,\"message\":\"A Gabriel Mendooza le ha gustado tu rese\\u00f1a de Chicuarotes.\"}','2026-07-29 14:52:53','2026-07-29 14:52:23','2026-07-29 14:52:53'),('f3c094bf-0296-4c85-a0f2-aa0dd751548f','App\\Notifications\\ReviewLikedNotification','App\\Models\\User',20,'{\"type\":\"review_liked\",\"liker_id\":34,\"liker_name\":\"ruben\",\"liker_avatar\":\"https:\\/\\/lh3.googleusercontent.com\\/a\\/ACg8ocLPj9SXGn9c7PftrL-LXV8eA-KRaCX6ifFX9K8tNfwZbiUkGVY=s96-c\",\"resena_id\":22,\"pelicula_id\":56,\"message\":\"A ruben le ha gustado tu rese\\u00f1a de Rudo y Cursi.\"}',NULL,'2026-07-29 18:14:46','2026-07-29 18:14:46'),('f6ce189a-3a59-4858-862b-c425a3b7c371','App\\Notifications\\ReviewLikedNotification','App\\Models\\User',16,'{\"type\":\"review_liked\",\"liker_id\":25,\"liker_name\":\"Adelina Martinez\",\"liker_avatar\":null,\"resena_id\":17,\"pelicula_id\":65,\"message\":\"A Adelina Martinez le ha gustado tu rese\\u00f1a de Chicuarotes.\"}',NULL,'2026-07-29 14:45:17','2026-07-29 14:45:17'),('fab8e117-48f7-4ea1-bace-facc51c66d20','App\\Notifications\\ReviewLikedNotification','App\\Models\\User',17,'{\"type\":\"review_liked\",\"liker_id\":19,\"liker_name\":\"OMAR RUTILIO VALENCIA BORJA\",\"liker_avatar\":\"https:\\/\\/lh3.googleusercontent.com\\/a\\/ACg8ocLPj9SXGn9c7PftrL-LXV8eA-KRaCX6ifFX9K8tNfwZbiUkGVY=s96-c\",\"resena_id\":18,\"pelicula_id\":65,\"message\":\"A OMAR RUTILIO VALENCIA BORJA le ha gustado tu rese\\u00f1a de Chicuarotes.\"}',NULL,'2026-07-29 13:58:55','2026-07-29 13:58:55');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `peliculas`
--

LOCK TABLES `peliculas` WRITE;
/*!40000 ALTER TABLE `peliculas` DISABLE KEYS */;
INSERT INTO `peliculas` VALUES (16,'Avatar','James Cameron',2009,'Un marine parapléjico enviado a la luna Pandora en una misión única se debate entre seguir sus órdenes y proteger el mundo que siente que es su hogar.','https://m.media-amazon.com/images/M/MV5BMDEzMmQwZjctZWU2My00MWNlLWE0NjItMDJlYTRlNGJiZjcyXkEyXkFqcGc@._V1_SX300.jpg',4,1,'2026-07-28 14:22:08','2026-07-28 14:22:08'),(17,'Los Olvidados','Luis Bunuel',1950,'Un retrato duro de jovenes marginados en la Ciudad de Mexico.','https://m.media-amazon.com/images/M/MV5BMTgwOGYxYzItMjMyZi00MmM0LWJjYWEtNzA0NzYxOTk4MWQ2XkEyXkFqcGc@._V1_SX300.jpg',1,1,'2026-07-28 14:40:09','2026-07-28 14:40:09'),(18,'El Angel Exterminador','Luis Bunuel',1962,'Un grupo de invitados descubre que no puede abandonar una mansion despues de una cena.','https://m.media-amazon.com/images/M/MV5BZTk0YjNmMjEtMjZjOC00MDNhLTg2NzUtMmFlYzY0YWJkMzA2XkEyXkFqcGc@._V1_SX300.jpg',7,1,'2026-07-28 14:40:10','2026-07-28 14:40:10'),(19,'Nazarín','Luis Bunuel',1959,'Un sacerdote intenta vivir de acuerdo con sus ideales en un entorno hostil.','https://m.media-amazon.com/images/M/MV5BYjNkZGRjZDUtNGVlNi00MDQyLTlhNWItZWIwMzdiMWE1MDRkXkEyXkFqcGc@._V1_SX300.jpg',1,1,'2026-07-28 14:40:10','2026-07-28 14:40:10'),(20,'Simon del Desierto','Luis Bunuel',1965,'Un asceta enfrenta tentaciones y absurdos desde lo alto de una columna.','https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80',2,1,'2026-07-28 14:40:10','2026-07-28 14:40:10'),(21,'El','Luis Bunuel',1953,'Un hombre obsesivo transforma su matrimonio en una experiencia opresiva.','https://image.tmdb.org/t/p/w500/dD7Z3nQ2KxY7nQ21R0Qz5Z2KxY7.jpg',1,1,'2026-07-28 14:40:12','2026-07-28 14:40:12'),(22,'Maria Candelaria','Emilio Fernandez',1944,'Una joven indigena enfrenta el rechazo social y los prejuicios de su comunidad.','https://m.media-amazon.com/images/M/MV5BZGU0YjNlMzgtNTZiMC00ZGEwLTk5ZGMtODFmZDIzMGExNzM5XkEyXkFqcGc@._V1_SX300.jpg',1,1,'2026-07-28 14:40:12','2026-07-28 14:40:12'),(23,'Enamorada','Emilio Fernandez',1946,'Un general revolucionario se enamora de una mujer de fuerte caracter.','https://m.media-amazon.com/images/M/MV5BODNmMDk0OTEtOWYxNS00MTNkLWJhNDgtOWM3NmNhYmQ3MjQwXkEyXkFqcGdeQXVyMTIwMDE2OTU4._V1_SX300.jpg',6,1,'2026-07-28 14:40:12','2026-07-28 14:40:12'),(24,'La Perla','Emilio Fernandez',1947,'El hallazgo de una perla altera la vida de una familia humilde.','https://m.media-amazon.com/images/M/MV5BYmI2M2Y2ZmItMGExYi00ODBkLWI5NDktY2U3MjIwOWZiOTdhXkEyXkFqcGdeQXVyMTcxNTYyMjM@._V1_SX300.jpg',1,1,'2026-07-28 14:40:12','2026-07-28 14:40:12'),(25,'Rio Escondido','Emilio Fernandez',1948,'Una maestra llega a un pueblo dominado por el abuso de poder.','https://m.media-amazon.com/images/M/MV5BYzRjMjg4YTgtYjQwMy00NTc3LTk5NWUtODZkMmMzMjM3MjQ3XkEyXkFqcGdeQXVyODE2MzQyMTU@._V1_SX300.jpg',1,1,'2026-07-28 14:40:12','2026-07-28 14:40:12'),(26,'Salon Mexico','Emilio Fernandez',1949,'Una bailarina de cabaret intenta proteger el futuro de su hermana.','https://m.media-amazon.com/images/M/MV5BYWFlMWYwMGUtNDUzOS00YjQ3LTk3NjAtNDlmNjc5ZjNjNTFjXkEyXkFqcGc@._V1_SX300.jpg',1,1,'2026-07-28 14:40:12','2026-07-28 14:40:12'),(27,'Aventurera','Alberto Gout',1950,'Una mujer marcada por la traicion busca sobrevivir en el mundo nocturno.','https://m.media-amazon.com/images/M/MV5BZDllZmY3ZTgtNTI3MS00NmI1LWE1MzUtNTZmNTU1M2YwNDRiXkEyXkFqcGdeQXVyMjQ4NDAyMDI@._V1_SX300.jpg',1,1,'2026-07-28 14:40:12','2026-07-28 14:40:12'),(28,'El Rey del Barrio','Gilberto Martinez Solares',1950,'Un lider de barrio combina picardia, musica y enredos comicos.','https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80',2,1,'2026-07-28 14:40:13','2026-07-28 14:40:13'),(29,'Ahí Esta el Detalle','Juan Bustillo Oro',1940,'Un malentendido convierte a un hombre comun en sospechoso de asesinato.','https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80',2,1,'2026-07-28 14:40:14','2026-07-28 14:40:14'),(30,'El Padrecito','Miguel M. Delgado',1964,'Un joven sacerdote llega a un pueblo y transforma a sus habitantes con humor.','https://m.media-amazon.com/images/M/MV5BNDNlZTBlZDQtZjE5NC00M2MwLWIzOWUtMTlmZDlmN2E0YmVlXkEyXkFqcGc@._V1_SX300.jpg',2,1,'2026-07-28 14:40:14','2026-07-28 14:40:14'),(31,'El Bolero de Raquel','Miguel M. Delgado',1957,'Un bolero se hace cargo de un niño mientras intenta resolver su vida.','https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80',2,1,'2026-07-28 14:40:14','2026-07-28 14:40:14'),(32,'Dos Tipos de Cuidado','Ismael Rodriguez',1953,'Dos amigos se enfrentan entre canciones, rivalidades y malentendidos.','https://m.media-amazon.com/images/M/MV5BNjVjOTQ2ZDktMDA2NS00NmFjLWFiMDYtNDQ2ZjJhMjBmNjc0XkEyXkFqcGdeQXVyMTk4MDgwNA@@._V1_SX300.jpg',2,1,'2026-07-28 14:40:14','2026-07-28 14:40:14'),(33,'Nosotros los Pobres','Ismael Rodriguez',1948,'Una familia de barrio enfrenta pobreza, injusticia y la fuerza de sus lazos.','https://m.media-amazon.com/images/M/MV5BZDk1MmI4YmUtZTk1ZS00Zjc5LThkYmItZWUyMWVhMDA4NzM0XkEyXkFqcGc@._V1_SX300.jpg',1,1,'2026-07-28 14:40:14','2026-07-28 14:40:14'),(34,'Ustedes los Ricos','Ismael Rodriguez',1948,'La continuacion de una historia familiar marcada por dolor y desigualdad.','https://m.media-amazon.com/images/M/MV5BMTY0MDg3NTkwMV5BMl5BanBnXkFtZTgwOTQxNjIxMzE@._V1_SX300.jpg',1,1,'2026-07-28 14:40:15','2026-07-28 14:40:15'),(35,'Pepe el Toro','Ismael Rodriguez',1953,'Pepe enfrenta nuevos retos personales y familiares en el barrio.','https://m.media-amazon.com/images/M/MV5BZGQ5NjIzY2MtYzQ1Yi00YzA1LWEyYTYtN2MyZTlmMDBlNzY0XkEyXkFqcGc@._V1_SX300.jpg',1,1,'2026-07-28 14:40:15','2026-07-28 14:40:15'),(36,'Tizoc','Ismael Rodriguez',1957,'Un romance tragico surge entre mundos sociales distintos.','https://m.media-amazon.com/images/M/MV5BZGVmMzBlZmItZDAwNy00MGE2LWI5N2UtNGE2ZWZjYTZlNjU4XkEyXkFqcGdeQXVyMzY2MDk0MTk@._V1_SX300.jpg',6,1,'2026-07-28 14:40:15','2026-07-28 14:40:15'),(37,'El Esqueleto de la Señora Morales','Rogelio A. Gonzalez',1960,'Una comedia negra sobre matrimonio, apariencia y crimen.','https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80',2,1,'2026-07-28 14:40:16','2026-07-28 14:40:16'),(38,'La Oveja Negra','Ismael Rodriguez',1949,'Un conflicto familiar explora orgullo, tradicion y dolor.','https://m.media-amazon.com/images/M/MV5BNGY2YTdiMjEtODM4OC00ZmZlLWFmMzktMThjYmQ1YzY0ZDJkXkEyXkFqcGdeQXVyMTU3NDU4MDg2._V1_SX300.jpg',1,1,'2026-07-28 14:40:16','2026-07-28 14:40:16'),(39,'Las Poquianchis','Felipe Cazals',1976,'Recreacion de un caso criminal que sacudio a Mexico.','https://m.media-amazon.com/images/M/MV5BZTk2ODY0NjctOTJmOS00MmRiLTgyN2QtODZhMzQ1NmE1YzE5XkEyXkFqcGc@._V1_SX300.jpg',1,1,'2026-07-28 14:40:16','2026-07-28 14:40:16'),(40,'Canoa','Felipe Cazals',1976,'Un grupo de trabajadores es perseguido por una comunidad manipulada por el miedo.','https://m.media-amazon.com/images/M/MV5BZTcyZTVmYTAtNGM1Zi00NDY1LTkzZWUtY2NlNjdmNzRjNWU1XkEyXkFqcGc@._V1_SX300.jpg',9,1,'2026-07-28 14:40:16','2026-07-28 14:40:16'),(41,'El Apando','Felipe Cazals',1976,'La vida carcelaria revela violencia, corrupcion y desesperacion.','https://m.media-amazon.com/images/M/MV5BNGM0ZDZiOGItNGZlMS00OGNiLWIxZGYtNDY2OTA0YTQ0NWNhXkEyXkFqcGc@._V1_SX300.jpg',1,1,'2026-07-28 14:40:17','2026-07-28 14:40:17'),(42,'Rojo Amanecer','Jorge Fons',1989,'Una familia vive desde su departamento los sucesos del 2 de octubre de 1968.','https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80',1,1,'2026-07-28 14:40:17','2026-07-28 14:40:17'),(43,'El Callejon de los Milagros','Jorge Fons',1995,'Historias cruzadas revelan deseos y conflictos en un barrio popular.','https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80',1,1,'2026-07-28 14:40:18','2026-07-28 14:40:18'),(44,'Danzon','Maria Novaro',1991,'Una telefonista emprende un viaje para encontrar a su pareja de baile.','https://m.media-amazon.com/images/M/MV5BN2NlMzg3NGYtZDA4OC00ODM2LWFlZDctNDhhMTM3NGM2NmIxXkEyXkFqcGdeQXVyMTcwOTQzOTYy._V1_SX300.jpg',1,1,'2026-07-28 14:40:18','2026-07-28 14:40:18'),(45,'Como Agua para Chocolate','Alfonso Arau',1992,'La cocina, el amor y la tradicion familiar se mezclan con realismo magico.','https://m.media-amazon.com/images/M/MV5BOTQ0ZjdjYjgtYzhiYS00YTFiLWJmMTMtNDMyZWNhOTcwNTkxXkEyXkFqcGc@._V1_SX300.jpg',6,1,'2026-07-28 14:40:19','2026-07-28 14:40:19'),(46,'Sólo con tu Pareja','Alfonso Cuaron',1991,'Una comedia sobre engaños, miedo y segundas oportunidades.','https://m.media-amazon.com/images/M/MV5BMTMxYjQ5OTgtMjU1ZC00MzQzLTkwNGEtODcwOWVkNDlhYTZmXkEyXkFqcGdeQXVyMzI5NjUyMDM@._V1_SX300.jpg',2,1,'2026-07-28 14:40:19','2026-07-28 14:40:19'),(47,'Y Tu Mama Tambien','Alfonso Cuaron',2001,'Dos amigos emprenden un viaje que cambia su forma de entender la vida.','https://m.media-amazon.com/images/M/MV5BNTRmZmNlMjktZDRkMi00OGNjLWJkZGUtMDljNDViMGE3MjNhXkEyXkFqcGc@._V1_SX300.jpg',1,1,'2026-07-28 14:40:19','2026-07-28 14:40:19'),(48,'Japón','Carlos Reygadas',2002,'Un hombre viaja a un pueblo remoto en busca de silencio y final.','https://m.media-amazon.com/images/M/MV5BYzljYzk4YzQtMzMwNy00OTg3LWI1ZmItODE5NTc5MDViNzRmXkEyXkFqcGc@._V1_SX300.jpg',1,1,'2026-07-28 14:40:19','2026-07-28 14:40:19'),(49,'Luz Silenciosa','Carlos Reygadas',2007,'Un conflicto amoroso y espiritual surge en una comunidad menonita.','https://m.media-amazon.com/images/M/MV5BZjhjOWI0ZmUtMzMzNS00NTBmLWFlMmItODY3MzQwNDA1NmRjXkEyXkFqcGc@._V1_SX300.jpg',1,1,'2026-07-28 14:40:20','2026-07-28 14:40:20'),(50,'Heli','Amat Escalante',2013,'Una familia es golpeada por la violencia y la corrupcion.','https://m.media-amazon.com/images/M/MV5BNjE3N2NlMzItNWI2YS00ODY3LWIzNzYtYTVjYzYzNjMyYzg0XkEyXkFqcGc@._V1_SX300.jpg',1,1,'2026-07-28 14:40:20','2026-07-28 14:40:20'),(51,'La Region Salvaje','Amat Escalante',2016,'Deseo, violencia y misterio se cruzan alrededor de una presencia inexplicable.','https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80',4,1,'2026-07-28 14:40:21','2026-07-28 14:40:21'),(52,'Miss Bala','Gerardo Naranjo',2011,'Una aspirante a reina de belleza queda atrapada en una red criminal.','https://m.media-amazon.com/images/M/MV5BNDZkMzlhY2ItY2Q2Ni00ZDMyLTgzYzgtMWVjMDdhODczZDJhXkEyXkFqcGc@._V1_SX300.jpg',9,1,'2026-07-28 14:40:21','2026-07-28 14:40:21'),(53,'Después de Lucía','Michel Franco',2012,'Una adolescente enfrenta acoso y silencio despues de mudarse con su padre.','https://m.media-amazon.com/images/M/MV5BMTQwMTgxNDEwOV5BMl5BanBnXkFtZTcwMDg2NDk3OA@@._V1_SX300.jpg',1,1,'2026-07-28 14:40:22','2026-07-28 14:40:22'),(54,'Nuevo Orden','Michel Franco',2020,'Una boda de elite se convierte en el inicio de una ruptura social violenta.','https://m.media-amazon.com/images/M/MV5BMGMxMjVhMTMtMTA4YS00MDgzLWJlYTktNTZjMzYzYmYyMmUxXkEyXkFqcGc@._V1_SX300.jpg',9,1,'2026-07-28 14:40:22','2026-07-28 14:40:22'),(55,'La Zona','Rodrigo Pla',2007,'Una comunidad cerrada reacciona con brutalidad ante una intrusion.','https://m.media-amazon.com/images/M/MV5BMmNhYWQ0MTktNWE0My00N2UxLTg4NmEtZWU5YzdlZDhjODIyXkEyXkFqcGdeQXVyNDczNDg2ODY@._V1_SX300.jpg',9,1,'2026-07-28 14:40:22','2026-07-28 14:40:22'),(56,'Rudo y Cursi','Carlos Cuaron',2008,'Dos hermanos futbolistas enfrentan fama, rivalidad y sueños rotos.','https://m.media-amazon.com/images/M/MV5BMjAxNzUwMzUzOV5BMl5BanBnXkFtZTcwMzAwNTE0Mg@@._V1_SX300.jpg',2,1,'2026-07-28 14:40:22','2026-07-28 14:40:22'),(57,'No Se Aceptan Devoluciones','Eugenio Derbez',2013,'Un hombre inmaduro aprende a ser padre despues de recibir una sorpresa inesperada.','https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80',2,1,'2026-07-28 14:40:22','2026-07-28 14:40:22'),(58,'Nosotros los Nobles','Gary Alazraki',2013,'Un padre finge perder su fortuna para dar una leccion a sus hijos.','https://m.media-amazon.com/images/M/MV5BMTQ5MjQ0OTA4OF5BMl5BanBnXkFtZTcwNTkxODYyOQ@@._V1_SX300.jpg',2,1,'2026-07-28 14:40:23','2026-07-28 14:40:23'),(59,'Guten Tag Ramon','Jorge Ramirez Suarez',2013,'Un joven mexicano viaja a Alemania buscando una oportunidad.','https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80',1,1,'2026-07-28 14:40:23','2026-07-28 14:40:23'),(60,'La Dictadura Perfecta','Luis Estrada',2014,'Una satira sobre medios, politica y fabricacion de imagen publica.','https://m.media-amazon.com/images/M/MV5BMTNmNDlkZDUtZjA2Zi00ZWUyLThiNGMtNjk2YzEwZjBiYjI0XkEyXkFqcGc@._V1_SX300.jpg',2,1,'2026-07-28 14:40:24','2026-07-28 14:40:24'),(61,'La Ley de Herodes','Luis Estrada',1999,'Un funcionario descubre el poder y la corrupcion en un pueblo olvidado.','https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80',2,1,'2026-07-28 14:40:25','2026-07-28 14:40:25'),(62,'Un Mundo Maravilloso','Luis Estrada',2006,'Una satira sobre desigualdad, medios y discurso politico.','https://m.media-amazon.com/images/M/MV5BMjIzMTY2NDIxOF5BMl5BanBnXkFtZTgwOTI2Nzg1MjE@._V1_SX300.jpg',2,1,'2026-07-28 14:40:25','2026-07-28 14:40:25'),(63,'Bardo','Alejandro Gonzalez Inarritu',2022,'Un periodista y documentalista revisa su memoria, identidad y origen.','https://m.media-amazon.com/images/M/MV5BNDgxNjdhZWMtYjNjMi00YTE3LTg1OTItMTU5NmViMDRjNDg5XkEyXkFqcGc@._V1_SX300.jpg',1,1,'2026-07-28 14:40:25','2026-07-28 14:40:25'),(64,'Biutiful','Alejandro Gonzalez Inarritu',2010,'Un hombre enfrenta enfermedad, familia y culpa en los margenes de Barcelona.','https://m.media-amazon.com/images/M/MV5BMzI4OTQ0MDQyNl5BMl5BanBnXkFtZTcwODY5MjQwNA@@._V1_SX300.jpg',1,1,'2026-07-28 14:40:25','2026-07-28 14:40:25'),(65,'Chicuarotes','Gael Garcia Bernal',2019,'Dos jovenes buscan escapar de su realidad a traves de decisiones cada vez mas riesgosas.','https://m.media-amazon.com/images/M/MV5BMDhmZTU2ZDYtY2RjZC00YmViLWJmNGEtYzA1NTNkNGNlNmMwXkEyXkFqcGc@._V1_SX300.jpg',1,1,'2026-07-28 14:40:25','2026-07-28 14:40:25'),(66,'Los Lobos','Samuel Kishi',2019,'Dos niños mexicanos migrantes esperan a su madre mientras imaginan un mundo nuevo.','https://m.media-amazon.com/images/M/MV5BNmRhZjQ5ZDItZjIwOC00ZTJiLWEyNjgtODk3OGU2MTgyNDQxXkEyXkFqcGc@._V1_SX300.jpg',1,1,'2026-07-28 14:40:25','2026-07-28 14:40:25');
/*!40000 ALTER TABLE `peliculas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `resena_reacciones`
--

LOCK TABLES `resena_reacciones` WRITE;
/*!40000 ALTER TABLE `resena_reacciones` DISABLE KEYS */;
INSERT INTO `resena_reacciones` VALUES (8,22,14,'dislike','2026-07-29 03:03:50','2026-07-29 03:03:50'),(23,16,34,'like','2026-07-29 18:04:25','2026-07-29 18:04:25'),(24,25,35,'like','2026-07-29 18:06:15','2026-07-29 18:06:15'),(25,25,34,'like','2026-07-29 18:08:11','2026-07-29 18:08:11'),(26,22,34,'like','2026-07-29 18:14:46','2026-07-29 18:14:46'),(27,26,34,'dislike','2026-07-29 19:10:21','2026-07-29 19:10:21');
/*!40000 ALTER TABLE `resena_reacciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `resena_respuestas`
--

LOCK TABLES `resena_respuestas` WRITE;
/*!40000 ALTER TABLE `resena_respuestas` DISABLE KEYS */;
INSERT INTO `resena_respuestas` VALUES (2,22,14,'Dislike','2026-07-29 03:03:55','2026-07-29 03:03:55'),(4,25,35,'ño','2026-07-29 18:06:26','2026-07-29 18:06:26'),(5,26,34,'no estoy de acuerdo contigo amigo no sabes apreciar el arte','2026-07-29 19:10:31','2026-07-29 19:10:31'),(6,26,35,'se respondia solo','2026-07-29 19:11:27','2026-07-29 19:11:27');
/*!40000 ALTER TABLE `resena_respuestas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `resenas`
--

LOCK TABLES `resenas` WRITE;
/*!40000 ALTER TABLE `resenas` DISABLE KEYS */;
INSERT INTO `resenas` VALUES (16,'Buena pelicula me gustan mucho las aves',5.0,14,16,'2026-07-28 14:37:42','2026-07-28 14:37:42'),(22,'Está bueno',1.0,20,56,'2026-07-29 01:21:02','2026-07-29 01:21:02'),(25,'excelente pelicula',3.0,34,66,'2026-07-29 18:03:55','2026-07-29 18:03:55'),(26,'olvidada como se llama no la recomiendo pesima calidad',5.0,34,17,'2026-07-29 19:10:05','2026-07-29 19:10:05'),(27,'no me gusto la pelicula',3.0,4,56,'2026-07-29 19:56:05','2026-07-29 19:56:05');
/*!40000 ALTER TABLE `resenas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Administrador','Acceso total al sistema','2026-07-27 18:36:35','2026-07-27 18:36:35'),(2,'Moderador','Revision de peliculas y resenas','2026-07-27 18:36:35','2026-07-27 18:36:35'),(3,'Cinefilo','Usuario estandar de la comunidad','2026-07-27 18:36:35','2026-07-27 18:36:35');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_follows`
--

LOCK TABLES `user_follows` WRITE;
/*!40000 ALTER TABLE `user_follows` DISABLE KEYS */;
INSERT INTO `user_follows` VALUES (8,34,14,'2026-07-29 18:04:30','2026-07-29 18:04:30'),(9,35,34,'2026-07-29 18:06:18','2026-07-29 18:06:18'),(10,34,20,'2026-07-29 18:14:54','2026-07-29 18:14:54');
/*!40000 ALTER TABLE `user_follows` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin CinemaITO','admin@cinemaito.com',NULL,NULL,'$2y$12$C44FznkFs95jOhlb0jkmHeWmqZvjeprgkKqoB6NEu9GFCjSqV1SuS',1,NULL,'2026-07-27 18:36:35','2026-07-29 03:08:39'),(2,'Moderador ITO','mod@cinemaito.com',NULL,NULL,'$2y$12$vf0A65P0cioFrsZ5nRsnZuQEKcfWBL4FV4I7aYhWqH4W1vI1uvwdO',2,NULL,'2026-07-27 18:36:35','2026-07-29 03:08:40'),(3,'Usuario Cinefilo','user@cinemaito.com',NULL,NULL,'$2y$12$G0dCRud3B6vMd4omJBcat.Mt3OVa1tjYv1LyN6wOippns9XMfFjKW',3,NULL,'2026-07-27 18:36:36','2026-07-27 18:36:36'),(4,'Developer Evaluador','developer@cinemaito.com',NULL,NULL,'$2y$12$ymIQPPBXfKwIHjyeHo1Ote3/9m11pA.prPuzBacT6.ow4LBfParTq',1,NULL,'2026-07-27 18:36:36','2026-07-27 18:36:36'),(5,'Ana Lopez','ana@cinemaito.com',NULL,NULL,'$2y$12$mewo2zeWwZVGAXihqgBHy.CDA0uXH0OL9h6gwpN3kklvuJcRNkpY2',3,NULL,'2026-07-27 18:36:36','2026-07-27 18:36:36'),(6,'Carlos Ruiz','carlos@cinemaito.com',NULL,NULL,'$2y$12$t7PzSooN/dzcK1tGpnWvn.VkpNaH9x.gzWo29U5bgBVQ9SMGXXSlC',3,NULL,'2026-07-27 18:36:36','2026-07-27 18:36:36'),(7,'Diana Perez','diana@cinemaito.com',NULL,NULL,'$2y$12$3fpIAh/2AIgGcq3bOuJdcORfz/yGQaK45csIjAwEFYsao487172GK',3,NULL,'2026-07-27 18:36:37','2026-07-27 18:36:37'),(8,'Eduardo Vega','eduardo@cinemaito.com',NULL,NULL,'$2y$12$ZRP21inf9aF2WOJ1Zub6A.U041kzVRwZvpgRMFL6wu0DkLHak3TzW',3,NULL,'2026-07-27 18:36:37','2026-07-27 18:36:37'),(9,'Fernanda Soto','fernanda@cinemaito.com',NULL,NULL,'$2y$12$Rq6q74TDxEt6pYyhy3Ja6.y1BS.Q2jLpJfNUA0iJo0xYdDA4NySw6',3,NULL,'2026-07-27 18:36:37','2026-07-27 18:36:37'),(10,'Gabriel Torres','gabriel@cinemaito.com',NULL,NULL,'$2y$12$ZqH7juPRdQ518KoCavpg6utnPtGvGRu38PEUGuubt/5srZfAUSBKu',2,NULL,'2026-07-27 18:36:37','2026-07-27 18:36:37'),(11,'Hilda Ramos','hilda@cinemaito.com',NULL,NULL,'$2y$12$7hdW2k8qJ1ehJ5.GNOXnVegRTykTTmNYfsSSSg7x1rLRoVmRxOURu',3,NULL,'2026-07-27 18:36:37','2026-07-27 18:36:37'),(12,'Ivan Castillo','ivan@cinemaito.com',NULL,NULL,'$2y$12$tEhzGf0sRL6YyyNFE.zVJeN5i/xrilZlTl5xkNij56JBLDy5NyqcO',3,NULL,'2026-07-27 18:36:38','2026-07-27 18:36:38'),(13,'ruben','ruben@gmail.com',NULL,NULL,'$2y$12$llXnhVxQPhrA/hLZJZ74q.sMJweeWUuJu63gLZGHwteUKCCStxd1m',3,NULL,'2026-07-27 18:40:53','2026-07-27 18:40:53'),(14,'Gabriel Mendez','amendezhernandez01@gmail.com',NULL,'https://lh3.googleusercontent.com/a/ACg8ocI9Br-zpZKttPWroK7lJsxiw4TTy35D3uQ6yfp5NKeGcF8q_kk7=s96-c','$2y$12$NLWN30IoPho.Krh1cnApV.Q0K9jvjaO3Tz6fNI3Bo9nFburGGnFiO',3,'GgymqBLSe0V1m5ffY5GzN38JjFMLqDzAafWdnV07vuqE3bar4iCRoeZYIHSI','2026-07-28 07:01:26','2026-07-29 02:59:37'),(15,'Angel Mendoza','wezzydanae@gmail.com',NULL,NULL,'$2y$12$KR7wMbg5iBzI3dw7DwfFXOCJnGG8lucXKluikaRctIHSEkpsfvhWi',3,NULL,'2026-07-28 07:05:56','2026-07-28 07:05:56'),(20,'Magda Valencia','vmagda328@gmail.com',NULL,'https://lh3.googleusercontent.com/a/ACg8ocJZTfjLWTImH5kXxCjvmGpHotmNB5NgDwUB_IezIfsqg7Ob6g=s96-c','$2y$12$nzNhYdb.NtJzyZf887USi.5uz0Q1LMHJJszI0DfxKcurNzPZmDlmG',3,NULL,'2026-07-29 01:20:23','2026-07-29 01:20:23'),(22,'Gabriel Perez','cegador55@gmail.com',NULL,NULL,'$2y$12$mN8pmOsr..TphfGWkHarf.X.A9YuYRSrJClbVOuBGNI1E3sUHiKz2',3,NULL,'2026-07-29 07:31:25','2026-07-29 07:31:25'),(23,'Angel Ant','ce.gador55@gmail.com',NULL,NULL,'$2y$12$ZQqstJ5qRngKmROkonVoUOT4IUV1hxir1xS87Sgk6/NDVaBF3.0E2',3,NULL,'2026-07-29 07:41:23','2026-07-29 07:41:23'),(27,'ANGEL GABRIEL ANTONIO MENDEZ','22161002@itoaxaca.edu.mx',NULL,'https://lh3.googleusercontent.com/a/ACg8ocKHpdwXWxHtdKWAxNfTV6jK_vvQunuHSnaLng3gjume28pz1Q=s96-c','$2y$12$4v8yUBk1pAqIXbVQSAVZXOq6hxsrOfbFm2go.IHW3iZPwXAXnwhsC',3,NULL,'2026-07-29 15:39:26','2026-07-29 15:39:26'),(28,'Gabrielon Ramirez','22161.002@itoaxaca.edu.mx',NULL,NULL,'$2y$12$3eCZYXmXz8tMjbq6dPlke..Tk3y9EwJzuSNAndy5dxrSR2gTeFsLa',3,NULL,'2026-07-29 15:45:16','2026-07-29 15:45:16'),(30,'Cegador','c.egador55@gmail.com',NULL,NULL,'$2y$12$RmZvjhtGqIpPGXu4hP0tfuboSA63K0rk5ycK6/FuKiF1Vdezk8X9.',3,NULL,'2026-07-29 15:46:12','2026-07-29 15:46:12'),(31,'omar valencia','22161258@gmail.com',NULL,NULL,'$2y$12$2cRm73GHsLhs7bVnH7b6lOLRkBfutlORsTvZh8KLbIJR2sQcQDXxq',3,NULL,'2026-07-29 15:49:10','2026-07-29 15:49:10'),(34,'ruben','22161258@itoaxaca.edu.mx',NULL,'https://lh3.googleusercontent.com/a/ACg8ocLPj9SXGn9c7PftrL-LXV8eA-KRaCX6ifFX9K8tNfwZbiUkGVY=s96-c','$2y$12$Oc/gmt7GbL14lMLL9H/3cupdTpM3/LVCJtJ9zjNAdkaUfXmmHKvpi',3,NULL,'2026-07-29 17:58:54','2026-07-29 18:04:58'),(35,'Valencia Borja Omar Rutilio','omarrutiliovalenciaborja@gmail.com',NULL,'https://lh3.googleusercontent.com/a/ACg8ocLUkGaiaJuyoXn0P_wzAp9hsG2BwN4w--jqtHWG6q3LwUx4fxWKLw=s96-c','$2y$12$w0iyckV8XGImKByxey.w8uIRR9CUvAgLtTifZFwnXT.zC7/E1RWEu',3,NULL,'2026-07-29 18:05:54','2026-07-29 18:05:54');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'cine_ito'
--

--
-- Dumping routines for database 'cine_ito'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-29 22:15:53
