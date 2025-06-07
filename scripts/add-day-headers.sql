-- Add day headers support to the database
USE musician_training;

-- Create day_headers table
CREATE TABLE IF NOT EXISTS day_headers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL UNIQUE,
    header_text VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create backup_logs table to track exports
CREATE TABLE IF NOT EXISTS backup_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    backup_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    exercises_count INT NOT NULL,
    file_name VARCHAR(255),
    notes TEXT
);

-- Insert some sample day headers
INSERT INTO day_headers (day_of_week, header_text) VALUES
('Monday', 'Chords'),
('Tuesday', 'Scales'),
('Wednesday', 'Sight Reading'),
('Thursday', 'Jazz'),
('Friday', 'Songs'),
('Saturday', 'Review'),
('Sunday', 'Free Play')
ON DUPLICATE KEY UPDATE header_text = VALUES(header_text);

-- Add index for better performance
CREATE INDEX idx_day_headers_day ON day_headers(day_of_week);
