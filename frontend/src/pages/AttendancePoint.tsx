import React from 'react';
import StatusBadge from '../components/StatusBadge';

const AttendancePoint: React.FC = () => {
  // Generate dummy weeks W1-W12
  const weeks = Array.from({ length: 12 }, (_, i) => `W${i + 1}`);

  const generateRandomStatus = () => {
    const statuses = ['present', 'present', 'present', 'late', 'absent'];
    return statuses[Math.floor(Math.random() * statuses.length)] as any;
  };

  const students = [
    { id: '2021-0001', name: 'Alcantara, Mark', lates: 1, absences: 0, status: 'pass' as const },
    { id: '2021-0002', name: 'Bautista, Sarah', lates: 0, absences: 1, status: 'pass' as const },
    { id: '2021-0003', name: 'Cruz, Juan', lates: 4, absences: 3, status: 'fail' as const },
    { id: '2021-0004', name: 'Dela Rosa, Maria', lates: 2, absences: 0, status: 'pass' as const },
  ].map(s => ({
    ...s,
    history: weeks.map(() => generateRandomStatus())
  }));

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Attendance Point</h1>
        <p style={styles.subtitle}>Manage daily student attendance and track semester point.</p>
      </header>

      <div className="card" style={styles.tableCard}>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Student</th>
                {weeks.map(w => <th key={w} style={styles.thCenter}>{w}</th>)}
                <th style={styles.thCenter}>Lates</th>
                <th style={styles.thCenter}>Absences</th>
                <th style={styles.th}>Grade Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={styles.studentCell}>
                      <span style={styles.studentName}>{student.name}</span>
                      <span style={styles.studentId}>{student.id}</span>
                    </div>
                  </td>
                  {student.history.map((status, i) => (
                    <td key={i} style={styles.tdCenter}>
                      <div
                        style={{
                          ...styles.dot,
                          backgroundColor: status === 'present' ? 'var(--status-present-text)'
                            : status === 'late' ? 'var(--status-late-text)'
                              : 'var(--status-absent-text)'
                        }}
                        title={status}
                      />
                    </td>
                  ))}
                  <td style={styles.tdCenter}>
                    <span style={styles.countText}>{student.lates}</span>
                  </td>
                  <td style={styles.tdCenter}>
                    <span style={styles.countText}>{student.absences}</span>
                  </td>
                  <td style={styles.td}>
                    <StatusBadge
                      status={student.status === 'pass' ? 'pass' : 'absent'}
                      label={student.status === 'pass' ? 'Pass' : 'Failed'}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2rem',
  },
  header: {
    marginBottom: '0.5rem',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '0.25rem',
  },
  subtitle: {
    color: 'var(--text-muted)',
  },
  tableCard: {
    padding: '0',
    overflow: 'hidden',
  },
  tableWrapper: {
    overflowX: 'auto' as const,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    textAlign: 'left' as const,
    minWidth: '900px',
  },
  th: {
    padding: '1rem 1.5rem',
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    fontWeight: 500,
    borderBottom: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-primary)',
  },
  thCenter: {
    padding: '1rem 0.5rem',
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    fontWeight: 500,
    borderBottom: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-primary)',
    textAlign: 'center' as const,
  },
  tr: {
    borderBottom: '1px solid var(--border-color)',
  },
  td: {
    padding: '1rem 1.5rem',
    verticalAlign: 'middle' as const,
  },
  tdCenter: {
    padding: '1rem 0.5rem',
    verticalAlign: 'middle' as const,
    textAlign: 'center' as const,
  },
  studentCell: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  studentName: {
    fontWeight: 500,
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap' as const,
  },
  studentId: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    display: 'inline-block',
  },
  countText: {
    fontWeight: 600,
    fontSize: '1rem',
  }
};

export default AttendancePoint;
