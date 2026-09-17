/**
 * analytics.ts — Attendance Analytics Utilities
 * ==============================================
 * PARADIGM: Functional Programming (with TypeScript type safety)
 *
 * This module contains PURE FUNCTIONS for calculating attendance
 * analytics and metrics. Every function receives data as parameters
 * and returns computed results without side effects.
 *
 * KEY FUNCTIONAL CONCEPTS DEMONSTRATED:
 * - Higher-order functions (filter, reduce, map)
 * - Function composition (combining smaller functions)
 * - Pure functions (no side effects, deterministic)
 * - Closures (functions that capture variables from outer scope)
 *
 * TYPESCRIPT ADDITIONS:
 * - Generic types ensure type-safe accumulator in reduce()
 * - Return types document the contract of each function
 * - ReadonlyArray prevents accidental mutation of input data
 *
 * COMPARISON WITH PYTHON (OOP):
 * In the OOP approach, these calculations are METHODS on the
 * AttendanceTracker class (e.g., tracker.attendance_percentage("STU-001")).
 * The tracker owns the data and the methods operate on self.__records.
 * Here, the data is always passed in as a parameter.
 */

import type {
  AttendanceRecord,
  AttendanceStatus,
  AttendanceSummary,
  StreakAccumulator,
} from '../types/index.ts';
import { ATTENDANCE_STATUS } from '../types/index.ts';

// ─── Counting Functions ──────────────────────────────────────────────

/**
 * countByStatus — Counts records matching a specific attendance status.
 *
 * PARADIGM NOTE:
 * Uses Array.filter() — a HIGHER-ORDER FUNCTION. The arrow function
 * (r) => r.status === status is a PREDICATE passed as an argument.
 * This is function composition: filter uses our predicate to decide
 * which elements to keep.
 *
 * In OOP Python: tracker.count_by_status(student_id, status)
 * → uses sum() with a generator expression on self.__records.
 */
export const countByStatus = (
  records: ReadonlyArray<AttendanceRecord>,
  status: AttendanceStatus
): number =>
  records.filter((r) => r.status === status).length;

/**
 * totalPresent — Counts PRESENT records.
 *
 * PARADIGM NOTE:
 * This is FUNCTION COMPOSITION — it delegates to countByStatus,
 * partially applying the status parameter. This is equivalent to
 * creating a specialized function from a general one.
 */
export const totalPresent = (
  records: ReadonlyArray<AttendanceRecord>
): number =>
  countByStatus(records, ATTENDANCE_STATUS.PRESENT);

/**
 * totalAbsent — Counts ABSENT records.
 */
export const totalAbsent = (
  records: ReadonlyArray<AttendanceRecord>
): number =>
  countByStatus(records, ATTENDANCE_STATUS.ABSENT);

/**
 * totalLate — Counts LATE records.
 */
export const totalLate = (
  records: ReadonlyArray<AttendanceRecord>
): number =>
  countByStatus(records, ATTENDANCE_STATUS.LATE);

/**
 * totalExcused — Counts EXCUSED records.
 */
export const totalExcused = (
  records: ReadonlyArray<AttendanceRecord>
): number =>
  countByStatus(records, ATTENDANCE_STATUS.EXCUSED);

/**
 * totalDaysAttended — Counts days the student was physically in class.
 *
 * PURPOSE:
 * Both PRESENT and LATE count as attendance, since the student was
 * physically present in both cases.
 *
 * Formula: totalPresent + totalLate
 */
export const totalDaysAttended = (
  records: ReadonlyArray<AttendanceRecord>
): number =>
  totalPresent(records) + totalLate(records);

// ─── Percentage Calculations ─────────────────────────────────────────

/**
 * calculatePercentage — Generic percentage calculator.
 *
 * PARADIGM NOTE:
 * This is a GENERIC UTILITY function — it doesn't know anything
 * about attendance. It's a reusable building block that other
 * functions compose with. This is the essence of functional
 * programming: build small, generic functions and compose them.
 */
export const calculatePercentage = (part: number, total: number): number =>
  total === 0 ? 0 : Math.round((part / total) * 10000) / 100;

/**
 * attendancePercentage — Calculates overall attendance rate.
 *
 * PARADIGM NOTE:
 * FUNCTION COMPOSITION: This function composes totalDaysAttended()
 * and calculatePercentage() together. Each function does one thing
 * well, and this function orchestrates them.
 *
 * In OOP Python: tracker.attendance_percentage(student_id)
 * → calls self.total_days_attended() / self.__total_school_days
 *
 * Formula: (totalDaysAttended / totalSchoolDays) × 100
 */
export const attendancePercentage = (
  records: ReadonlyArray<AttendanceRecord>,
  totalSchoolDays: number
): number =>
  calculatePercentage(totalDaysAttended(records), totalSchoolDays);

/**
 * absencePercentage — Calculates overall absence rate.
 *
 * Formula: (totalAbsent / totalSchoolDays) × 100
 */
export const absencePercentage = (
  records: ReadonlyArray<AttendanceRecord>,
  totalSchoolDays: number
): number =>
  calculatePercentage(totalAbsent(records), totalSchoolDays);

/**
 * latePercentage — Calculates overall late rate.
 *
 * Formula: (totalLate / totalSchoolDays) × 100
 */
export const latePercentage = (
  records: ReadonlyArray<AttendanceRecord>,
  totalSchoolDays: number
): number =>
  calculatePercentage(totalLate(records), totalSchoolDays);

// ─── Streak Calculations ─────────────────────────────────────────────

/**
 * calculateConsecutiveStreak — Finds the longest consecutive streak of a status.
 *
 * PARADIGM NOTE:
 * This uses Array.reduce() — the MOST POWERFUL higher-order function.
 * reduce() transforms an entire array into a single value by applying
 * a function to each element along with an ACCUMULATOR.
 *
 * The accumulator { max, current } tracks the streak state WITHOUT
 * mutable variables — each iteration returns a NEW accumulator object.
 *
 * TYPESCRIPT NOTE:
 * The `StreakAccumulator` type ensures the accumulator shape is
 * consistent across all iterations. TypeScript catches errors if
 * we forget to return `max` or `current`.
 *
 * In OOP Python: tracker.consecutive_absences(student_id)
 * → uses a for loop with mutable max_streak and current_streak variables.
 */
export const calculateConsecutiveStreak = (
  records: ReadonlyArray<AttendanceRecord>,
  status: AttendanceStatus
): number =>
  records.reduce<StreakAccumulator>(
    (acc, record) => {
      const current = record.status === status ? acc.current + 1 : 0;
      return { max: Math.max(acc.max, current), current };
    },
    { max: 0, current: 0 }
  ).max;

/**
 * consecutiveAbsences — Longest consecutive absence streak.
 *
 * PURPOSE:
 * Identifies students who may be at risk due to extended absences.
 * A high consecutive absence count may trigger academic intervention.
 */
export const consecutiveAbsences = (
  records: ReadonlyArray<AttendanceRecord>
): number =>
  calculateConsecutiveStreak(records, ATTENDANCE_STATUS.ABSENT);

/**
 * consecutiveLates — Longest consecutive late streak.
 *
 * PURPOSE:
 * Identifies patterns of chronic tardiness.
 */
export const consecutiveLates = (
  records: ReadonlyArray<AttendanceRecord>
): number =>
  calculateConsecutiveStreak(records, ATTENDANCE_STATUS.LATE);

// ─── Summary Report ──────────────────────────────────────────────────

/**
 * generateStudentSummary — Creates a complete attendance summary.
 *
 * PARADIGM NOTE:
 * This function COMPOSES all the individual analytics functions into
 * a single, comprehensive output. It demonstrates how functional
 * programming builds complex behavior from simple, reusable parts.
 *
 * TYPESCRIPT NOTE:
 * The return type `AttendanceSummary` guarantees that every field
 * is present and correctly typed. If we add a new metric to the
 * interface, TypeScript will flag this function as incomplete.
 *
 * In OOP Python: analytics_service.student_summary(student_id)
 * → calls multiple methods on the tracker object.
 */
export const generateStudentSummary = (
  records: ReadonlyArray<AttendanceRecord>,
  totalSchoolDays: number
): AttendanceSummary => ({
  totalPresent: totalPresent(records),
  totalAbsent: totalAbsent(records),
  totalLate: totalLate(records),
  totalExcused: totalExcused(records),
  totalDaysAttended: totalDaysAttended(records),
  totalSchoolDays,
  attendancePercentage: attendancePercentage(records, totalSchoolDays),
  absencePercentage: absencePercentage(records, totalSchoolDays),
  latePercentage: latePercentage(records, totalSchoolDays),
  consecutiveAbsences: consecutiveAbsences(records),
  consecutiveLates: consecutiveLates(records),
});
