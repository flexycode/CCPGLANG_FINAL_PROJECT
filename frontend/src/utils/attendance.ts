/**
 * attendance.ts — Attendance Management Utilities
 * ================================================
 * PARADIGM: Functional Programming (with TypeScript type safety)
 *
 * This module contains PURE FUNCTIONS for managing attendance records.
 * Every function:
 * - Takes data as input parameters (no hidden state)
 * - Returns new data without mutating inputs (immutability)
 * - Produces the same output for the same input (deterministic)
 * - Has no side effects (no database calls, no console logs, no mutations)
 *
 * TYPESCRIPT ADDITIONS:
 * - Explicit parameter and return types enforce contracts at compile time
 * - `Readonly<>` and `readonly` arrays prevent accidental mutation
 * - Union types (AttendanceStatus) replace runtime validation
 *
 * COMPARISON WITH PYTHON (OOP):
 * In the OOP approach, attendance operations are METHODS on an
 * AttendanceTracker object that maintains internal state (self.__records).
 * Here, records are passed in and new records are returned — the functions
 * don't "own" any data.
 */

import type { AttendanceRecord, Student, StudentStatus, AttendanceStatus } from '../types/index.ts';

// Re-export the constants from types for backwards compatibility
export { ATTENDANCE_STATUS, STUDENT_STATUS } from '../types/index.ts';

// ─── Record Creation ─────────────────────────────────────────────────

/**
 * createAttendanceRecord — Creates a new attendance record object.
 *
 * PARADIGM NOTE:
 * This is a FACTORY FUNCTION — it creates and returns a new plain object.
 * In OOP Python, this would be: AttendanceRecord(student_id, date, status)
 * which invokes __init__ on a class. Here, we just return a plain object.
 *
 * TYPESCRIPT NOTE:
 * The return type is explicitly `AttendanceRecord`, ensuring the shape
 * matches our interface. The `AttendanceStatus` parameter type restricts
 * inputs to valid values at compile time.
 */
export const createAttendanceRecord = (
  studentId: string,
  date: string,
  status: AttendanceStatus
): AttendanceRecord => ({
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
 * TYPESCRIPT NOTE:
 * Default parameter `status` uses the `StudentStatus` type, preventing
 * invalid status values at compile time. In Python OOP, this validation
 * would happen at runtime inside __init__.
 */
export const createStudent = (
  studentId: string,
  firstName: string,
  lastName: string,
  status: StudentStatus = "enrolled"
): Student => ({
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
 * TYPESCRIPT NOTE:
 * `ReadonlyArray<AttendanceRecord>` as input enforces that we cannot
 * call .push() or .splice() on it. The return type is a new array.
 *
 * In OOP Python: tracker.mark_attendance(student_id, date, status)
 * → mutates self.__records internally.
 */
export const markAttendance = (
  records: ReadonlyArray<AttendanceRecord>,
  studentId: string,
  date: string,
  status: AttendanceStatus
): AttendanceRecord[] => [
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
 */
export const getRecordsForStudent = (
  records: ReadonlyArray<AttendanceRecord>,
  studentId: string
): AttendanceRecord[] =>
  records.filter((record) => record.studentId === studentId);

/**
 * updateStudentStatus — Returns a new student object with updated status.
 *
 * PARADIGM NOTE:
 * IMMUTABILITY: We never modify the original student object. Instead,
 * the spread operator creates a copy with the status overridden.
 *
 * In OOP Python: student.update_status(new_status) → mutates self.__status.
 */
export const updateStudentStatus = (
  student: Student,
  newStatus: StudentStatus
): Student => ({
  ...student,
  status: newStatus,
});

/**
 * isStudentActive — Checks if a student can attend classes.
 */
export const isStudentActive = (student: Student): boolean =>
  (["enrolled", "late_enrolled"] as StudentStatus[]).includes(student.status);

/**
 * getFullName — Derives the full name from a student object.
 *
 * PARADIGM NOTE:
 * In OOP Python, this would be a @property on the Student class:
 * student.full_name → computed from self.__last_name, self.__first_name.
 * Here, it's a standalone function that receives the student as data.
 */
export const getFullName = (student: Student): string =>
  `${student.lastName}, ${student.firstName}`;
