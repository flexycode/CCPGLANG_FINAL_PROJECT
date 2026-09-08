# 🔀 Paradigm Comparison — JavaScript (Functional) vs Python (OOP)

> This document provides **side-by-side code comparisons** for every key feature of the Student Attendance Monitoring System, showing how each programming paradigm approaches the same problem differently.

---

## How to Read This Document

Each section follows this format:

1. **Feature Name** — What the function/method does
2. **JavaScript (Functional)** — The functional implementation with explanation
3. **Python (OOP)** — The object-oriented implementation with explanation
4. **Key Differences** — What makes each approach distinct

---

## 1. Marking Attendance

### JavaScript (Functional)

```javascript
/**
 * markAttendance — Records a student's attendance for a given date.
 * 
 * PARADIGM NOTES:
 * - This is a PURE FUNCTION: it does not modify the original `records` array.
 * - It returns a NEW array with the new record appended (immutability).
 * - The function has no side effects — given the same inputs, it always
 *   produces the same output.
 * 
 * @param {Array} records - The existing attendance records (not mutated)
 * @param {string} studentId - The student's unique identifier
 * @param {string} date - The date string (e.g., "2026-09-15")
 * @param {string} status - One of: "present", "absent", "late", "excused"
 * @returns {Array} A new array containing all previous records plus the new one
 */
const markAttendance = (records, studentId, date, status) => [
  ...records,
  { studentId, date, status, timestamp: Date.now() }
];
```

### Python (OOP)

```python
class AttendanceTracker:
    """
    AttendanceTracker — Manages a collection of attendance records.
    
    PARADIGM NOTES:
    - This is a CLASS with internal state (self.records).
    - The mark_attendance METHOD mutates the object's internal list.
    - State is ENCAPSULATED within the object — external code cannot
      directly access or modify the records list.
    - The object "owns" its data and provides controlled access via methods.
    """
    
    def __init__(self):
        self.__records = []  # Private attribute (encapsulation)
    
    def mark_attendance(self, student_id: str, date: str, status: str) -> None:
        """
        Records a student's attendance for a given date.
        
        Unlike the functional approach, this METHOD modifies the object's
        internal state directly. The record is added to self.__records.
        
        Args:
            student_id: The student's unique identifier
            date: The date string (e.g., "2026-09-15")
            status: One of: "present", "absent", "late", "excused"
        """
        record = AttendanceRecord(student_id, date, status)
        self.__records.append(record)
```

### Key Differences

| Aspect | JavaScript (Functional) | Python (OOP) |
|--------|------------------------|--------------|
| **State** | No internal state; receives and returns data | Maintains internal state via `self.__records` |
| **Mutation** | Never mutates input; returns new array | Mutates the object's internal list |
| **Data flow** | Data flows through function parameters | Data lives inside the object |
| **Reusability** | Function can be used with any array | Must create an instance first |

---

## 2. Calculating Total Present

### JavaScript (Functional)

```javascript
/**
 * countByStatus — Counts records matching a specific attendance status.
 * 
 * PARADIGM NOTES:
 * - Uses the HIGHER-ORDER FUNCTION `filter` — a function that takes
 *   another function as its argument.
 * - The arrow function `(r) => r.status === status` is a PREDICATE
 *   (a function that returns true/false).
 * - This is COMPOSABLE: we can reuse it for any status type.
 * 
 * @param {Array} records - All attendance records
 * @param {string} status - The status to count
 * @returns {number} The count of matching records
 */
const countByStatus = (records, status) =>
  records.filter((r) => r.status === status).length;

// Usage: countByStatus(allRecords, "present") → 15
// Usage: countByStatus(allRecords, "absent")  → 3
```

### Python (OOP)

```python
class AttendanceTracker:
    # ... (constructor omitted for brevity)
    
    def count_by_status(self, status: str) -> int:
        """
        Counts records matching a specific attendance status.
        
        PARADIGM NOTES:
        - This is an INSTANCE METHOD — it operates on the object's own data.
        - It accesses self.__records directly (encapsulation).
        - The caller does not need to pass in the records list; the object
          already knows its own data.
        
        Args:
            status: The status to count ("present", "absent", "late", "excused")
            
        Returns:
            The count of records matching the given status
        """
        return sum(1 for record in self.__records if record.status == status)
    
    @property
    def total_present(self) -> int:
        """Property that returns total present count. Demonstrates
        Python's @property decorator for computed attributes."""
        return self.count_by_status("present")
```

### Key Differences

| Aspect | JavaScript (Functional) | Python (OOP) |
|--------|------------------------|--------------|
| **Data access** | Records passed as parameter | Records accessed via `self` |
| **Abstraction** | Higher-order function (`filter`) | Generator expression with `sum` |
| **Interface** | `countByStatus(records, "present")` | `tracker.total_present` (property) |
| **Coupling** | Loosely coupled to any data | Tightly coupled to object state |

---

## 3. Attendance Percentage

### JavaScript (Functional)

```javascript
/**
 * calculateAttendancePercentage — Computes attendance rate.
 * 
 * PARADIGM NOTES:
 * - FUNCTION COMPOSITION: This function COMPOSES other functions
 *   (countByStatus) to build a higher-level calculation.
 * - It is still a PURE FUNCTION with no side effects.
 * 
 * @param {Array} records - All attendance records for a student
 * @param {number} totalSchoolDays - Total scheduled class days
 * @returns {number} Percentage (0-100) rounded to 2 decimal places
 */
const calculateAttendancePercentage = (records, totalSchoolDays) => {
  if (totalSchoolDays === 0) return 0;
  const daysAttended = countByStatus(records, "present") 
                     + countByStatus(records, "late");
  return Math.round((daysAttended / totalSchoolDays) * 10000) / 100;
};
```

### Python (OOP)

```python
class AttendanceTracker:
    # ... (other methods omitted)
    
    @property
    def attendance_percentage(self) -> float:
        """
        Computes attendance rate as a percentage.
        
        PARADIGM NOTES:
        - Uses @property to make this a COMPUTED ATTRIBUTE.
        - Calls other methods (self.count_by_status) — demonstrating
          METHOD CHAINING within the object.
        - The total_school_days is stored as an instance attribute,
          showing how OOP objects maintain their own context.
        
        Returns:
            Percentage (0-100) rounded to 2 decimal places
        """
        if self.__total_school_days == 0:
            return 0.0
        days_attended = self.count_by_status("present") + self.count_by_status("late")
        return round((days_attended / self.__total_school_days) * 100, 2)
```

---

## 4. Consecutive Absences (Streak Calculation)

### JavaScript (Functional)

```javascript
/**
 * calculateConsecutiveStreak — Finds the longest consecutive streak of a status.
 * 
 * PARADIGM NOTES:
 * - Uses `reduce` — the most powerful HIGHER-ORDER FUNCTION.
 * - `reduce` transforms an array into a single value by applying a
 *   function to each element with an ACCUMULATOR.
 * - The accumulator `{ max, current }` tracks state WITHOUT mutation —
 *   each iteration returns a new accumulator object.
 * 
 * @param {Array} records - Attendance records sorted by date
 * @param {string} status - The status to find streaks for
 * @returns {number} Length of the longest consecutive streak
 */
const calculateConsecutiveStreak = (records, status) =>
  records.reduce(
    (acc, record) => {
      const current = record.status === status ? acc.current + 1 : 0;
      return { max: Math.max(acc.max, current), current };
    },
    { max: 0, current: 0 }
  ).max;
```

### Python (OOP)

```python
class AttendanceTracker:
    # ... (other methods omitted)
    
    def consecutive_streak(self, status: str) -> int:
        """
        Finds the longest consecutive streak of a given status.
        
        PARADIGM NOTES:
        - Uses a traditional LOOP with MUTABLE VARIABLES — the OOP way.
        - max_streak and current_streak are local mutable state, updated
          in each iteration.
        - The method accesses self.__records directly (encapsulation).
        
        Args:
            status: The status to find streaks for
            
        Returns:
            Length of the longest consecutive streak
        """
        max_streak = 0
        current_streak = 0
        
        for record in sorted(self.__records, key=lambda r: r.date):
            if record.status == status:
                current_streak += 1
                max_streak = max(max_streak, current_streak)
            else:
                current_streak = 0
        
        return max_streak
```

### Key Differences

| Aspect | JavaScript (Functional) | Python (OOP) |
|--------|------------------------|--------------|
| **Iteration** | `reduce` (declarative) | `for` loop (imperative) |
| **State tracking** | Accumulator object (immutable per step) | Mutable local variables |
| **Readability** | Concise but requires understanding `reduce` | More verbose but intuitive |
| **Data source** | Records passed as parameter | `self.__records` (encapsulated) |

---

## 5. Time In / Time Out

### JavaScript (Functional)

```javascript
/**
 * recordTimeIn — Creates a new time entry for a student.
 * Returns a new record object without mutating any state.
 */
const recordTimeIn = (studentId, timestamp = Date.now()) => ({
  studentId,
  timeIn: timestamp,
  timeOut: null,
});

/**
 * recordTimeOut — Returns a new record with timeOut filled in.
 * The original record is NOT mutated (immutability).
 */
const recordTimeOut = (timeRecord, timestamp = Date.now()) => ({
  ...timeRecord,
  timeOut: timestamp,
});
```

### Python (OOP)

```python
class TimeEntry:
    """
    Represents a single time-in/time-out record for a student.
    The object maintains its own state and provides methods to update it.
    """
    
    def __init__(self, student_id: str):
        self.student_id = student_id
        self.time_in = datetime.now()
        self.time_out = None  # Will be set when student leaves
    
    def record_time_out(self) -> None:
        """
        Sets the time_out timestamp. Mutates the object's state directly.
        Unlike the functional approach, this modifies the existing object
        rather than creating a new one.
        """
        self.time_out = datetime.now()
    
    @property
    def duration(self) -> timedelta:
        """Computed property — calculates duration from internal state."""
        if self.time_out is None:
            return datetime.now() - self.time_in
        return self.time_out - self.time_in
```

---

## Summary Table

| Feature | JS Functional Approach | Python OOP Approach |
|---------|----------------------|---------------------|
| Mark Attendance | Pure function, returns new array | Method mutates internal list |
| Count by Status | `filter().length` | Generator with `sum()` |
| Percentages | Composed pure functions | `@property` computed attributes |
| Streaks | `reduce` with accumulator | Loop with mutable variables |
| Time Tracking | Spread operator for immutability | Direct object mutation |
| Data Storage | Arrays passed as arguments | Encapsulated in `self` |
| Error Handling | Return default values | Can raise exceptions |
