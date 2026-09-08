/**
 * time.js — Time Tracking Utilities
 * ==================================
 * PARADIGM: Functional Programming
 *
 * This module contains PURE FUNCTIONS for managing time-in/time-out
 * records and determining lateness.
 *
 * KEY FUNCTIONAL CONCEPTS DEMONSTRATED:
 * - Immutability: Time records are never mutated; new objects are returned
 * - Pure functions: Same inputs always produce the same outputs
 * - Spread operator: Creates copies of objects with modifications
 *
 * COMPARISON WITH PYTHON (OOP):
 * In Python, TimeEntry is a CLASS with mutable state:
 *   entry = TimeEntry("STU-001")
 *   entry.record_time_out()  ← mutates the object
 *
 * Here, we create NEW objects instead of mutating:
 *   const entry = recordTimeIn("STU-001");
 *   const completed = recordTimeOut(entry);  ← returns new object
 */

// ─── Time Record Operations ─────────────────────────────────────────

/**
 * recordTimeIn — Creates a new time-in entry for a student.
 *
 * PARADIGM NOTE:
 * Returns a new plain object. There is no class, no constructor,
 * no `new` keyword. The function simply produces data.
 *
 * In OOP Python: entry = TimeEntry(student_id) → creates an object
 * with self.time_in set in __init__.
 *
 * @param {string} studentId - The student's unique identifier
 * @param {number} [timestamp=Date.now()] - The arrival timestamp
 * @returns {Object} A new time record with timeIn set
 */
export const recordTimeIn = (studentId, timestamp = Date.now()) => ({
  studentId,
  timeIn: timestamp,
  timeOut: null,
});

/**
 * recordTimeOut — Returns a new time record with timeOut filled in.
 *
 * PARADIGM NOTE:
 * IMMUTABILITY in action: The original timeRecord is NOT modified.
 * The spread operator (...) copies all fields, then timeOut is overridden.
 *
 * In OOP Python: entry.record_time_out() → mutates self.time_out directly.
 * The original object IS the modified object.
 *
 * @param {Object} timeRecord - The original time record (NOT mutated)
 * @param {number} [timestamp=Date.now()] - The departure timestamp
 * @returns {Object} A NEW time record with timeOut set
 */
export const recordTimeOut = (timeRecord, timestamp = Date.now()) => ({
  ...timeRecord,
  timeOut: timestamp,
});

// ─── Duration Calculation ────────────────────────────────────────────

/**
 * calculateDuration — Computes the duration between timeIn and timeOut.
 *
 * PARADIGM NOTE:
 * This is a PURE FUNCTION — it receives data and returns a result.
 * It doesn't modify the timeRecord or access any external state.
 *
 * In OOP Python, this is a @property on TimeEntry:
 *   entry.duration → computed from self.time_in and self.time_out
 *
 * @param {Object} timeRecord - A time record with timeIn and timeOut
 * @returns {number|null} Duration in hours (2 decimal places), or null if incomplete
 */
export const calculateDuration = (timeRecord) => {
  if (timeRecord.timeIn == null || timeRecord.timeOut == null) {
    return null;
  }
  const durationMs = timeRecord.timeOut - timeRecord.timeIn;
  return Math.round((durationMs / 3600000) * 100) / 100; // ms → hours
};

// ─── Lateness Detection ──────────────────────────────────────────────

/**
 * isLate — Determines if an arrival time is past the cutoff.
 *
 * PARADIGM NOTE:
 * In OOP Python, the cutoff configuration is stored as an instance
 * attribute (self.__class_start_time, self.__late_threshold_minutes)
 * inside the TimeService class. The method accesses it via `self`.
 *
 * Here, the configuration is passed as parameters — the function
 * has no hidden state or configuration. Everything is explicit.
 *
 * @param {number} arrivalTimestamp - When the student arrived (ms since epoch)
 * @param {number} classStartHour - Class start hour (0-23)
 * @param {number} classStartMinute - Class start minute (0-59)
 * @param {number} [thresholdMinutes=15] - Grace period in minutes
 * @returns {boolean} True if the student arrived after the cutoff
 */
export const isLate = (
  arrivalTimestamp,
  classStartHour,
  classStartMinute,
  thresholdMinutes = 15
) => {
  const arrival = new Date(arrivalTimestamp);
  const arrivalMinutes = arrival.getHours() * 60 + arrival.getMinutes();
  const cutoffMinutes = classStartHour * 60 + classStartMinute + thresholdMinutes;
  return arrivalMinutes > cutoffMinutes;
};

/**
 * createIsLateChecker — Creates a lateness checker with pre-configured cutoff.
 *
 * PARADIGM NOTE:
 * This demonstrates CLOSURES — a fundamental functional programming concept.
 * The returned function "remembers" the classStartHour, classStartMinute,
 * and thresholdMinutes from when it was created, even though the outer
 * function has already returned.
 *
 * In OOP Python, this "remembering" is done via self attributes.
 * In functional JS, closures serve the same purpose without classes.
 *
 * @param {number} classStartHour - Class start hour (0-23)
 * @param {number} classStartMinute - Class start minute (0-59)
 * @param {number} [thresholdMinutes=15] - Grace period in minutes
 * @returns {Function} A function that takes an arrival timestamp and returns boolean
 *
 * @example
 * const checkLate = createIsLateChecker(8, 0, 15);
 * checkLate(someTimestamp); // → true or false
 */
export const createIsLateChecker = (
  classStartHour,
  classStartMinute,
  thresholdMinutes = 15
) => {
  // The returned function CLOSES OVER these variables (closure)
  return (arrivalTimestamp) =>
    isLate(arrivalTimestamp, classStartHour, classStartMinute, thresholdMinutes);
};

// ─── Formatting Utilities ────────────────────────────────────────────

/**
 * formatTimestamp — Formats a timestamp into a human-readable string.
 *
 * @param {number} timestamp - Milliseconds since epoch
 * @param {string} [locale="en-PH"] - Locale for formatting
 * @returns {string} Formatted date-time string
 */
export const formatTimestamp = (timestamp, locale = "en-PH") =>
  new Date(timestamp).toLocaleString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

/**
 * formatDuration — Converts hours to a human-readable duration string.
 *
 * @param {number} hours - Duration in hours
 * @returns {string} Formatted string (e.g., "2h 30m")
 */
export const formatDuration = (hours) => {
  if (hours == null) return "N/A";
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
};
