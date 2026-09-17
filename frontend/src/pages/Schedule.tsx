import React, { useState } from 'react';
import { Download, Plus, Minus } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

// Dummy data to simulate the class roster
const initialStudents = [
  { id: '2021-0001', name: 'Alcantara, Mark', status: 'present' as const, time: '3:05 PM', remarks: '' },
  { id: '2021-0002', name: 'Bautista, Sarah', status: 'present' as const, time: '3:02 PM', remarks: '' },
  { id: '2021-0003', name: 'Cruz, Juan', status: 'absent' as const, time: '--', remarks: 'Sick leave' },
  { id: '2021-0004', name: 'Dela Rosa, Maria', status: 'late' as const, time: '3:20 PM', remarks: 'Traffic' },
  { id: '2021-0005', name: 'Enriquez, Paulo', status: 'select' as const, time: '--', remarks: '' },
];

const Schedule: React.FC = () => {
  const [students, setStudents] = useState(initialStudents);

  const handleStatusChange = (id: string, newStatus: any) => {
    setStudents(students.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Programming Languages</h1>
          <p style={styles.subtitle}>CCPGLANG - COM232 | 3:00 PM - 5:00 PM</p>
        </div>
        
        <div style={styles.summaryCounters}>
          <div style={styles.counter}>
            <span style={styles.counterValue}>40</span>
            <span style={styles.counterLabel}>Total Students</span>
          </div>
          <div style={styles.counter}>
            <span style={{ ...styles.counterValue, color: 'var(--status-present-text)' }}>32</span>
            <span style={styles.counterLabel}>Present</span>
          </div>
          <div style={styles.counter}>
            <span style={{ ...styles.counterValue, color: 'var(--status-absent-text)' }}>5</span>
            <span style={styles.counterLabel}>Absent</span>
          </div>
          <div style={styles.counter}>
            <span style={{ ...styles.counterValue, color: 'var(--status-late-text)' }}>3</span>
            <span style={styles.counterLabel}>Late</span>
          </div>
        </div>
      </header>

      <div className="card" style={styles.tableCard}>
        <div style={styles.toolbar}>
          <div style={styles.toolbarLeft}>
            <button className="btn-primary" style={styles.actionBtn}>
              <Plus size={16} /> Add
            </button>
            <button className="btn-primary" style={{ ...styles.actionBtn, backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
              <Minus size={16} /> Remove
            </button>
          </div>
          <button className="btn-primary" style={{ ...styles.actionBtn, backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
            <Download size={16} /> Export
          </button>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>No.</th>
              <th style={styles.th}>Student</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Check in</th>
              <th style={styles.th}>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.id} style={styles.tr}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>
                  <div style={styles.studentCell}>
                    <span style={styles.studentName}>{student.name}</span>
                    <span style={styles.studentId}>{student.id}</span>
                  </div>
                </td>
                <td style={styles.td}>
                  <select 
                    style={styles.statusSelect}
                    value={student.status}
                    onChange={(e) => handleStatusChange(student.id, e.target.value)}
                  >
                    <option value="select">Select status</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                    <option value="excused">Excused</option>
                  </select>
                  <StatusBadge status={student.status} />
                </td>
                <td style={styles.td}>{student.time}</td>
                <td style={styles.td}>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Add remarks..." 
                    defaultValue={student.remarks}
                    style={styles.remarksInput}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '0.25rem',
  },
  subtitle: {
    color: 'var(--text-muted)',
  },
  summaryCounters: {
    display: 'flex',
    gap: '1.5rem',
    backgroundColor: 'var(--bg-white)',
    padding: '1rem 1.5rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
  },
  counter: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    minWidth: '80px',
  },
  counterValue: {
    fontSize: '1.5rem',
    fontWeight: 700,
  },
  counterLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase' as const,
  },
  tableCard: {
    padding: '0',
    overflow: 'hidden',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1.5rem',
    borderBottom: '1px solid var(--border-color)',
  },
  toolbarLeft: {
    display: 'flex',
    gap: '0.5rem',
  },
  actionBtn: {
    padding: '0.5rem 1rem',
    fontSize: '0.9rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    textAlign: 'left' as const,
  },
  th: {
    padding: '1rem 1.5rem',
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    fontWeight: 500,
    borderBottom: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-primary)',
  },
  tr: {
    borderBottom: '1px solid var(--border-color)',
  },
  td: {
    padding: '1rem 1.5rem',
    verticalAlign: 'middle' as const,
  },
  studentCell: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  studentName: {
    fontWeight: 500,
    color: 'var(--text-primary)',
  },
  studentId: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
  statusSelect: {
    marginRight: '1rem',
    padding: '0.25rem 0.5rem',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-color)',
  },
  remarksInput: {
    padding: '0.5rem',
    fontSize: '0.85rem',
  }
};

export default Schedule;
