/**
 * types/index.ts — Shared Type Definitions
 * ==========================================
 * PARADIGM: Functional Programming (with TypeScript type safety)
 *
 * This module defines the core data shapes used throughout the frontend.
 * TypeScript interfaces enforce STRUCTURAL CONTRACTS at compile time,
 * while `Readonly<>` enforces IMMUTABILITY — a core functional principle.
 *
 * COMPARISON WITH PYTHON (OOP):
 * In Python, these would be CLASS definitions with __init__, properties,
 * and private attributes. Here, they are INTERFACES — pure data contracts
 * with no behavior attached. Functions operate ON these shapes.
 */

// ─── Attendance Status ───────────────────────────────────────────────
// In functional programming, we use constants instead of Enum classes.
// `as const` creates a readonly object with literal types.

export const ATTENDANCE_STATUS = {
  PRESENT: "present",
  ABSENT: "absent",
  LATE: "late",
  EXCUSED: "excused",
} as const;

/** Union type derived from ATTENDANCE_STATUS values */
export type AttendanceStatus =
  (typeof ATTENDANCE_STATUS)[keyof typeof ATTENDANCE_STATUS];

// ─── Student Status ──────────────────────────────────────────────────

export const STUDENT_STATUS = {
  ENROLLED: "enrolled",
  LATE_ENROLLED: "late_enrolled",
  DROPPED: "dropped",
  SUSPENDED: "suspended",
} as const;

/** Union type derived from STUDENT_STATUS values */
export type StudentStatus =
  (typeof STUDENT_STATUS)[keyof typeof STUDENT_STATUS];

// ─── Data Shapes ─────────────────────────────────────────────────────
// All interfaces use `readonly` to enforce immutability at the type level.
// In functional programming, data should never be mutated — only new
// copies should be created.

/**
 * Student — A plain data object representing a student.
 *
 * PARADIGM NOTE:
 * This is just a DATA SHAPE — it has no methods, no constructor,
 * no behavior. Functions operate on Student objects, but the
 * Student itself doesn't "do" anything.
 *
 * In OOP Python, this would be a class with __init__, properties,
 * is_active() method, full_name property, etc.
 */
export interface Student {
  readonly studentId: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly status: StudentStatus;
  readonly enrolledDate: string;
}

/**
 * AttendanceRecord — A plain data object representing one attendance entry.
 *
 * PARADIGM NOTE:
 * Immutable by design (readonly). To "update" a record, you create
 * a new object with the spread operator: { ...record, timeOut: now }
 */
export interface AttendanceRecord {
  readonly studentId: string;
  readonly date: string;
  readonly status: AttendanceStatus;
  readonly timestamp: number;
  readonly timeIn: number | null;
  readonly timeOut: number | null;
}

/**
 * TimeRecord — A plain data object for time-in/time-out tracking.
 */
export interface TimeRecord {
  readonly studentId: string;
  readonly timeIn: number;
  readonly timeOut: number | null;
}

/**
 * AttendanceSummary — The output of the generateStudentSummary function.
 *
 * PARADIGM NOTE:
 * This is a RETURN TYPE — it defines the shape of a computed result.
 * In OOP Python, this would be a dictionary returned by
 * analytics_service.student_summary().
 */
export interface AttendanceSummary {
  readonly totalPresent: number;
  readonly totalAbsent: number;
  readonly totalLate: number;
  readonly totalExcused: number;
  readonly totalDaysAttended: number;
  readonly totalSchoolDays: number;
  readonly attendancePercentage: number;
  readonly absencePercentage: number;
  readonly latePercentage: number;
  readonly consecutiveAbsences: number;
  readonly consecutiveLates: number;
}

/**
 * StreakAccumulator — Internal type for the reduce-based streak calculation.
 *
 * PARADIGM NOTE:
 * This type is used by the `reduce` higher-order function to track
 * streak state WITHOUT mutable variables.
 */
export interface StreakAccumulator {
  readonly max: number;
  readonly current: number;
}
