/**
 * Schedule.tsx — Class Attendance Roster & Management Page
 * =========================================================
 * PARADIGM: Functional Programming (FP)
 * 
 * Features:
 * - Dynamic route handling for all 4 courses:
 *   • CCPGLANG (Programming Languages)
 *   • CCINTHCI (Human Computer Interaction)
 *   • CCAUTOMATA (Automata Theory)
 *   • CCDATRCL (Data Structure)
 * - Full 50-student dataset integration (2023-001 to 2023-050)
 * - Yellow-themed Late summary counter & badges
 * - Fully functional real-time search box (by Name or Student ID)
 * - Functional status filter buttons (All, Present, Absent, Late, Excused)
 * - Functional "Add Student" modal with form validation
 * - Functional "Remove Student" batch deletion with row selection
 * - Functional CSV Export with timestamped records
 * - In-place status updates and editable remarks
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Plus, 
  Trash2, 
  Download, 
  Search, 
  CheckCircle2, 
  X, 
  Check,
  UserCheck
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { 
  CLASS_CONFIGS, 
  getInitialClassRoster, 
  StudentRecord 
} from '../data/studentsData';

const Schedule: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();

  // Normalize class code or fallback to CCPGLANG
  const activeClassCode = useMemo(() => {
    const raw = (classId || 'CCPGLANG').toUpperCase();
    return CLASS_CONFIGS[raw] ? raw : 'CCPGLANG';
  }, [classId]);

  const classInfo = (CLASS_CONFIGS[activeClassCode] || CLASS_CONFIGS['CCPGLANG'])!;

  // Active roster state for this class
  const [students, setStudents] = useState<StudentRecord[]>(() => 
    getInitialClassRoster(activeClassCode)
  );

  // Sync roster when class route changes
  useEffect(() => {
    setStudents(getInitialClassRoster(activeClassCode));
    setSelectedIds(new Set());
    setSearchQuery('');
    setStatusFilter('all');
  }, [activeClassCode]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'present' | 'absent' | 'late' | 'excused'>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modal State for Adding Student
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newStudentId, setNewStudentId] = useState<string>('');
  const [newStudentName, setNewStudentName] = useState<string>('');
  const [newStudentStatus, setNewStudentStatus] = useState<StudentRecord['status']>('present');
  const [newStudentTime, setNewStudentTime] = useState<string>('3:00 PM');
  const [newStudentRemarks, setNewStudentRemarks] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  // Notification / Toast Feedback
  const [toastMessage, setToastMessage] = useState<string>('');
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Pure summary metric calculations
  const totalStudents = students.length;
  const presentCount = students.filter(s => s.status === 'present').length;
  const absentCount = students.filter(s => s.status === 'absent').length;
  const lateCount = students.filter(s => s.status === 'late').length;
  const excusedCount = students.filter(s => s.status === 'excused').length;

  // Filtered students based on search query and status filter
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.remarks.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = 
        statusFilter === 'all' ? true : student.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [students, searchQuery, statusFilter]);

  // Handlers for interactive actions
  const handleStatusChange = (id: string, newStatus: StudentRecord['status']) => {
    setStudents(prev => 
      prev.map(s => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  const handleRemarksChange = (id: string, remarks: string) => {
    setStudents(prev => 
      prev.map(s => (s.id === id ? { ...s, remarks } : s))
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredStudents.map(s => s.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Remove Selected Students
  const handleRemoveSelected = () => {
    if (selectedIds.size === 0) {
      showToast('Please select at least one student to remove.');
      return;
    }
    const count = selectedIds.size;
    setStudents(prev => prev.filter(s => !selectedIds.has(s.id)));
    setSelectedIds(new Set());
    showToast(`Successfully removed ${count} student(s) from ${activeClassCode}.`);
  };

  // Mark All Present
  const handleMarkAllPresent = () => {
    setStudents(prev => prev.map(s => ({ ...s, status: 'present', time: s.time === '--' ? '3:00 PM' : s.time })));
    showToast(`All ${students.length} students marked Present.`);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['No.', 'Student ID', 'Student Name', 'Status', 'Check-in Time', 'Remarks'];
    const rows = filteredStudents.map((s, idx) => [
      idx + 1,
      `"${s.id}"`,
      `"${s.name}"`,
      `"${s.status}"`,
      `"${s.time}"`,
      `"${s.remarks || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${activeClassCode}_Attendance_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filteredStudents.length} records to CSV.`);
  };

  // Add Student Submission
  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentId.trim() || !newStudentName.trim()) {
      setFormError('Student ID and Student Name are required.');
      return;
    }

    if (students.some(s => s.id.toLowerCase() === newStudentId.trim().toLowerCase())) {
      setFormError('A student with this ID already exists in the roster.');
      return;
    }

    const parts = newStudentName.split(',');
    const lastName = parts[0]?.trim() || newStudentName.trim();
    const firstName = parts[1]?.trim() || '';

    const newRecord: StudentRecord = {
      id: newStudentId.trim(),
      name: newStudentName.trim(),
      firstName,
      lastName,
      status: newStudentStatus,
      time: newStudentStatus === 'absent' ? '--' : newStudentTime,
      remarks: newStudentRemarks.trim(),
    };

    setStudents(prev => [newRecord, ...prev]);
    setIsAddModalOpen(false);
    setNewStudentId('');
    setNewStudentName('');
    setNewStudentRemarks('');
    setFormError('');
    showToast(`Added ${newRecord.name} (${newRecord.id}) to roster.`);
  };

  return (
    <div style={styles.container}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={styles.toast}>
          <CheckCircle2 size={18} color="#22C55E" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header aligned with Figma */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.codeTag}>{classInfo.code}</div>
          <div>
            <h1 style={styles.title}>{classInfo.name}</h1>
            <p style={styles.subtitle}>
              Section {classInfo.section} &bull; {classInfo.days} &bull; {classInfo.timeSlot} &bull; {classInfo.room}
            </p>
          </div>
        </div>

        {/* Summary Metric Counters */}
        <div style={styles.summaryCounters}>
          <div style={styles.counter}>
            <span style={styles.counterValue}>{totalStudents}</span>
            <span style={styles.counterLabel}>Total Students</span>
          </div>
          <div style={styles.counterDivider} />
          <div style={styles.counter}>
            <span style={{ ...styles.counterValue, color: 'var(--status-present-text)' }}>
              {presentCount}
            </span>
            <span style={styles.counterLabel}>Present</span>
          </div>
          <div style={styles.counterDivider} />
          <div style={styles.counter}>
            <span style={{ ...styles.counterValue, color: 'var(--status-absent-text)' }}>
              {absentCount}
            </span>
            <span style={styles.counterLabel}>Absent</span>
          </div>
          <div style={styles.counterDivider} />
          
          {/* Note 2: Yellow Late Box */}
          <div style={styles.lateCounterBox}>
            <span style={styles.lateCounterValue}>{lateCount}</span>
            <span style={styles.lateCounterLabel}>Late</span>
          </div>

          <div style={styles.counterDivider} />
          <div style={styles.counter}>
            <span style={{ ...styles.counterValue, color: 'var(--text-muted)' }}>
              {excusedCount}
            </span>
            <span style={styles.counterLabel}>Excused</span>
          </div>
        </div>
      </header>

      {/* Main Table Card */}
      <div className="card" style={styles.tableCard}>
        {/* Toolbar with Actions and Search */}
        <div style={styles.toolbar}>
          {/* Left Action Buttons */}
          <div style={styles.toolbarLeft}>
            <button 
              className="btn-primary" 
              style={styles.actionBtn}
              onClick={() => setIsAddModalOpen(true)}
              title="Add a new student to this class"
            >
              <Plus size={16} /> Add Student
            </button>

            <button 
              style={{
                ...styles.actionBtnSecondary,
                color: selectedIds.size > 0 ? '#DC2626' : 'var(--text-muted)',
                borderColor: selectedIds.size > 0 ? '#FCA5A5' : 'var(--border-color)',
                backgroundColor: selectedIds.size > 0 ? '#FEF2F2' : 'var(--bg-white)',
              }}
              onClick={handleRemoveSelected}
              disabled={selectedIds.size === 0}
              title={selectedIds.size > 0 ? `Remove ${selectedIds.size} selected` : 'Select rows to remove'}
            >
              <Trash2 size={16} /> Remove {selectedIds.size > 0 ? `(${selectedIds.size})` : ''}
            </button>

            <button
              style={styles.actionBtnSecondary}
              onClick={handleMarkAllPresent}
              title="Mark all students as present"
            >
              <UserCheck size={16} /> Mark All Present
            </button>
          </div>

          {/* Right: Search Box & Export */}
          <div style={styles.toolbarRight}>
            {/* Pill Search Box */}
            <div style={styles.searchWrapper}>
              <Search size={16} style={styles.searchIcon} />
              <input 
                type="text"
                placeholder="Search by name, ID or remarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  style={styles.clearSearchBtn}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button 
              style={styles.actionBtnSecondary}
              onClick={handleExportCSV}
              title="Download CSV attendance sheet"
            >
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div style={styles.filterTabsRow}>
          <div style={styles.filterGroup}>
            {(['all', 'present', 'late', 'absent', 'excused'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                style={{
                  ...styles.filterPill,
                  ...(statusFilter === tab ? styles.filterPillActive : {}),
                  ...(tab === 'late' && statusFilter === tab ? styles.filterPillLateActive : {}),
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span style={styles.filterPillBadge}>
                  {tab === 'all' ? totalStudents :
                   tab === 'present' ? presentCount :
                   tab === 'late' ? lateCount :
                   tab === 'absent' ? absentCount : excusedCount}
                </span>
              </button>
            ))}
          </div>

          <span style={styles.resultCountText}>
            Showing {filteredStudents.length} of {totalStudents} students
          </span>
        </div>

        {/* Table Roster */}
        <div style={styles.tableResponsive}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, width: '40px', textAlign: 'center' }}>
                  <input 
                    type="checkbox"
                    checked={filteredStudents.length > 0 && selectedIds.size === filteredStudents.length}
                    onChange={handleSelectAll}
                    style={styles.checkbox}
                  />
                </th>
                <th style={{ ...styles.th, width: '60px' }}>No.</th>
                <th style={styles.th}>Student Information</th>
                <th style={{ ...styles.th, width: '220px' }}>Attendance Status</th>
                <th style={{ ...styles.th, width: '130px' }}>Check In</th>
                <th style={styles.th}>Remarks / Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} style={styles.emptyTd}>
                    <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>No matching students found</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Try adjusting your search query or status filter.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, index) => {
                  const isSelected = selectedIds.has(student.id);
                  const initials = student.name
                    .split(',')
                    .map(part => part.trim().charAt(0))
                    .join('')
                    .slice(0, 2);

                  return (
                    <tr 
                      key={student.id} 
                      style={{
                        ...styles.tr,
                        backgroundColor: isSelected ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
                      }}
                    >
                      {/* Checkbox */}
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <input 
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(student.id)}
                          style={styles.checkbox}
                        />
                      </td>

                      {/* Row Number */}
                      <td style={{ ...styles.td, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {index + 1}
                      </td>

                      {/* Student Info */}
                      <td style={styles.td}>
                        <div style={styles.studentCell}>
                          <div style={styles.avatarMini}>{initials}</div>
                          <div style={styles.studentInfoCol}>
                            <span style={styles.studentName}>{student.name}</span>
                            <span style={styles.studentId}>{student.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Status Selector + Badge */}
                      <td style={styles.td}>
                        <div style={styles.statusCell}>
                          <select 
                            style={{
                              ...styles.statusSelect,
                              borderColor: student.status === 'late' ? 'var(--status-late-border)' : 'var(--border-color)',
                            }}
                            value={student.status}
                            onChange={(e) => handleStatusChange(student.id, e.target.value as any)}
                          >
                            <option value="present">Present</option>
                            <option value="late">Late</option>
                            <option value="absent">Absent</option>
                            <option value="excused">Excused</option>
                          </select>
                          <StatusBadge status={student.status} />
                        </div>
                      </td>

                      {/* Check In Time */}
                      <td style={{ ...styles.td, fontSize: '0.88rem', color: student.time === '--' ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                        {student.time}
                      </td>

                      {/* Editable Remarks */}
                      <td style={styles.td}>
                        <input 
                          type="text" 
                          placeholder="Add remark..." 
                          value={student.remarks}
                          onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                          style={styles.remarksInput}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Add Student Modal ─────────────────────────────────────── */}
      {isAddModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsAddModalOpen(false)}>
          <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <h3 style={styles.modalTitle}>Add Student to Roster</h3>
                <p style={styles.modalSubtitle}>Register a student into {classInfo.name} ({classInfo.code})</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)} 
                style={styles.modalCloseBtn}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div style={styles.formErrorBox}>
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddStudentSubmit} style={styles.modalForm}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Student ID Number *</label>
                <input 
                  type="text"
                  placeholder="e.g. 2023-051"
                  value={newStudentId}
                  onChange={(e) => setNewStudentId(e.target.value)}
                  style={styles.modalInput}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name (Lastname, Firstname) *</label>
                <input 
                  type="text"
                  placeholder="e.g. Cruz, Alejandro"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  style={styles.modalInput}
                  required
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Attendance Status</label>
                  <select 
                    value={newStudentStatus}
                    onChange={(e) => setNewStudentStatus(e.target.value as any)}
                    style={styles.modalSelect}
                  >
                    <option value="present">Present</option>
                    <option value="late">Late</option>
                    <option value="absent">Absent</option>
                    <option value="excused">Excused</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Check In Time</label>
                  <input 
                    type="text"
                    value={newStudentTime}
                    onChange={(e) => setNewStudentTime(e.target.value)}
                    style={styles.modalInput}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Initial Remarks</label>
                <input 
                  type="text"
                  placeholder="Optional notes or excuse document"
                  value={newStudentRemarks}
                  onChange={(e) => setNewStudentRemarks(e.target.value)}
                  style={styles.modalInput}
                />
              </div>

              <div style={styles.modalActions}>
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  style={styles.submitBtn}
                >
                  <Check size={16} /> Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.75rem',
    position: 'relative',
  },
  toast: {
    position: 'fixed',
    top: '1.5rem',
    right: '2rem',
    backgroundColor: '#1E1E1E',
    color: '#FFFFFF',
    padding: '0.75rem 1.25rem',
    borderRadius: '8px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.88rem',
    fontWeight: 500,
    zIndex: 1000,
    animation: 'fadeIn 0.25s ease-out',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1.5rem',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
  },
  codeTag: {
    backgroundColor: 'var(--brand-primary)',
    color: '#FFFFFF',
    padding: '0.35rem 0.75rem',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
    marginTop: '0.35rem',
  },
  title: {
    fontSize: '1.85rem',
    margin: 0,
    fontFamily: 'var(--font-heading)',
    color: 'var(--text-primary)',
  },
  subtitle: {
    color: 'var(--text-muted)',
    fontSize: '0.88rem',
    marginTop: '0.25rem',
  },
  summaryCounters: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
    backgroundColor: 'var(--bg-white)',
    padding: '0.85rem 1.5rem',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-color)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
  },
  counter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '65px',
  },
  counterDivider: {
    width: '1px',
    height: '32px',
    backgroundColor: 'var(--border-color)',
  },
  counterValue: {
    fontSize: '1.4rem',
    fontWeight: 700,
    lineHeight: 1.1,
  },
  counterLabel: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    fontWeight: 600,
    marginTop: '0.2rem',
    letterSpacing: '0.04em',
  },

  // Note 2: Yellow Late Box Styles
  lateCounterBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '72px',
    backgroundColor: 'var(--status-late-bg)',
    border: '1px solid var(--status-late-border)',
    padding: '0.35rem 0.75rem',
    borderRadius: '8px',
  },
  lateCounterValue: {
    fontSize: '1.4rem',
    fontWeight: 800,
    lineHeight: 1.1,
    color: 'var(--status-late-text)',
  },
  lateCounterLabel: {
    fontSize: '0.72rem',
    color: 'var(--status-late-text)',
    textTransform: 'uppercase',
    fontWeight: 700,
    marginTop: '0.15rem',
    letterSpacing: '0.04em',
  },

  tableCard: {
    padding: '0',
    overflow: 'hidden',
    backgroundColor: 'var(--bg-white)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-white)',
  },
  toolbarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  toolbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  actionBtn: {
    padding: '0.55rem 1.1rem',
    fontSize: '0.85rem',
    fontWeight: 600,
  },
  actionBtnSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.55rem 1rem',
    fontSize: '0.85rem',
    fontWeight: 500,
    backgroundColor: 'var(--bg-white)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    minWidth: '260px',
  },
  searchIcon: {
    position: 'absolute',
    left: '0.85rem',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '0.55rem 2.2rem 0.55rem 2.4rem',
    fontSize: '0.85rem',
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: '20px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  clearSearchBtn: {
    position: 'absolute',
    right: '0.75rem',
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '2px',
  },

  filterTabsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 1.5rem',
    backgroundColor: 'rgba(0, 0, 0, 0.015)',
    borderBottom: '1px solid var(--border-color)',
    flexWrap: 'wrap',
    gap: '0.75rem',
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  filterPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.35rem 0.8rem',
    fontSize: '0.8rem',
    fontWeight: 500,
    color: 'var(--text-muted)',
    backgroundColor: 'transparent',
    border: '1px solid transparent',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  filterPillActive: {
    backgroundColor: 'var(--bg-white)',
    color: 'var(--brand-primary)',
    fontWeight: 600,
    borderColor: 'var(--border-color)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  filterPillLateActive: {
    backgroundColor: 'var(--status-late-bg)',
    color: 'var(--status-late-text)',
    borderColor: 'var(--status-late-border)',
    fontWeight: 700,
  },
  filterPillBadge: {
    fontSize: '0.75rem',
    opacity: 0.8,
    backgroundColor: 'rgba(0,0,0,0.06)',
    padding: '0.1rem 0.4rem',
    borderRadius: '10px',
  },
  resultCountText: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },

  tableResponsive: {
    overflowX: 'auto',
    width: '100%',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    minWidth: '850px',
  },
  th: {
    padding: '0.9rem 1.25rem',
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    borderBottom: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-primary)',
  },
  tr: {
    borderBottom: '1px solid var(--border-color)',
    transition: 'background-color 0.15s ease',
  },
  td: {
    padding: '0.85rem 1.25rem',
    verticalAlign: 'middle',
  },
  emptyTd: {
    padding: '3rem 1.5rem',
    textAlign: 'center',
  },
  checkbox: {
    cursor: 'pointer',
    width: '16px',
    height: '16px',
    accentColor: 'var(--brand-primary)',
  },
  studentCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
  },
  avatarMini: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 700,
    border: '1px solid var(--border-color)',
  },
  studentInfoCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  studentName: {
    fontWeight: 600,
    fontSize: '0.9rem',
    color: 'var(--text-primary)',
  },
  studentId: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    fontFamily: 'monospace',
  },
  statusCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  statusSelect: {
    padding: '0.35rem 0.6rem',
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    fontSize: '0.82rem',
    backgroundColor: 'var(--bg-white)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    outline: 'none',
  },
  remarksInput: {
    width: '100%',
    padding: '0.45rem 0.75rem',
    fontSize: '0.85rem',
    backgroundColor: 'transparent',
    border: '1px solid transparent',
    borderRadius: '4px',
    color: 'var(--text-primary)',
    transition: 'border-color 0.2s, background-color 0.2s',
  },

  // Modal styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1100,
    backdropFilter: 'blur(3px)',
  },
  modalCard: {
    backgroundColor: 'var(--bg-white)',
    borderRadius: 'var(--radius-lg)',
    width: '100%',
    maxWidth: '520px',
    padding: '2rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
    border: '1px solid var(--border-color)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
  },
  modalTitle: {
    fontSize: '1.35rem',
    margin: 0,
    fontFamily: 'var(--font-heading)',
  },
  modalSubtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    marginTop: '0.25rem',
  },
  modalCloseBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '4px',
  },
  formErrorBox: {
    backgroundColor: 'var(--status-absent-bg)',
    color: 'var(--status-absent-text)',
    padding: '0.65rem 1rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
    marginBottom: '1rem',
    fontWeight: 500,
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.15rem',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontSize: '0.82rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  modalInput: {
    padding: '0.65rem 0.85rem',
    fontSize: '0.88rem',
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    outline: 'none',
    backgroundColor: 'var(--bg-primary)',
  },
  modalSelect: {
    padding: '0.65rem 0.85rem',
    fontSize: '0.88rem',
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    outline: 'none',
    backgroundColor: 'var(--bg-primary)',
    cursor: 'pointer',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    marginTop: '0.75rem',
  },
  cancelBtn: {
    padding: '0.65rem 1.25rem',
    fontSize: '0.88rem',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    backgroundColor: 'var(--bg-secondary)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
  },
  submitBtn: {
    padding: '0.65rem 1.35rem',
    fontSize: '0.88rem',
    fontWeight: 600,
  },
};

export default Schedule;
