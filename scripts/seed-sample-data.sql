-- Insert sample exercises for testing
USE musician_training;

INSERT INTO exercises (day_of_week, name, bpm, page, book, song) VALUES
('Monday', 'Scale Practice', 120, '15', 'Hanon Piano Exercises', 'C Major Scale'),
('Monday', 'Chord Progressions', 80, '23', 'Jazz Piano Book', 'ii-V-I Progression'),
('Tuesday', 'Arpeggios', 100, '45', 'Classical Studies', 'Am Arpeggio'),
('Tuesday', 'Rhythm Exercise', 90, '12', 'Rhythm Mastery', 'Syncopation Pattern 1'),
('Wednesday', 'Sight Reading', 60, '67', 'Sight Reading Complete', 'Bach Invention No. 1'),
('Wednesday', 'Technical Studies', 140, '89', 'Czerny Studies', 'Study Op. 299 No. 1'),
('Thursday', 'Jazz Standards', 120, '34', 'Real Book Vol. 1', 'Autumn Leaves'),
('Thursday', 'Improvisation', 100, '56', 'Jazz Improvisation', 'Blues Scale Exercise'),
('Friday', 'Classical Repertoire', 80, '1', 'Chopin Nocturnes', 'Nocturne Op. 9 No. 2'),
('Friday', 'Finger Independence', 110, '78', 'Finger Gym', 'Exercise Set A'),
('Saturday', 'Song Learning', 75, '45', 'Popular Piano', 'Yesterday - Beatles'),
('Saturday', 'Ear Training', 0, '23', 'Ear Training Method', 'Interval Recognition'),
('Sunday', 'Review Session', 100, 'Various', 'Mixed Repertoire', 'Weekly Review');
