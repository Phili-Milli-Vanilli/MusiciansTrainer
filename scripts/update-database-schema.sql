-- Update database schema to support phases and optional songs
USE musician_training;

-- Add phase column to exercises table
ALTER TABLE exercises 
ADD COLUMN phase INT NOT NULL DEFAULT 1 AFTER song;

-- Make song column nullable (optional)
ALTER TABLE exercises 
MODIFY COLUMN song VARCHAR(255) NULL;

-- Add index for phase filtering
CREATE INDEX idx_exercises_phase ON exercises(phase);

-- Update sample data to include phases
UPDATE exercises SET phase = 1 WHERE id <= 6;
UPDATE exercises SET phase = 2 WHERE id > 6 AND id <= 10;
UPDATE exercises SET phase = 3 WHERE id > 10;

-- Add some phase 2 variations of existing exercises
INSERT INTO exercises (day_of_week, name, bpm, page, book, song, phase) VALUES
('Monday', 'Scale Practice Advanced', 140, '15', 'Hanon Piano Exercises', 'C Major Scale', 2),
('Monday', 'Chord Progressions Advanced', 100, '23', 'Jazz Piano Book', 'ii-V-I Progression', 2),
('Tuesday', 'Arpeggios Advanced', 120, '45', 'Classical Studies', 'Am Arpeggio', 2),
('Wednesday', 'Sight Reading Advanced', 80, '67', 'Sight Reading Complete', 'Bach Invention No. 1', 2),
('Thursday', 'Jazz Standards Advanced', 140, '34', 'Real Book Vol. 1', 'Autumn Leaves', 2),
('Friday', 'Classical Repertoire Advanced', 100, '1', 'Chopin Nocturnes', 'Nocturne Op. 9 No. 2', 2);

-- Add some exercises without songs (technique-focused)
INSERT INTO exercises (day_of_week, name, bpm, page, book, song, phase) VALUES
('Monday', 'Finger Independence Drills', 100, '12', 'Technical Studies', NULL, 1),
('Tuesday', 'Rhythm Clapping Exercise', 0, '5', 'Rhythm Method', NULL, 1),
('Wednesday', 'Hand Coordination', 80, '34', 'Piano Technique', NULL, 1),
('Thursday', 'Pedal Technique', 60, '78', 'Advanced Piano', NULL, 2),
('Friday', 'Dynamic Control', 90, '23', 'Expression Studies', NULL, 2);
