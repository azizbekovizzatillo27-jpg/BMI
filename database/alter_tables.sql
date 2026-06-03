-- Add Russian language columns to existing tables
ALTER TABLE news
ADD COLUMN title_ru VARCHAR(500) AFTER title_en,
ADD COLUMN content_ru TEXT AFTER content_en;

ALTER TABLE staff
ADD COLUMN name_ru VARCHAR(255) AFTER name_en,
ADD COLUMN position_ru VARCHAR(255) AFTER position_en,
ADD COLUMN degree_ru VARCHAR(255) AFTER degree_en,
ADD COLUMN bio_ru TEXT AFTER bio_en,
ADD COLUMN subjects_ru JSON AFTER subjects_en;

ALTER TABLE programs
ADD COLUMN name_ru VARCHAR(500) AFTER name_en,
ADD COLUMN duration_ru VARCHAR(50) AFTER duration_en,
ADD COLUMN description_ru TEXT AFTER description_en,
ADD COLUMN courses_ru JSON AFTER courses_en,
ADD COLUMN tuition_ru VARCHAR(100) AFTER tuition_en;

ALTER TABLE research
ADD COLUMN title_ru VARCHAR(500) AFTER title_en,
ADD COLUMN description_ru TEXT AFTER description_en,
ADD COLUMN funding_ru VARCHAR(255) AFTER funding_en;

ALTER TABLE gallery
ADD COLUMN title_ru VARCHAR(255) AFTER title_en;

ALTER TABLE documents
ADD COLUMN title_ru VARCHAR(500) AFTER title_en;

CREATE TABLE IF NOT EXISTS statistics (
  id INT PRIMARY KEY DEFAULT 1,
  students INT DEFAULT 1250,
  teachers INT DEFAULT 35,
  graduates INT DEFAULT 4500,
  labs INT DEFAULT 8,
  partners INT DEFAULT 12,
  years_active INT DEFAULT 15,
  programs INT DEFAULT 5,
  research_papers INT DEFAULT 120,
  news_count INT DEFAULT 45,
  messages_count INT DEFAULT 15
);

INSERT IGNORE INTO statistics (id) VALUES (1);
