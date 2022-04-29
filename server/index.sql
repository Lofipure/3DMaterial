-- MySQL dump 10.13  Distrib 8.0.28, for macos11 (arm64)
--
-- Host: localhost    Database: 3d_material
-- ------------------------------------------------------
-- Server version	8.0.28

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
-- Table structure for table `goods`
--

CREATE Database 3d_material;

DROP TABLE IF EXISTS `goods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `goods` (
  `record_id` int NOT NULL AUTO_INCREMENT,
  `uid` int DEFAULT NULL,
  `mid` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`record_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goods`
--

LOCK TABLES `goods` WRITE;
/*!40000 ALTER TABLE `goods` DISABLE KEYS */;
INSERT INTO `goods` VALUES (1,2,2,'2022-04-09 04:23:34','2022-04-09 04:23:34'),(2,1,1,'2022-04-28 00:09:02','2022-04-28 00:09:02'),(3,2,1,'2022-04-28 11:14:29','2022-04-28 11:14:29'),(4,1,2,'2022-04-29 02:19:10','2022-04-29 02:19:10');
/*!40000 ALTER TABLE `goods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `models`
--

DROP TABLE IF EXISTS `models`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `models` (
  `mid` int NOT NULL AUTO_INCREMENT,
  `model_name` varchar(255) DEFAULT NULL,
  `model_desc` varchar(255) DEFAULT NULL,
  `model_cover` varchar(255) DEFAULT NULL,
  `model_url` varchar(255) DEFAULT NULL,
  `model_intro` text,
  `auth` tinyint DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`mid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `models`
--

LOCK TABLES `models` WRITE;
/*!40000 ALTER TABLE `models` DISABLE KEYS */;
INSERT INTO `models` VALUES (1,'小鸭子','开发测试Blender导出模型，是一只敲可爱的小鸭子。','http://192.168.1.100:9015/file/model_cover/4guvvkadwii2nmryigpunn99cover.png','http://192.168.1.100:9015/file/model_url/tj0wau5vw1ryi30w0gr1yozpuntitled.gltf','# 开发测试Blender导出模型\n\n> 一个小鸭子\n\n??????\n',3,'2022-04-09 01:09:55','2022-04-29 12:32:32'),(2,'小狐狸','小狐狸测试。','http://192.168.1.100:9015/file/model_cover/g5nb9yltrjtmkts4hcaaxu5afox.png','http://192.168.1.100:9015/file/model_url/765ogz0tc34husxcrijexwtuuntitled.gltf','# 加个标题\n\n小狐狸测试小狐狸测试小狐狸测试小狐狸测试小狐狸测试。\n\n> 123123123\n',2,'2022-04-09 04:22:26','2022-04-29 12:32:49');
/*!40000 ALTER TABLE `models` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `models_and_users`
--

DROP TABLE IF EXISTS `models_and_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `models_and_users` (
  `record_id` int NOT NULL AUTO_INCREMENT,
  `mid` int DEFAULT NULL,
  `uid` int DEFAULT NULL,
  `is_owner` tinyint DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`record_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `models_and_users`
--

LOCK TABLES `models_and_users` WRITE;
/*!40000 ALTER TABLE `models_and_users` DISABLE KEYS */;
INSERT INTO `models_and_users` VALUES (1,1,1,1,'2022-04-09 01:09:55','2022-04-09 01:09:55'),(2,2,1,1,'2022-04-09 04:22:26','2022-04-09 04:22:26'),(3,1,2,0,'2022-04-09 04:24:00','2022-04-09 04:24:00');
/*!40000 ALTER TABLE `models_and_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `tid` int NOT NULL AUTO_INCREMENT,
  `tag_name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`tid`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES (1,'Blender','2022-04-09 01:08:37','2022-04-29 12:18:38'),(2,'开发测试','2022-04-09 01:08:50','2022-04-09 01:08:50');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags_and_models`
--

DROP TABLE IF EXISTS `tags_and_models`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags_and_models` (
  `record_id` int NOT NULL AUTO_INCREMENT,
  `tid` int DEFAULT NULL,
  `mid` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`record_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags_and_models`
--

LOCK TABLES `tags_and_models` WRITE;
/*!40000 ALTER TABLE `tags_and_models` DISABLE KEYS */;
INSERT INTO `tags_and_models` VALUES (1,1,1,'2022-04-09 01:09:55','2022-04-09 01:09:55'),(2,2,1,'2022-04-09 01:09:55','2022-04-09 01:09:55'),(3,1,2,'2022-04-09 04:22:26','2022-04-09 04:22:26');
/*!40000 ALTER TABLE `tags_and_models` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags_and_users`
--

DROP TABLE IF EXISTS `tags_and_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags_and_users` (
  `record_id` int NOT NULL AUTO_INCREMENT,
  `uid` int DEFAULT NULL,
  `tid` int DEFAULT NULL,
  `is_owner` tinyint DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`record_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags_and_users`
--

LOCK TABLES `tags_and_users` WRITE;
/*!40000 ALTER TABLE `tags_and_users` DISABLE KEYS */;
INSERT INTO `tags_and_users` VALUES (1,1,1,1,'2022-04-09 01:08:37','2022-04-09 01:08:37'),(2,1,2,1,'2022-04-09 01:08:50','2022-04-09 01:08:50'),(3,2,1,0,'2022-04-09 04:24:00','2022-04-09 04:24:00'),(4,2,2,0,'2022-04-09 04:24:00','2022-04-09 04:24:00');
/*!40000 ALTER TABLE `tags_and_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `update_models`
--

DROP TABLE IF EXISTS `update_models`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `update_models` (
  `record_id` bigint NOT NULL AUTO_INCREMENT,
  `mid` int DEFAULT NULL,
  `uid` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`record_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `update_models`
--

LOCK TABLES `update_models` WRITE;
/*!40000 ALTER TABLE `update_models` DISABLE KEYS */;
INSERT INTO `update_models` VALUES (1,1,1,'2022-04-09 03:47:37','2022-04-09 03:47:37'),(2,1,1,'2022-04-09 04:19:48','2022-04-09 04:19:48'),(3,1,1,'2022-04-09 04:20:16','2022-04-09 04:20:16'),(4,1,1,'2022-04-09 04:20:35','2022-04-09 04:20:35'),(5,1,1,'2022-04-09 04:23:12','2022-04-09 04:23:12'),(6,2,1,'2022-04-09 04:23:16','2022-04-09 04:23:16'),(7,2,1,'2022-04-10 08:04:18','2022-04-10 08:04:18'),(8,2,1,'2022-04-10 08:04:27','2022-04-10 08:04:27'),(9,2,1,'2022-04-10 08:05:24','2022-04-10 08:05:24'),(10,2,1,'2022-04-27 05:21:14','2022-04-27 05:21:14'),(11,2,1,'2022-04-27 05:21:38','2022-04-27 05:21:38'),(12,2,1,'2022-04-29 01:29:19','2022-04-29 01:29:19'),(13,2,1,'2022-04-29 01:38:58','2022-04-29 01:38:58'),(14,1,1,'2022-04-29 08:34:05','2022-04-29 08:34:05'),(15,1,1,'2022-04-29 12:17:28','2022-04-29 12:17:28'),(16,2,1,'2022-04-29 12:17:43','2022-04-29 12:17:43'),(17,2,1,'2022-04-29 12:18:17','2022-04-29 12:18:17'),(18,1,1,'2022-04-29 12:30:42','2022-04-29 12:30:42'),(19,1,1,'2022-04-29 12:31:18','2022-04-29 12:31:18'),(20,2,1,'2022-04-29 12:31:33','2022-04-29 12:31:33'),(21,1,1,'2022-04-29 12:32:32','2022-04-29 12:32:32'),(22,2,1,'2022-04-29 12:32:49','2022-04-29 12:32:49');
/*!40000 ALTER TABLE `update_models` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `uid` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `user_avatar` varchar(255) DEFAULT NULL,
  `sex` tinyint DEFAULT NULL,
  `login_token` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Wang ZiHeng','littlebanana@126.com','123','http://192.168.1.100:9015/file/user_avatar/1bokx8dte7quyyktyidekmtsavatar.png',1,'f23aace985a9ef0471dafab7848737c4','2022-04-09 01:07:56','2022-04-29 14:04:01'),(2,'Jiang Jia','wangziheng.0915@bytedance.com','123','http://192.168.1.100:9015/file/user_avatar/29e4kdngfm31t0s21gkuu67stest.png',2,'f23aace985a9ef0471dafab7848737c4','2022-04-09 04:19:06','2022-04-29 08:55:21');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visits`
--

DROP TABLE IF EXISTS `visits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `visits` (
  `record_id` bigint NOT NULL AUTO_INCREMENT,
  `uid` int DEFAULT NULL,
  `mid` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`record_id`)
) ENGINE=InnoDB AUTO_INCREMENT=231 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visits`
--

LOCK TABLES `visits` WRITE;
/*!40000 ALTER TABLE `visits` DISABLE KEYS */;
INSERT INTO `visits` VALUES (107,1,1,'2022-04-09 13:12:21','2022-04-09 13:12:21'),(108,1,2,'2022-04-09 13:12:28','2022-04-09 13:12:28'),(109,1,1,'2022-04-09 13:16:04','2022-04-09 13:16:04'),(110,1,2,'2022-04-09 13:16:09','2022-04-09 13:16:09'),(111,1,1,'2022-04-09 14:19:41','2022-04-09 14:19:41'),(112,1,2,'2022-04-09 14:19:49','2022-04-09 14:19:49'),(113,1,1,'2022-04-09 14:26:30','2022-04-09 14:26:30'),(114,1,2,'2022-04-09 14:26:47','2022-04-09 14:26:47'),(115,1,2,'2022-04-09 14:45:07','2022-04-09 14:45:07'),(116,1,1,'2022-04-09 14:45:15','2022-04-09 14:45:15'),(117,1,2,'2022-04-10 01:11:42','2022-04-10 01:11:42'),(118,1,1,'2022-04-10 08:03:20','2022-04-10 08:03:20'),(119,1,2,'2022-04-10 08:03:26','2022-04-10 08:03:26'),(120,1,2,'2022-04-10 08:04:36','2022-04-10 08:04:36'),(121,1,1,'2022-04-10 08:04:40','2022-04-10 08:04:40'),(122,1,2,'2022-04-10 08:04:41','2022-04-10 08:04:41'),(123,1,2,'2022-04-10 08:04:46','2022-04-10 08:04:46'),(124,1,2,'2022-04-10 08:05:34','2022-04-10 08:05:34'),(125,1,1,'2022-04-10 08:05:36','2022-04-10 08:05:36'),(126,1,1,'2022-04-10 08:05:39','2022-04-10 08:05:39'),(127,1,2,'2022-04-10 08:05:44','2022-04-10 08:05:44'),(128,1,1,'2022-04-10 08:05:51','2022-04-10 08:05:51'),(129,1,2,'2022-04-17 01:02:18','2022-04-17 01:02:18'),(130,1,1,'2022-04-25 07:52:40','2022-04-25 07:52:40'),(131,1,1,'2022-04-26 12:32:32','2022-04-26 12:32:32'),(132,1,1,'2022-04-27 02:41:39','2022-04-27 02:41:39'),(133,1,1,'2022-04-27 02:41:43','2022-04-27 02:41:43'),(134,1,2,'2022-04-27 02:41:48','2022-04-27 02:41:48'),(135,1,2,'2022-04-27 08:10:54','2022-04-27 08:10:54'),(136,1,1,'2022-04-27 08:10:56','2022-04-27 08:10:56'),(137,1,2,'2022-04-27 08:10:57','2022-04-27 08:10:57'),(138,1,1,'2022-04-28 00:08:34','2022-04-28 00:08:34'),(139,1,1,'2022-04-28 00:09:01','2022-04-28 00:09:01'),(140,1,2,'2022-04-28 00:53:33','2022-04-28 00:53:33'),(141,1,1,'2022-04-28 02:47:33','2022-04-28 02:47:33'),(142,1,2,'2022-04-28 02:47:36','2022-04-28 02:47:36'),(143,1,2,'2022-04-28 04:35:58','2022-04-28 04:35:58'),(144,1,1,'2022-04-28 04:48:26','2022-04-28 04:48:26'),(145,1,1,'2022-04-28 04:48:28','2022-04-28 04:48:28'),(146,1,1,'2022-04-28 04:48:29','2022-04-28 04:48:29'),(147,1,1,'2022-04-28 04:48:30','2022-04-28 04:48:30'),(148,1,1,'2022-04-28 04:48:31','2022-04-28 04:48:31'),(149,1,1,'2022-04-28 04:48:32','2022-04-28 04:48:32'),(150,1,1,'2022-04-28 04:48:33','2022-04-28 04:48:33'),(151,1,1,'2022-04-28 04:48:36','2022-04-28 04:48:36'),(152,1,1,'2022-04-28 04:48:37','2022-04-28 04:48:37'),(153,1,1,'2022-04-28 04:48:37','2022-04-28 04:48:37'),(154,1,1,'2022-04-28 04:48:43','2022-04-28 04:48:43'),(155,1,1,'2022-04-28 04:48:49','2022-04-28 04:48:49'),(156,1,1,'2022-04-28 04:48:55','2022-04-28 04:48:55'),(157,1,1,'2022-04-28 04:48:56','2022-04-28 04:48:56'),(158,1,1,'2022-04-28 04:48:57','2022-04-28 04:48:57'),(159,1,1,'2022-04-28 04:49:11','2022-04-28 04:49:11'),(160,1,1,'2022-04-28 04:49:12','2022-04-28 04:49:12'),(161,1,1,'2022-04-28 11:14:09','2022-04-28 11:14:09'),(162,2,2,'2022-04-28 11:14:25','2022-04-28 11:14:25'),(163,2,1,'2022-04-28 11:14:28','2022-04-28 11:14:28'),(164,1,1,'2022-04-28 11:42:48','2022-04-28 11:42:48'),(165,1,2,'2022-04-28 11:42:50','2022-04-28 11:42:50'),(166,1,1,'2022-04-28 11:42:52','2022-04-28 11:42:52'),(167,1,2,'2022-04-28 11:42:54','2022-04-28 11:42:54'),(168,1,1,'2022-04-28 11:42:57','2022-04-28 11:42:57'),(169,1,1,'2022-04-28 11:43:32','2022-04-28 11:43:32'),(170,1,2,'2022-04-28 11:43:33','2022-04-28 11:43:33'),(171,1,2,'2022-04-28 11:43:45','2022-04-28 11:43:45'),(172,1,1,'2022-04-28 15:16:47','2022-04-28 15:16:47'),(173,1,2,'2022-04-28 15:17:01','2022-04-28 15:17:01'),(174,1,2,'2022-04-29 00:37:01','2022-04-29 00:37:01'),(175,1,1,'2022-04-29 00:37:03','2022-04-29 00:37:03'),(176,1,2,'2022-04-29 00:37:05','2022-04-29 00:37:05'),(177,1,2,'2022-04-29 00:39:50','2022-04-29 00:39:50'),(178,1,2,'2022-04-29 00:40:10','2022-04-29 00:40:10'),(179,1,1,'2022-04-29 00:40:15','2022-04-29 00:40:15'),(180,1,1,'2022-04-29 00:44:38','2022-04-29 00:44:38'),(181,2,1,'2022-04-29 01:28:44','2022-04-29 01:28:44'),(182,2,2,'2022-04-29 01:28:45','2022-04-29 01:28:45'),(183,1,2,'2022-04-29 01:29:23','2022-04-29 01:29:23'),(184,1,1,'2022-04-29 01:36:05','2022-04-29 01:36:05'),(185,1,2,'2022-04-29 01:36:07','2022-04-29 01:36:07'),(186,1,1,'2022-04-29 01:36:09','2022-04-29 01:36:09'),(187,1,2,'2022-04-29 01:36:10','2022-04-29 01:36:10'),(188,1,1,'2022-04-29 01:36:13','2022-04-29 01:36:13'),(189,1,2,'2022-04-29 01:36:15','2022-04-29 01:36:15'),(190,1,1,'2022-04-29 01:36:19','2022-04-29 01:36:19'),(191,1,2,'2022-04-29 01:36:56','2022-04-29 01:36:56'),(192,1,1,'2022-04-29 01:37:00','2022-04-29 01:37:00'),(193,1,1,'2022-04-29 02:14:38','2022-04-29 02:14:38'),(194,1,2,'2022-04-29 02:16:47','2022-04-29 02:16:47'),(195,1,2,'2022-04-29 02:18:47','2022-04-29 02:18:47'),(196,1,2,'2022-04-29 02:18:49','2022-04-29 02:18:49'),(197,1,2,'2022-04-29 02:18:50','2022-04-29 02:18:50'),(198,1,2,'2022-04-29 02:19:09','2022-04-29 02:19:09'),(199,1,1,'2022-04-29 02:48:05','2022-04-29 02:48:05'),(200,1,1,'2022-04-29 03:38:22','2022-04-29 03:38:22'),(201,2,1,'2022-04-29 07:47:04','2022-04-29 07:47:04'),(202,2,1,'2022-04-29 08:07:54','2022-04-29 08:07:54'),(203,1,1,'2022-04-29 08:15:58','2022-04-29 08:15:58'),(204,1,2,'2022-04-29 08:20:43','2022-04-29 08:20:43'),(205,1,1,'2022-04-29 08:34:47','2022-04-29 08:34:47'),(206,1,2,'2022-04-29 08:36:42','2022-04-29 08:36:42'),(207,1,1,'2022-04-29 08:36:51','2022-04-29 08:36:51'),(208,1,1,'2022-04-29 08:41:47','2022-04-29 08:41:47'),(209,1,2,'2022-04-29 08:48:39','2022-04-29 08:48:39'),(210,1,2,'2022-04-29 08:49:32','2022-04-29 08:49:32'),(211,1,1,'2022-04-29 09:14:25','2022-04-29 09:14:25'),(212,1,2,'2022-04-29 09:15:38','2022-04-29 09:15:38'),(213,1,1,'2022-04-29 10:36:03','2022-04-29 10:36:03'),(214,1,1,'2022-04-29 10:36:30','2022-04-29 10:36:30'),(215,1,2,'2022-04-29 10:36:38','2022-04-29 10:36:38'),(216,1,1,'2022-04-29 10:38:55','2022-04-29 10:38:55'),(217,1,2,'2022-04-29 10:39:00','2022-04-29 10:39:00'),(218,1,1,'2022-04-29 10:40:14','2022-04-29 10:40:14'),(219,1,1,'2022-04-29 11:18:27','2022-04-29 11:18:27'),(220,1,2,'2022-04-29 12:13:50','2022-04-29 12:13:50'),(221,1,1,'2022-04-29 12:14:46','2022-04-29 12:14:46'),(222,1,2,'2022-04-29 12:32:08','2022-04-29 12:32:08'),(223,1,2,'2022-04-29 12:33:35','2022-04-29 12:33:35'),(224,1,1,'2022-04-29 13:01:16','2022-04-29 13:01:16'),(225,1,1,'2022-04-29 13:03:17','2022-04-29 13:03:17'),(226,1,1,'2022-04-29 13:10:43','2022-04-29 13:10:43'),(227,1,2,'2022-04-29 13:15:26','2022-04-29 13:15:26'),(228,1,1,'2022-04-29 13:17:14','2022-04-29 13:17:14'),(229,1,1,'2022-04-29 14:04:24','2022-04-29 14:04:24'),(230,1,2,'2022-04-29 14:04:36','2022-04-29 14:04:36');
/*!40000 ALTER TABLE `visits` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-04-29 22:11:26
