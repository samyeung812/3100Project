-- MySQL dump 10.13  Distrib 8.0.23, for Win64 (x86_64)
--
-- Host: localhost    Database: nodeserverdb
-- ------------------------------------------------------
-- Server version	8.0.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `battlelog`
--

DROP TABLE IF EXISTS `battlelog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `battlelog` (
  `userid` int NOT NULL,
  `opponentid` int NOT NULL,
  `ranked` tinyint(1) NOT NULL,
  `win` tinyint(1) NOT NULL,
  `rankchange` smallint NOT NULL,
  `battledate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `userid` (`userid`),
  KEY `opponentid` (`opponentid`),
  CONSTRAINT `battlelog_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `accounts` (`userid`),
  CONSTRAINT `battlelog_ibfk_2` FOREIGN KEY (`opponentid`) REFERENCES `accounts` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `battlelog`
--

LOCK TABLES `battlelog` WRITE;
/*!40000 ALTER TABLE `battlelog` DISABLE KEYS */;
INSERT INTO `battlelog` VALUES (2,1,1,1,30,'2021-04-13 16:22:21'),(1,2,1,0,0,'2021-04-13 16:22:21'),(2,1,0,1,0,'2021-04-13 16:32:45'),(1,2,0,0,0,'2021-04-13 16:32:45'),(2,1,0,0,0,'2021-04-13 16:33:57'),(1,2,0,1,0,'2021-04-13 16:33:57'),(1,2,1,1,29,'2021-04-13 16:41:15'),(2,1,1,0,-29,'2021-04-13 16:41:15'),(1,2,1,0,-29,'2021-04-13 16:42:59'),(2,1,1,1,30,'2021-04-13 16:42:59'),(2,1,0,1,0,'2021-04-13 16:47:18'),(1,2,0,0,0,'2021-04-13 16:47:18'),(2,1,0,1,0,'2021-04-13 16:48:32'),(1,2,0,0,0,'2021-04-13 16:48:32'),(1,2,1,0,0,'2021-04-13 16:50:06'),(2,1,1,1,29,'2021-04-13 16:50:06'),(2,3,1,1,28,'2021-04-13 17:05:47'),(3,2,1,0,0,'2021-04-13 17:05:47'),(4,1,1,0,0,'2021-04-13 17:21:11'),(1,4,1,1,30,'2021-04-13 17:21:11'),(3,2,1,0,0,'2021-04-13 17:30:36'),(2,3,1,1,28,'2021-04-13 17:30:36'),(1,4,1,0,-29,'2021-04-13 17:38:44'),(4,1,1,1,29,'2021-04-13 17:38:44'),(5,2,1,0,0,'2021-04-13 17:45:04'),(2,5,1,1,27,'2021-04-13 17:45:04'),(1,4,1,0,-1,'2021-04-13 17:52:17'),(4,1,1,1,30,'2021-04-13 17:52:17'),(6,5,1,1,30,'2021-04-13 18:21:21'),(5,6,1,0,0,'2021-04-13 18:21:21'),(2,3,1,1,28,'2021-04-13 18:44:38'),(3,2,1,0,0,'2021-04-13 18:44:38'),(1,5,1,0,0,'2021-04-14 06:19:01'),(5,1,1,1,30,'2021-04-14 06:19:01');
/*!40000 ALTER TABLE `battlelog` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-04-14 14:34:10
