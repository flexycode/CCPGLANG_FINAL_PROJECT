import { useState, useMemo } from 'react'
import { 
  createStudent, 
  markAttendance, 
  ATTENDANCE_STATUS 
} from './utils/attendance.js'
import { 
  generateStudentSummary 
} from './utils/analytics.js'
import './App.css'

function App() {
  const totalSchoolDays = 20

  // 1. Immutable state for students and records
  const [students] = useState([
    createStudent("STU-001", "Juan", "Dela Cruz"),
    createStudent("STU-002", "Maria", "Santos")
  ])

  // Sample data to hydrate
  const initialRecords = [
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
  ].reduce((acc, data) => markAttendance(acc, "STU-001", data.date, data.status), [])

  const [records, setRecords] = useState(initialRecords)

  // 2. Pure function evaluation for analytics
  const summary = useMemo(() => {
    return generateStudentSummary(records, totalSchoolDays)
  }, [records, totalSchoolDays])

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Student Attendance Dashboard</h1>
          <p className="subtitle">Paradigm: Functional Programming (React + JavaScript)</p>
        </div>
        <div className="school-days-badge">
          <span>Total School Days</span>
          <strong>{totalSchoolDays}</strong>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="student-profile-card">
          <div className="profile-header">
            <div className="avatar">{students[0].firstName[0]}{students[0].lastName[0]}</div>
            <div className="student-info">
              <h2>{students[0].firstName} {students[0].lastName}</h2>
              <span className="student-id">{students[0].studentId}</span>
              <span className="status-badge active">{students[0].status}</span>
            </div>
          </div>
          
          <div className="stats-grid">
            <div className="stat-box primary">
              <h3>Attendance Rate</h3>
              <div className="stat-value">{summary.attendancePercentage}%</div>
            </div>
            <div className="stat-box warning">
              <h3>Consecutive Absences</h3>
              <div className="stat-value">{summary.consecutiveAbsences}</div>
            </div>
            <div className="stat-box secondary">
              <h3>Days Attended</h3>
              <div className="stat-value">{summary.totalDaysAttended} <small>/ {summary.totalSchoolDays}</small></div>
            </div>
          </div>
        </section>

        <section className="analytics-details">
          <div className="card breakdown-card">
            <h3>Attendance Breakdown</h3>
            <div className="breakdown-list">
              <div className="breakdown-item present">
                <span>Present</span>
                <strong>{summary.totalPresent}</strong>
              </div>
              <div className="breakdown-item absent">
                <span>Absent</span>
                <strong>{summary.totalAbsent}</strong>
              </div>
              <div className="breakdown-item late">
                <span>Late</span>
                <strong>{summary.totalLate}</strong>
              </div>
              <div className="breakdown-item excused">
                <span>Excused</span>
                <strong>{summary.totalExcused}</strong>
              </div>
            </div>
          </div>

          <div className="card percentages-card">
            <h3>Percentages & Streaks</h3>
            <ul className="details-list">
              <li>
                <span>Absence Rate</span>
                <strong>{summary.absencePercentage}%</strong>
              </li>
              <li>
                <span>Late Rate</span>
                <strong>{summary.latePercentage}%</strong>
              </li>
              <li>
                <span>Consecutive Lates</span>
                <strong>{summary.consecutiveLates}</strong>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
