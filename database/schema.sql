-- NamDTU ATT Kafedra Database Schema
CREATE DATABASE IF NOT EXISTS namdtu_att CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE namdtu_att;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'student', 'teacher') DEFAULT 'student',
  student_id VARCHAR(50),
  provider ENUM('local', 'google', 'telegram', 'github') DEFAULT 'local',
  social_id VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- News table
CREATE TABLE IF NOT EXISTS news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title_uz VARCHAR(500) NOT NULL,
  title_en VARCHAR(500),
  content_uz TEXT NOT NULL,
  content_en TEXT,
  category ENUM('news', 'conference', 'seminar', 'achievement', 'announcement') DEFAULT 'news',
  image VARCHAR(500),
  author VARCHAR(255),
  published_at DATE DEFAULT (CURRENT_DATE),
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Staff/Faculty table
CREATE TABLE IF NOT EXISTS staff (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name_uz VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  position_uz VARCHAR(255),
  position_en VARCHAR(255),
  degree_uz VARCHAR(255),
  degree_en VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  photo VARCHAR(500),
  bio_uz TEXT,
  bio_en TEXT,
  articles INT DEFAULT 0,
  experience INT DEFAULT 0,
  subjects_uz JSON,
  subjects_en JSON,
  social JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Programs table
CREATE TABLE IF NOT EXISTS programs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  level ENUM('bachelor', 'master', 'phd') NOT NULL,
  name_uz VARCHAR(500) NOT NULL,
  name_en VARCHAR(500),
  duration_uz VARCHAR(50),
  duration_en VARCHAR(50),
  description_uz TEXT,
  description_en TEXT,
  courses_uz JSON,
  courses_en JSON,
  seats INT DEFAULT 0,
  tuition_uz VARCHAR(100),
  tuition_en VARCHAR(100)
);

-- Schedule table
CREATE TABLE IF NOT EXISTS schedule (
  id INT AUTO_INCREMENT PRIMARY KEY,
  group_name VARCHAR(50) NOT NULL,
  day ENUM('monday','tuesday','wednesday','thursday','friday','saturday') NOT NULL,
  time_slot VARCHAR(20),
  subject VARCHAR(255),
  teacher VARCHAR(255),
  room VARCHAR(50),
  week_type ENUM('all','odd','even') DEFAULT 'all'
);

-- Research table
CREATE TABLE IF NOT EXISTS research (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('article','project','dissertation','patent') NOT NULL,
  title_uz VARCHAR(500) NOT NULL,
  title_en VARCHAR(500),
  description_uz TEXT,
  description_en TEXT,
  authors JSON,
  year YEAR,
  journal VARCHAR(255),
  doi VARCHAR(255),
  status ENUM('published','in_progress','submitted') DEFAULT 'in_progress',
  funding_uz VARCHAR(255),
  funding_en VARCHAR(255)
);

-- Gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title_uz VARCHAR(255),
  title_en VARCHAR(255),
  image VARCHAR(500) NOT NULL,
  category VARCHAR(50),
  date DATE DEFAULT (CURRENT_DATE),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(500),
  message TEXT NOT NULL,
  read_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents/Files
CREATE TABLE IF NOT EXISTS documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title_uz VARCHAR(500) NOT NULL,
  title_en VARCHAR(500),
  file_path VARCHAR(500) NOT NULL,
  file_type VARCHAR(50),
  file_size VARCHAR(50),
  category ENUM('material','thesis','announcement','other') DEFAULT 'material',
  subject VARCHAR(255),
  author VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@namdtu.uz', '$2a$10$YourHashedPasswordHere', 'admin')
ON DUPLICATE KEY UPDATE name=name;

COMMIT;
