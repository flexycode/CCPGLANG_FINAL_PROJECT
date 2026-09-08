/**
 * analytics.js — Attendance Analytics Utilities
 * ==============================================
 * PARADIGM: Functional Programming
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
 * COMPARISON WITH PYTHON (OOP):
 * In the OOP approach, these calculations are METHODS on the
 * AttendanceTracker class (e.g., tracker.attendance_percentage("STU-001")).
 * The tracker owns the data and the methods operate on self.__records.
 * Here, the data is always passed in as a parameter.
 */

import { ATTENDANCE_STATUS } from "./attendance.js";

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
 *
 * @param {Array} records - Attendance records to count
 * @param {string} status - The status to match
 * @returns {number} Count of matching records
 */
export const countByStatus = (records, status) =>
  records.filter((r) => r.status === status).length;

/**
 * totalPresent — Counts PRESENT records.
 *
 * PARADIGM NOTE:
 * This is FUNCTION COMPOSITION — it delegates to countByStatus,
 * partially applying the status parameter. This is equivalent to
 * creating a specialized function from a general one.
 *
 * @param {Array} records - Attendance records
 * @returns {number} Total present count
 */
export const totalPresent = (records) =>
  countByStatus(records, ATTENDANCE_STATUS.PRESENT);

/**
 * totalAbsent — Counts ABSENT records.
 * @param {Array} records - Attendance records
 * @returns {number} Total absent count
 */
export const totalAbsent = (records) =>
  countByStatus(records, ATTENDANCE_STATUS.ABSENT);

/**
 * totalLate — Counts LATE records.
 * @param {Array} records - Attendance records
 * @returns {number} Total late count
 */
export const totalLate = (records) =>
  countByStatus(records, ATTENDANCE_STATUS.LATE);

/**
 * totalExcused — Counts EXCUSED records.
 * @param {Array} records - Attendance records
 * @returns {number} Total excused count
 */
export const totalExcused = (records) =>
  countByStatus(records, ATTENDANCE_STATUS.EXCUSED);

/**
 * totalDaysAttended — Counts days the student was physically in class.
 *
 * PURPOSE:
 * Both PRESENT and LATE count as attendance, since the student was
 * physically present in both cases.
 *
 * Formula: totalPresent + totalLate
 *
 * @param {Array} records - Attendance records
 * @returns {number} Total days attended (present + late)
 */
export const totalDaysAttended = (records) =>
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
 *
 * @param {number} part - The numerator
 * @param {number} total - The denominator
 * @returns {number} Percentage rounded to 2 decimal places, or 0 if total is 0
 */
export const calculatePercentage = (part, total) =>
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
 *
 * @param {Array} records - Attendance records for one student
 * @param {number} totalSchoolDays - Total scheduled class days
 * @returns {number} Attendance percentage (0-100)
 */
export const attendancePercentage = (records, totalSchoolDays) =>
  calculatePercentage(totalDaysAttended(records), totalSchoolDays);

/**
 * absencePercentage — Calculates overall absence rate.
 *
 * Formula: (totalAbsent / totalSchoolDays) × 100
 *
 * @param {Array} records - Attendance records for one student
 * @param {number} totalSchoolDays - Total scheduled class days
 * @returns {number} Absence percentage (0-100)
 */
export const absencePercentage = (records, totalSchoolDays) =>
  calculatePercentage(totalAbsent(records), totalSchoolDays);

/**
 * latePercentage — Calculates overall late rate.
 *
 * Formula: (totalLate / totalSchoolDays) × 100
 *
 * @param {Array} records - Attendance records for one student
 * @param {number} totalSchoolDays - Total scheduled class days
 * @returns {number} Late percentage (0-100)
 */
export const latePercentage = (records, totalSchoolDays) =>
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
 * In OOP Python: tracker.consecutive_absences(student_id)
 * → uses a for loop with mutable max_streak and current_streak variables.
 *
 * @param {Array} records - Attendance records SORTED BY DATE
 * @param {string} status - The status to find streaks for
 * @returns {number} Length of the longest consecutive streak
 */
export const calculateConsecutiveStreak = (records, status) =>
  records.reduce(
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
 *
 * @param {Array} records - Attendance records sorted by date
 * @returns {number} Longest consecutive absence streak
 */
export const consecutiveAbsences = (records) =>
  calculateConsecutiveStreak(records, ATTENDANCE_STATUS.ABSENT);

/**
 * consecutiveLates — Longest consecutive late streak.
 *
 * PURPOSE:
 * Identifies patterns of chronic tardiness.
 *
 * @param {Array} records - Attendance records sorted by date
 * @returns {number} Longest consecutive late streak
 */
export const consecutiveLates = (records) =>
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
 * In OOP Python: analytics_service.student_summary(student_id)
 * → calls multiple methods on the tracker object.
 *
 * @param {Array} records - All attendance records for one student
 * @param {number} totalSchoolDays - Total scheduled class days
 * @returns {Object} Complete attendance summary
 */
export const generateStudentSummary = (records, totalSchoolDays) => ({
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
