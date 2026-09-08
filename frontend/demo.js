import { 
  createStudent, 
  markAttendance, 
  ATTENDANCE_STATUS 
} from './src/utils/attendance.js';

import { 
  generateStudentSummary 
} from './src/utils/analytics.js';

const runDemo = () => {
  console.log("============================================================");
  console.log("  Student Attendance Monitoring System");
  console.log("  Paradigm: Functional Programming (JavaScript)");
  console.log("============================================================\n");

  const totalSchoolDays = 20;
  console.log(`[1] Initialized system with ${totalSchoolDays} school days`);

  // Create students (Pure data, no classes)
  const student1 = createStudent("STU-001", "Juan", "Dela Cruz");
  const student2 = createStudent("STU-002", "Maria", "Santos");

  const students = [student1, student2];
  
  console.log(`[2] Registered ${students.length} students`);
  students.forEach(s => {
    console.log(`    - { lastName: '${s.lastName}', firstName: '${s.firstName}', studentId: '${s.studentId}', status: '${s.status}' }`);
  });
  console.log();

  // Mark attendance using pure functions
  // We start with an empty array of records and accumulate new state
  let records = [];
  
  const sampleData = [
    { date: "2026-09-01", status: ATTENDANCE_STATUS.PRESENT },
    { date: "2026-09-02", status: ATTENDANCE_STATUS.PRESENT },
    { date: "2026-09-03", status: ATTENDANCE_STATUS.LATE },
    { date: "2026-09-04", status: ATTENDANCE_STATUS.PRESENT },
    { date: "2026-09-05", status: ATTENDANCE_STATUS.ABSENT },
    { date: "2026-09-08", status: ATTENDANCE_STATUS.ABSENT },
    { date: "2026-09-09", status: ATTENDANCE_STATUS.ABSENT },
    { date: "2026-09-10", status: ATTENDANCE_STATUS.EXCUSED },
    { date: "2026-09-11", status: ATTENDANCE_STATUS.PRESENT },
    { date: "2026-09-12", status: ATTENDANCE_STATUS.LATE },
  ];

  // In functional programming, we often use reduce to accumulate state over an array
  records = sampleData.reduce((accRecords, data) => {
    return markAttendance(accRecords, "STU-001", data.date, data.status);
  }, []);

  console.log(`[3] Recorded ${records.length} attendance entries\n`);

  // Generate analytics using pure composed functions
  const summary = generateStudentSummary(records, totalSchoolDays);

  console.log("[4] Attendance Analytics for STU-001 (Juan Dela Cruz):");
  console.log(`    Total Present:          ${summary.totalPresent}`);
  console.log(`    Total Absent:           ${summary.totalAbsent}`);
  console.log(`    Total Late:             ${summary.totalLate}`);
  console.log(`    Total Excused:          ${summary.totalExcused}`);
  console.log(`    Total Days Attended:    ${summary.totalDaysAttended}`);
  console.log(`    Total School Days:      ${summary.totalSchoolDays}`);
  console.log(`    Attendance Percentage:  ${summary.attendancePercentage}%`);
  console.log(`    Absence Percentage:     ${summary.absencePercentage}%`);
  console.log(`    Late Percentage:        ${summary.latePercentage}%`);
  console.log(`    Consecutive Absences:   ${summary.consecutiveAbsences}`);
  console.log(`    Consecutive Lates:      ${summary.consecutiveLates}\n`);
  console.log("============================================================");
};

runDemo();
