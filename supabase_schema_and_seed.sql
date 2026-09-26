-- =============================================================================
-- Checkmate Attendance Monitoring System
-- Supabase / PostgreSQL Database Schema & Seed Data
-- =============================================================================
-- Compatible with PostgreSQL 14+ / Supabase SQL Editor
-- Run this entire script in Supabase: Dashboard -> SQL Editor -> New Query -> Run
-- =============================================================================

-- 1. Create Tables
-- -----------------------------------------------------------------------------

-- Drop existing tables if re-running
DROP TABLE IF EXISTS attendance_records CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;

-- Students table
CREATE TABLE students (
    id VARCHAR(20) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'enrolled',
    enrolled_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Attendance Records table
CREATE TABLE attendance_records (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    date VARCHAR(10) NOT NULL, -- Format: YYYY-MM-DD
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
    time_in TIMESTAMPTZ,
    time_out TIMESTAMPTZ,
    remarks VARCHAR(255),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster student & date attendance lookups
CREATE INDEX idx_attendance_student_id ON attendance_records(student_id);
CREATE INDEX idx_attendance_date ON attendance_records(date);

-- Notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    message VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'warning',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    relative_time VARCHAR(50) NOT NULL DEFAULT 'Just now',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Faculty User Settings table
CREATE TABLE user_settings (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL DEFAULT 'Scaluya7',
    full_name VARCHAR(100) NOT NULL DEFAULT 'Susan S. Caluya',
    email VARCHAR(100) NOT NULL DEFAULT 'sscaluya@national-u.edu.ph',
    role VARCHAR(50) NOT NULL DEFAULT 'Faculty',
    department VARCHAR(100) NOT NULL DEFAULT 'Faculty',
    avatar_url VARCHAR(255),
    absence_threshold INTEGER NOT NULL DEFAULT 4,
    late_threshold INTEGER NOT NULL DEFAULT 3,
    email_alerts_enabled BOOLEAN NOT NULL DEFAULT TRUE
);

-- -----------------------------------------------------------------------------
-- 2. Seed Default User Settings
-- -----------------------------------------------------------------------------
INSERT INTO user_settings (
    username, full_name, email, role, department, absence_threshold, late_threshold, email_alerts_enabled
) VALUES (
    'Scaluya7', 'Susan S. Caluya', 'sscaluya@national-u.edu.ph', 'Faculty', 'Computer Science Department', 4, 3, TRUE
);

-- -----------------------------------------------------------------------------
-- 3. Seed 50 Students Dataset
-- -----------------------------------------------------------------------------
INSERT INTO students (id, first_name, last_name, status) VALUES
('2023-001', 'James', 'Smith', 'enrolled'),
('2023-002', 'Christopher', 'Anderson', 'enrolled'),
('2023-003', 'Ronald', 'Clark', 'enrolled'),
('2023-004', 'Mary', 'Wright', 'enrolled'),
('2023-005', 'Lisa', 'Mitchell', 'enrolled'),
('2023-006', 'Michelle', 'Johnson', 'enrolled'),
('2023-007', 'John', 'Thomas', 'enrolled'),
('2023-008', 'Daniel', 'Rodriguez', 'enrolled'),
('2023-009', 'Anthony', 'Lopez', 'enrolled'),
('2023-010', 'Patricia', 'Perez', 'enrolled'),
('2023-011', 'Nancy', 'Williams', 'enrolled'),
('2023-012', 'Laura', 'Jackson', 'enrolled'),
('2023-013', 'Robert', 'Lewis', 'enrolled'),
('2023-014', 'Paul', 'Hill', 'enrolled'),
('2023-015', 'Kevin', 'Roberts', 'enrolled'),
('2023-016', 'Linda', 'Jones', 'enrolled'),
('2023-017', 'Karen', 'White', 'enrolled'),
('2023-018', 'Sarah', 'Lee', 'enrolled'),
('2023-019', 'Michael', 'Scott', 'enrolled'),
('2023-020', 'Mark', 'Turner', 'enrolled'),
('2023-021', 'Jason', 'Brown', 'enrolled'),
('2023-022', 'Barbara', 'Harris', 'enrolled'),
('2023-023', 'Betty', 'Walker', 'enrolled'),
('2023-024', 'Kimberly', 'Green', 'enrolled'),
('2023-025', 'William', 'Phillips', 'enrolled'),
('2023-026', 'Donald', 'Davis', 'enrolled'),
('2023-027', 'Jeff', 'Martin', 'enrolled'),
('2023-028', 'Elizabeth', 'Hall', 'enrolled'),
('2023-029', 'Helen', 'Adams', 'enrolled'),
('2023-030', 'Deborah', 'Campbell', 'enrolled'),
('2023-031', 'David', 'Miller', 'enrolled'),
('2023-032', 'George', 'Thompson', 'enrolled'),
('2023-033', 'Jennifer', 'Allen', 'enrolled'),
('2023-034', 'Sandra', 'Baker', 'enrolled'),
('2023-035', 'Richard', 'Parker', 'enrolled'),
('2023-036', 'Kenneth', 'Wilson', 'enrolled'),
('2023-037', 'Maria', 'Garcia', 'enrolled'),
('2023-038', 'Donna', 'Young', 'enrolled'),
('2023-039', 'Charles', 'Gonzalez', 'enrolled'),
('2023-040', 'Steven', 'Evans', 'enrolled'),
('2023-041', 'Susan', 'Moore', 'enrolled'),
('2023-042', 'Carol', 'Martinez', 'enrolled'),
('2023-043', 'Joseph', 'Hernandez', 'enrolled'),
('2023-044', 'Edward', 'Nelson', 'enrolled'),
('2023-045', 'Margaret', 'Edwards', 'enrolled'),
('2023-046', 'Ruth', 'Taylor', 'enrolled'),
('2023-047', 'Thomas', 'Robinson', 'enrolled'),
('2023-048', 'Brian', 'King', 'enrolled'),
('2023-049', 'Dorothy', 'Carter', 'enrolled'),
('2023-050', 'Sharon', 'Collins', 'enrolled'),
('2022-348291-01', 'James Adrian', 'Castro', 'enrolled'),
('2022-348291-02', 'Marco Polo', 'Cunanan', 'enrolled'),
('2022-348291-03', 'Rinoah Venedict', 'Dela Rama', 'enrolled'),
('2022-348291-04', 'Jannah Cleine', 'Glodo', 'enrolled'),
('2022-348291-05', 'Jersey Mae', 'Marisga', 'enrolled'),
('2022-348291-06', 'Jed Nathan', 'Poserio', 'enrolled'),
('2022-348291-07', 'Jay Arre', 'Talosig', 'enrolled');

-- -----------------------------------------------------------------------------
-- 4. Seed Attendance Records for Today & Recent Sessions
-- -----------------------------------------------------------------------------
-- Sample date: Today / Current session
INSERT INTO attendance_records (student_id, date, status, time_in, remarks) VALUES
('2023-001', '2026-09-22', 'present', '2026-09-22 15:02:00+08', 'On time'),
('2023-002', '2026-09-22', 'present', '2026-09-22 15:04:12+08', 'On time'),
('2023-003', '2026-09-22', 'absent', NULL, 'Unexcused'),
('2023-004', '2026-09-22', 'present', '2026-09-22 15:01:45+08', 'On time'),
('2023-005', '2026-09-22', 'late', '2026-09-22 15:22:10+08', 'Heavy traffic along Commonwealth'),
('2023-006', '2026-09-22', 'present', '2026-09-22 15:03:00+08', 'On time'),
('2023-007', '2026-09-22', 'present', '2026-09-22 15:05:11+08', 'On time'),
('2023-008', '2026-09-22', 'present', '2026-09-22 15:02:30+08', 'On time'),
('2023-009', '2026-09-22', 'absent', NULL, 'Medical appointment'),
('2023-010', '2026-09-22', 'present', '2026-09-22 15:00:20+08', 'Early arrival'),
('2023-011', '2026-09-22', 'late', '2026-09-22 15:18:40+08', 'Commute delay'),
('2023-012', '2026-09-22', 'present', '2026-09-22 15:04:00+08', 'On time'),
('2023-013', '2026-09-22', 'present', '2026-09-22 15:02:10+08', 'On time'),
('2023-014', '2026-09-22', 'present', '2026-09-22 15:05:44+08', 'On time'),
('2023-015', '2026-09-22', 'excused', NULL, 'Varsity athletics training'),
('2023-016', '2026-09-22', 'present', '2026-09-22 15:01:00+08', 'On time'),
('2023-017', '2026-09-22', 'present', '2026-09-22 15:03:15+08', 'On time'),
('2023-018', '2026-09-22', 'present', '2026-09-22 15:02:50+08', 'On time'),
('2023-019', '2026-09-22', 'late', '2026-09-22 15:25:00+08', 'Advising session overlap'),
('2023-020', '2026-09-22', 'present', '2026-09-22 15:00:55+08', 'On time'),
('2023-021', '2026-09-22', 'present', '2026-09-22 15:04:30+08', 'On time'),
('2023-022', '2026-09-22', 'present', '2026-09-22 15:03:40+08', 'On time'),
('2023-023', '2026-09-22', 'absent', NULL, 'Sick leave'),
('2023-024', '2026-09-22', 'present', '2026-09-22 15:01:25+08', 'On time'),
('2023-025', '2026-09-22', 'present', '2026-09-22 15:05:00+08', 'On time'),
('2023-026', '2026-09-22', 'present', '2026-09-22 15:02:18+08', 'On time'),
('2023-027', '2026-09-22', 'late', '2026-09-22 15:19:05+08', 'LRT maintenance delay'),
('2023-028', '2026-09-22', 'present', '2026-09-22 15:03:10+08', 'On time'),
('2023-029', '2026-09-22', 'present', '2026-09-22 15:00:40+08', 'On time'),
('2023-030', '2026-09-22', 'present', '2026-09-22 15:04:50+08', 'On time'),
('2023-031', '2026-09-22', 'present', '2026-09-22 15:02:05+08', 'On time'),
('2023-032', '2026-09-22', 'present', '2026-09-22 15:03:55+08', 'On time'),
('2023-033', '2026-09-22', 'absent', NULL, 'Unexcused'),
('2023-034', '2026-09-22', 'present', '2026-09-22 15:01:10+08', 'On time'),
('2023-035', '2026-09-22', 'present', '2026-09-22 15:05:15+08', 'On time'),
('2023-036', '2026-09-22', 'late', '2026-09-22 15:20:30+08', 'Lab session ran overtime'),
('2023-037', '2026-09-22', 'present', '2026-09-22 15:02:22+08', 'On time'),
('2023-038', '2026-09-22', 'present', '2026-09-22 15:04:00+08', 'On time'),
('2023-039', '2026-09-22', 'present', '2026-09-22 15:01:30+08', 'On time'),
('2023-040', '2026-09-22', 'present', '2026-09-22 15:03:00+08', 'On time'),
('2023-041', '2026-09-22', 'present', '2026-09-22 15:02:40+08', 'On time'),
('2023-042', '2026-09-22', 'absent', NULL, 'Flu symptoms'),
('2023-043', '2026-09-22', 'present', '2026-09-22 15:00:50+08', 'On time'),
('2023-044', '2026-09-22', 'present', '2026-09-22 15:04:20+08', 'On time'),
('2023-045', '2026-09-22', 'present', '2026-09-22 15:03:10+08', 'On time'),
('2023-046', '2026-09-22', 'late', '2026-09-22 15:24:00+08', 'Rainstorm weather slowdown'),
('2023-047', '2026-09-22', 'present', '2026-09-22 15:01:40+08', 'On time'),
('2023-048', '2026-09-22', 'present', '2026-09-22 15:02:15+08', 'On time'),
('2023-049', '2026-09-22', 'excused', NULL, 'Official academic conference'),
('2023-050', '2026-09-22', 'present', '2026-09-22 15:03:00+08', 'On time');

-- -----------------------------------------------------------------------------
-- 5. Seed Notifications
-- -----------------------------------------------------------------------------
INSERT INTO notifications (title, message, category, is_read, relative_time) VALUES
('Absence Warning: Clark, Ronald', 'Clark, Ronald (2023-003) has reached 3 consecutive unexcused absences.', 'warning', FALSE, '10 minutes ago'),
('Late Advisory: Mitchell, Lisa', 'Mitchell, Lisa (2023-005) recorded 3 tardiness entries this week.', 'warning', FALSE, '1 hour ago'),
('Class Attendance Complete', 'Attendance for CCPGLANG - COM232 (Programming Languages) is fully recorded for today.', 'system', TRUE, '2 hours ago');
