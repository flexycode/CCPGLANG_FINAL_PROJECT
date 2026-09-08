/**
 * attendance.js — Attendance Management Utilities
 * ================================================
 * PARADIGM: Functional Programming
 *
 * This module contains PURE FUNCTIONS for managing attendance records.
 * Every function:
 * - Takes data as input parameters (no hidden state)
 * - Returns new data without mutating inputs (immutability)
 * - Produces the same output for the same input (deterministic)
 * - Has no side effects (no database calls, no console logs, no mutations)
 *
 * COMPARISON WITH PYTHON (OOP):
 * In the OOP approach, attendance operations are METHODS on an
 * AttendanceTracker object that maintains internal state (self.__records).
 * Here, records are passed in and new records are returned — the functions
 * don't "own" any data.
 */

// ─── Constants ────────────────────────────────────────────────────────
// In functional programming, we use constants instead of Enum classes.
// These are simple values — no class hierarchy needed.

export const ATTENDANCE_STATUS = Object.freeze({
  PRESENT: "present",
  ABSENT: "absent",
  LATE: "late",
  EXCUSED: "excused",
});

export const STUDENT_STATUS = Object.freeze({
  ENROLLED: "enrolled",
  LATE_ENROLLED: "late_enrolled",
  DROPPED: "dropped",
  SUSPENDED: "suspended",
});

// ─── Record Creation ─────────────────────────────────────────────────

/**
 * createAttendanceRecord — Creates a new attendance record object.
 *
 * PARADIGM NOTE:
 * This is a FACTORY FUNCTION — it creates and returns a new plain object.
 * In OOP Python, this would be: AttendanceRecord(student_id, date, status)
 * which invokes __init__ on a class. Here, we just return a plain object.
 *
 * @param {string} studentId - The student's unique identifier
 * @param {string} date - The date string (e.g., "2026-09-15")
 * @param {string} status - One of ATTENDANCE_STATUS values
 * @returns {Object} A new attendance record object
 */
export const createAttendanceRecord = (studentId, date, status) => ({
  studentId,
  date,
  status,
  timestamp: Date.now(),
  timeIn: null,
  timeOut: null,
});

/**
 * createStudent — Creates a new student data object.
 *
 * PARADIGM NOTE:
 * No class, no constructor, no `new` keyword. Just a function that
 * returns a plain object. The student doesn't "know" anything about
 * itself — it's just data.
 *
 * @param {string} studentId - Unique identifier
 * @param {string} firstName - Student's first name
 * @param {string} lastName - Student's last name
 * @param {string} status - One of STUDENT_STATUS values
 * @returns {Object} A new student data object
 */
export const createStudent = (
  studentId,
  firstName,
  lastName,
  status = STUDENT_STATUS.ENROLLED
) => ({
  studentId,
  firstName,
  lastName,
  status,
  enrolledDate: new Date().toISOString(),
});

// ─── Attendance Operations ───────────────────────────────────────────

/**
 * markAttendance — Adds a new attendance record to the records array.
 *
 * PARADIGM NOTE:
 * This is a PURE FUNCTION — it does NOT modify the original `records`
 * array. Instead, it returns a NEW array with the record appended.
 * The spread operator (...) creates a shallow copy.
 *
 * In OOP Python: tracker.mark_attendance(student_id, date, status)
 * → mutates self.__records internally.
 *
 * @param {Array} records - Existing attendance records (NOT mutated)
 * @param {string} studentId - The student's unique identifier
 * @param {string} date - The date string
 * @param {string} status - Attendance status
 * @returns {Array} A NEW array with all previous records plus the new one
 */
export const markAttendance = (records, studentId, date, status) => [
  ...records,
  createAttendanceRecord(studentId, date, status),
];

/**
 * getRecordsForStudent — Filters records for a specific student.
 *
 * PARADIGM NOTE:
 * Uses Array.filter() — a HIGHER-ORDER FUNCTION that takes a predicate
 * (a function returning true/false) and returns a new array containing
 * only elements where the predicate returns true.
 *
 * In OOP Python: tracker.get_records_for_student(student_id)
 * → uses list comprehension on self.__records.
 *
 * @param {Array} records - All attendance records
 * @param {string} studentId - The student to filter for
 * @returns {Array} Records belonging to the specified student
 */
export const getRecordsForStudent = (records, studentId) =>
  records.filter((record) => record.studentId === studentId);

/**
 * updateStudentStatus — Returns a new student object with updated status.
 *
 * PARADIGM NOTE:
 * IMMUTABILITY: We never modify the original student object. Instead,
 * the spread operator creates a copy with the status overridden.
 *
 * In OOP Python: student.update_status(new_status) → mutates self.__status.
 *
 * @param {Object} student - The original student object (NOT mutated)
 * @param {string} newStatus - The new status value
 * @returns {Object} A NEW student object with the updated status
 */
export const updateStudentStatus = (student, newStatus) => ({
  ...student,
  status: newStatus,
});

/**
 * isStudentActive — Checks if a student can attend classes.
 *
 * @param {Object} student - The student data object
 * @returns {boolean} True if enrolled or late_enrolled
 */
export const isStudentActive = (student) =>
  [STUDENT_STATUS.ENROLLED, STUDENT_STATUS.LATE_ENROLLED].includes(
    student.status
  );

/**
 * getFullName — Derives the full name from a student object.
 *
 * PARADIGM NOTE:
 * In OOP Python, this would be a @property on the Student class:
 * student.full_name → computed from self.__last_name, self.__first_name.
 * Here, it's a standalone function that receives the student as data.
 *
 * @param {Object} student - The student data object
 * @returns {string} Formatted full name
 */
export const getFullName = (student) =>
  `${student.lastName}, ${student.firstName}`;
