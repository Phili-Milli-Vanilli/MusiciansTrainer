-- Create database for musician training app
CREATE DATABASE IF NOT EXISTS musician_training;
USE musician_training;

-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
    id INT AUTO_INCREMENT PRIMARY KEY,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    name VARCHAR(255) NOT NULL,
    bpm INT NOT NULL DEFAULT 120,
    page VARCHAR(50),
    book VARCHAR(255),
    song VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create exercise_completions table to track when exercises are completed
CREATE TABLE IF NOT EXISTS exercise_completions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exercise_id INT NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    week_start DATE NOT NULL,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
    UNIQUE KEY unique_completion (exercise_id, week_start)
);

-- Create index for better performance
CREATE INDEX idx_exercises_day ON exercises(day_of_week);
CREATE INDEX idx_completions_week ON exercise_completions(week_start);
CREATE INDEX idx_completions_date ON exercise_completions(completed_at);
