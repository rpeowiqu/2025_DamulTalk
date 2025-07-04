-- MySQL dump 10.13  Distrib 9.3.0, for macos15.2 (arm64)
--
-- Host: localhost    Database: damulTalk
-- ------------------------------------------------------
-- Server version	9.3.0

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
-- Table structure for table `chat_room_members`
--

DROP TABLE IF EXISTS `chat_room_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_room_members` (
  `room_member_id` int NOT NULL AUTO_INCREMENT,
  `room_id` int NOT NULL,
  `user_id` int NOT NULL,
  `last_read_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `joined_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`room_member_id`),
  KEY `fk_chat_room_members_room` (`room_id`),
  KEY `fk_user` (`user_id`),
  CONSTRAINT `fk_chat_room_members_room` FOREIGN KEY (`room_id`) REFERENCES `chat_rooms` (`room_id`),
  CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_room_members`
--

LOCK TABLES `chat_room_members` WRITE;
/*!40000 ALTER TABLE `chat_room_members` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_room_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_rooms`
--

DROP TABLE IF EXISTS `chat_rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_rooms` (
  `room_id` int NOT NULL AUTO_INCREMENT,
  `room_type` enum('PRIVATE','GROUP') COLLATE utf8mb4_unicode_ci DEFAULT 'PRIVATE',
  `room_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '기본적으로 참여자 이름이 들어갈 예정',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `room_size` int NOT NULL DEFAULT '2',
  PRIMARY KEY (`room_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_rooms`
--

LOCK TABLES `chat_rooms` WRITE;
/*!40000 ALTER TABLE `chat_rooms` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `friends`
--

DROP TABLE IF EXISTS `friends`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `friends` (
  `friend_id` int NOT NULL AUTO_INCREMENT,
  `first_user_id` int NOT NULL,
  `second_user_id` int NOT NULL,
  `status` enum('PENDING','ACCEPTED','REJECTED') COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `requested_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `accepted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`friend_id`),
  KEY `fk_friends_first_user` (`first_user_id`),
  KEY `fk_friends_second_user` (`second_user_id`),
  CONSTRAINT `fk_friends_first_user` FOREIGN KEY (`first_user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `fk_friends_second_user` FOREIGN KEY (`second_user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friends`
--

LOCK TABLES `friends` WRITE;
/*!40000 ALTER TABLE `friends` DISABLE KEYS */;
INSERT INTO `friends` VALUES (1,1,2,'ACCEPTED','2025-07-01 23:39:06',NULL),(3,6,5,'ACCEPTED','2025-07-04 14:47:07',NULL);
/*!40000 ALTER TABLE `friends` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '이메일 형식',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '인코딩되어 저장',
  `nickname` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '영/한 상관 없이 12자 제한',
  `profile_image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '기본이미지는 존재하게',
  `status_message` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `joined_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uk_users_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'damulTalk@gmail.com','$2a$10$iGxb25HplzVviYAA/Mg2S.GC3HVee601/HoObNV9iu8CiC3IXJUWW','damulTalk',NULL,NULL,'2025-06-22 13:37:50'),(2,'ssafy@ssafy.com','$2a$10$iGxb25HplzVviYAA/Mg2S.GC3HVee601/HoObNV9iu8CiC3IXJUWW','ssafy',NULL,NULL,'2025-07-01 23:23:34'),(3,'safy@ssafy.com','$2a$10$iGxb25HplzVviYAA/Mg2S.GC3HVee601/HoObNV9iu8CiC3IXJUWW','토마토러버전종우',NULL,NULL,'2025-07-03 18:47:33'),(4,'saffy@ssafy.com','$2a$10$iGxb25HplzVviYAA/Mg2S.GC3HVee601/HoObNV9iu8CiC3IXJUWWW','토마토',NULL,NULL,'2025-07-03 18:48:10'),(5,'jj@ssafy.com','$2a$10$.mdnmjCNbDCXoKbVWsty0uIBiqfCcnEhUv.MQp1muc0HuDtLgnoom','종우',NULL,NULL,'2025-07-04 14:32:27'),(6,'kk@kk.com','$2a$10$xL09qgDf6R2ho4P/mT7/gOHzrmnHmhV3Oq8meyX2c2zZ250WXqmyC','kk',NULL,NULL,'2025-07-04 14:46:50');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-04 15:09:00
