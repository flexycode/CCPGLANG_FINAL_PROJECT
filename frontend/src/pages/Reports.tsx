/**
 * Reports.tsx — Comprehensive Attendance Analytics & Reports Page
 * ================================================================
 * PARADIGM: Functional Programming (FP)
 * 
 * Reflects Figma Prototype (node-id: 26-1430):
 * - Interactive multi-class switcher tabs (All Classes, CCPGLANG, CCINTHCI, CCAUTOMATA, CCDATRCL)
 * - Period / Date range filter (Full Semester, Past 30 Days, This Week)
 * - Metric Cards with Yellow-styled Late Counter
 * - Interactive SVG Attendance Trend Line/Area Chart with hover states
 * - Interactive Absences vs Lates Grouped Comparison Chart
 * - At-Risk Students Registry (from the 50-student dataset)
 * - Export Report functionality (CSV summary generator)
 */

import React, { useState, useMemo } from 'react';
import { 
  Download, 
  AlertTriangle, 
  Calendar, 
  TrendingUp, 
  Clock, 
  UserX, 
  CheckCircle2, 
  Send
} from 'lucide-react';
import { RAW_STUDENTS_LIST } from '../data/studentsData';

interface ClassMetric {
  code: string;
  name: string;
  enrolled: number;
  avgAttendance: number;
  totalAbsences: number;
  totalLates: number;
  totalExcused: number;
}

const CLASS_METRICS_DATA: Record<string, ClassMetric> = {
  CCPGLANG: {
    code: 'CCPGLANG',
    name: 'Programming Languages',
    enrolled: 50,
    avgAttendance: 92.4,
    totalAbsences: 18,
    totalLates: 14,
    totalExcused: 6,
  },
  CCINTHCI: {
    code: 'CCINTHCI',
    name: 'Human Computer Interaction',
    enrolled: 50,
    avgAttendance: 94.6,
    totalAbsences: 12,
    totalLates: 9,
    totalExcused: 4,
  },
  CCAUTOMATA: {
    code: 'CCAUTOMATA',
    name: 'Automata Theory',
    enrolled: 50,
    avgAttendance: 88.5,
    totalAbsences: 26,
    totalLates: 19,
    totalExcused: 8,
  },
  CCDATRCL: {
    code: 'CCDATRCL',
    name: 'Data Structure',
    enrolled: 50,
    avgAttendance: 90.2,
    totalAbsences: 22,
    totalLates: 16,
    totalExcused: 5,
  },
};

// Trend data across weeks 1 to 8
const WEEKLY_TREND_DATA: Record<string, number[]> = {
  ALL: [89, 91, 93, 90, 94, 92, 95, 93],
  CCPGLANG: [90, 92, 94, 91, 93, 91, 94, 92],
  CCINTHCI: [92, 94, 95, 93, 96, 95, 97, 95],
  CCAUTOMATA: [85, 87, 89, 86, 90, 88, 91, 89],
  CCDATRCL: [88, 90, 91, 89, 92, 91, 93, 90],
};

const WEEKS_LABELS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'];

const Reports: React.FC = () => {
  const [selectedClassTab, setSelectedClassTab] = useState<string>('ALL');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('semester');
  const [hoveredWeekIdx, setHoveredWeekIdx] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState<string>('');

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Aggregated KPIs
  const currentMetrics = useMemo(() => {
    if (selectedClassTab === 'ALL') {
      const totalEnrolled = Object.values(CLASS_METRICS_DATA).reduce((sum, c) => sum + c.enrolled, 0);
      const totalAbsences = Object.values(CLASS_METRICS_DATA).reduce((sum, c) => sum + c.totalAbsences, 0);
      const totalLates = Object.values(CLASS_METRICS_DATA).reduce((sum, c) => sum + c.totalLates, 0);
      const avgAttendance = 
        Object.values(CLASS_METRICS_DATA).reduce((sum, c) => sum + c.avgAttendance, 0) / 4;

      return {
        title: 'All Enrolled Classes',
        enrolled: totalEnrolled,
        avgAttendance: avgAttendance.toFixed(1) + '%',
        totalAbsences,
        totalLates,
      };
    }

    const c = CLASS_METRICS_DATA[selectedClassTab] || CLASS_METRICS_DATA['CCPGLANG']!;
    return {
      title: `${c.name} (${c.code})`,
      enrolled: c.enrolled,
      avgAttendance: `${c.avgAttendance}%`,
      totalAbsences: c.totalAbsences,
      totalLates: c.totalLates,
    };
  }, [selectedClassTab]);

  // Dynamic At-Risk Students list from the 50 students
  const atRiskStudents = useMemo(() => {
    const list = [
      { student: RAW_STUDENTS_LIST[2]!, course: 'CCAUTOMATA', absences: 4, lates: 3, riskLevel: 'High' },
      { student: RAW_STUDENTS_LIST[4]!, course: 'CCPGLANG', absences: 2, lates: 5, riskLevel: 'Medium' },
      { student: RAW_STUDENTS_LIST[8]!, course: 'CCDATRCL', absences: 3, lates: 2, riskLevel: 'High' },
      { student: RAW_STUDENTS_LIST[10]!, course: 'CCAUTOMATA', absences: 3, lates: 4, riskLevel: 'High' },
      { student: RAW_STUDENTS_LIST[18]!, course: 'CCPGLANG', absences: 2, lates: 4, riskLevel: 'Medium' },
      { student: RAW_STUDENTS_LIST[22]!, course: 'CCINTHCI', absences: 4, lates: 1, riskLevel: 'High' },
      { student: RAW_STUDENTS_LIST[32]!, course: 'CCDATRCL', absences: 3, lates: 3, riskLevel: 'High' },
      { student: RAW_STUDENTS_LIST[35]!, course: 'CCPGLANG', absences: 1, lates: 5, riskLevel: 'Medium' },
    ];
    return list.filter(item => selectedClassTab === 'ALL' || item.course === selectedClassTab);
  }, [selectedClassTab]);

  // CSV Report Generator
  const handleExportReport = () => {
    const rows = [
      ['Attendance Report Summary', new Date().toLocaleDateString()],
      ['Selected View', selectedClassTab],
      ['Total Enrolled', currentMetrics.enrolled],
      ['Avg. Attendance', currentMetrics.avgAttendance],
      ['Total Absences', currentMetrics.totalAbsences],
      ['Total Lates', currentMetrics.totalLates],
      [],
      ['Subject Code', 'Subject Name', 'Enrolled', 'Avg Attendance', 'Absences', 'Lates'],
      ...Object.values(CLASS_METRICS_DATA).map(c => [
        c.code,
        `"${c.name}"`,
        c.enrolled,
        `${c.avgAttendance}%`,
        c.totalAbsences,
        c.totalLates,
      ]),
    ];

    const csvContent = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Attendance_Report_${selectedClassTab}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('Report successfully downloaded.');
  };

  // Trend Chart data points for active class tab
  const trendPoints: number[] = (WEEKLY_TREND_DATA[selectedClassTab] || WEEKLY_TREND_DATA['ALL'])!;

  return (
    <div style={styles.container}>
      {/* Toast Feedback */}
      {toastMsg && (
        <div style={styles.toast}>
          <CheckCircle2 size={18} color="#22C55E" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header Section */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Attendance Reports & Analytics</h1>
          <p style={styles.subtitle}>
            A.Y. 2026 - 2027 &bull; First Semester Attendance Performance and At-Risk Analysis
          </p>
        </div>

        <div style={styles.headerActions}>
          <div style={styles.periodSelectorWrapper}>
            <Calendar size={15} style={styles.periodIcon} />
            <select 
              value={selectedPeriod} 
              onChange={(e) => {
                setSelectedPeriod(e.target.value);
                triggerToast(`Period updated to: ${e.target.value}`);
              }}
              style={styles.periodSelect}
            >
              <option value="semester">First Semester (Full)</option>
              <option value="month">Past 30 Days</option>
              <option value="week">Current Week</option>
            </select>
          </div>

          <button 
            className="btn-primary" 
            style={styles.exportBtn}
            onClick={handleExportReport}
          >
            <Download size={16} /> Export Report
          </button>
        </div>
      </header>

      {/* Figma Class Selection Tabs Bar */}
      <div style={styles.tabsContainer}>
        <div style={styles.tabsList}>
          {[
            { id: 'ALL', label: 'All Classes' },
            { id: 'CCPGLANG', label: 'CCPGLANG (ProgLang)' },
            { id: 'CCINTHCI', label: 'CCINTHCI (HCI)' },
            { id: 'CCAUTOMATA', label: 'CCAUTOMATA (Automata)' },
            { id: 'CCDATRCL', label: 'CCDATRCL (Data Struct)' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedClassTab(tab.id)}
              style={{
                ...styles.tabBtn,
                ...(selectedClassTab === tab.id ? styles.activeTabBtn : {}),
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div style={styles.metricsGrid}>
        {/* Total Students Card */}
        <div className="card" style={styles.metricCard}>
          <div style={styles.metricHeader}>
            <span style={styles.metricLabel}>Total Students</span>
            <div style={styles.metricIconBox}>
              <TrendingUp size={18} color="var(--brand-primary)" />
            </div>
          </div>
          <span style={styles.metricValue}>{currentMetrics.enrolled}</span>
          <span style={styles.metricSub}>Active enrolled roster</span>
        </div>

        {/* Avg Attendance Rate Card */}
        <div className="card" style={{ ...styles.metricCard, borderLeft: '4px solid var(--status-present-text)' }}>
          <div style={styles.metricHeader}>
            <span style={styles.metricLabel}>Avg. Attendance Rate</span>
            <div style={{ ...styles.metricIconBox, backgroundColor: 'var(--status-present-bg)' }}>
              <CheckCircle2 size={18} color="var(--status-present-text)" />
            </div>
          </div>
          <span style={{ ...styles.metricValue, color: 'var(--status-present-text)' }}>
            {currentMetrics.avgAttendance}
          </span>
          <span style={styles.metricSub}>+1.8% vs last month</span>
        </div>

        {/* Total Absences Card */}
        <div className="card" style={{ ...styles.metricCard, borderLeft: '4px solid var(--status-absent-text)' }}>
          <div style={styles.metricHeader}>
            <span style={styles.metricLabel}>Total Absences</span>
            <div style={{ ...styles.metricIconBox, backgroundColor: 'var(--status-absent-bg)' }}>
              <UserX size={18} color="var(--status-absent-text)" />
            </div>
          </div>
          <span style={{ ...styles.metricValue, color: 'var(--status-absent-text)' }}>
            {currentMetrics.totalAbsences}
          </span>
          <span style={styles.metricSub}>Cumulative semester count</span>
        </div>

        {/* Note 2: Yellow Late Box */}
        <div 
          className="card" 
          style={{ 
            ...styles.metricCard, 
            backgroundColor: 'var(--status-late-bg)',
            borderColor: 'var(--status-late-border)',
            borderLeft: '4px solid #EAB308',
          }}
        >
          <div style={styles.metricHeader}>
            <span style={{ ...styles.metricLabel, color: 'var(--status-late-text)', fontWeight: 700 }}>
              Total Lates
            </span>
            <div style={{ ...styles.metricIconBox, backgroundColor: '#FEF08A' }}>
              <Clock size={18} color="var(--status-late-text)" />
            </div>
          </div>
          <span style={{ ...styles.metricValue, color: 'var(--status-late-text)' }}>
            {currentMetrics.totalLates}
          </span>
          <span style={{ ...styles.metricSub, color: 'var(--status-late-text)' }}>
            Needs attention before threshold
          </span>
        </div>
      </div>

      {/* Visualizations Grid */}
      <div style={styles.chartsGrid}>
        {/* Trend Area Chart Card */}
        <div className="card" style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <div>
              <h3 style={styles.chartTitle}>Overall Attendance Rate Trend</h3>
              <p style={styles.chartSubtitle}>Weekly attendance percentage across scheduled lecture days</p>
            </div>
            <div style={styles.legend}>
              <span style={styles.legendDot} />
              <span style={styles.legendText}>Attendance % (W1 - W8)</span>
            </div>
          </div>

          {/* SVG Area & Line Chart */}
          <div style={styles.chartSvgWrapper}>
            <svg viewBox="0 0 700 240" style={styles.svgChart}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1E1E1E" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#1E1E1E" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[70, 80, 90, 100].map(val => {
                const y = 200 - ((val - 70) / 30) * 160;
                return (
                  <g key={val}>
                    <line x1="50" y1={y} x2="680" y2={y} stroke="var(--border-color)" strokeDasharray="3 3" />
                    <text x="35" y={y + 4} fill="var(--text-muted)" fontSize="11" textAnchor="end">
                      {val}%
                    </text>
                  </g>
                );
              })}

              {/* Area fill */}
              {(() => {
                const pointsStr = trendPoints.map((val, idx) => {
                  const x = 70 + idx * 80;
                  const y = 200 - ((val - 70) / 30) * 160;
                  return `${x},${y}`;
                }).join(' ');

                const firstX = 70;
                const lastX = 70 + (trendPoints.length - 1) * 80;
                return (
                  <polygon 
                    points={`${firstX},200 ${pointsStr} ${lastX},200`}
                    fill="url(#chartGradient)"
                  />
                );
              })()}

              {/* Line path */}
              {(() => {
                const d = trendPoints.map((val, idx) => {
                  const x = 70 + idx * 80;
                  const y = 200 - ((val - 70) / 30) * 160;
                  return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ');
                return <path d={d} fill="none" stroke="var(--brand-primary)" strokeWidth="3" />;
              })()}

              {/* Data Points */}
              {trendPoints.map((val, idx) => {
                const x = 70 + idx * 80;
                const y = 200 - ((val - 70) / 30) * 160;
                const isHovered = hoveredWeekIdx === idx;
                return (
                  <g 
                    key={idx} 
                    onMouseEnter={() => setHoveredWeekIdx(idx)}
                    onMouseLeave={() => setHoveredWeekIdx(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle 
                      cx={x} 
                      cy={y} 
                      r={isHovered ? 6 : 4} 
                      fill="var(--bg-white)" 
                      stroke="var(--brand-primary)" 
                      strokeWidth={isHovered ? 3 : 2} 
                    />
                    {isHovered && (
                      <g>
                        <rect x={x - 24} y={y - 28} width="48" height="22" rx="4" fill="#1E1E1E" />
                        <text x={x} y={y - 14} fill="#FFFFFF" fontSize="11" fontWeight="600" textAnchor="middle">
                          {val}%
                        </text>
                      </g>
                    )}
                    <text x={x} y="222" fill="var(--text-muted)" fontSize="11" textAnchor="middle">
                      {WEEKS_LABELS[idx]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Absences vs Lates Grouped Bar Chart */}
        <div className="card" style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <div>
              <h3 style={styles.chartTitle}>Absences vs. Lates Distribution</h3>
              <p style={styles.chartSubtitle}>Comparison across all 4 subjects</p>
            </div>
            <div style={styles.legend}>
              <span style={{ ...styles.legendDot, backgroundColor: 'var(--status-absent-text)' }} />
              <span style={styles.legendText}>Absences</span>
              <span style={{ ...styles.legendDot, backgroundColor: '#EAB308', marginLeft: '0.75rem' }} />
              <span style={styles.legendText}>Lates (Yellow)</span>
            </div>
          </div>

          <div style={styles.barsContainer}>
            {Object.values(CLASS_METRICS_DATA).map(c => {
              const maxScale = 30;
              const absPct = (c.totalAbsences / maxScale) * 100;
              const latePct = (c.totalLates / maxScale) * 100;

              return (
                <div key={c.code} style={styles.barGroup}>
                  <div style={styles.barPair}>
                    {/* Absent Bar */}
                    <div style={styles.barColumn}>
                      <span style={styles.barValueLabel}>{c.totalAbsences}</span>
                      <div 
                        style={{
                          ...styles.barFill,
                          height: `${absPct}%`,
                          backgroundColor: 'var(--status-absent-text)',
                        }}
                      />
                    </div>

                    {/* Late Bar (Yellow) */}
                    <div style={styles.barColumn}>
                      <span style={{ ...styles.barValueLabel, color: 'var(--status-late-text)' }}>
                        {c.totalLates}
                      </span>
                      <div 
                        style={{
                          ...styles.barFill,
                          height: `${latePct}%`,
                          backgroundColor: '#FACC15',
                          border: '1px solid #EAB308',
                        }}
                      />
                    </div>
                  </div>
                  <span style={styles.barSubjectLabel}>{c.code}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── At-Risk Students Section ──────────────────────────────── */}
      <div className="card" style={styles.tableCard}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionTitleRow}>
            <AlertTriangle size={18} color="#EF4444" />
            <h3 style={styles.sectionTitle}>At-Risk Students Requiring Attention</h3>
          </div>
          <span style={styles.sectionBadge}>
            {atRiskStudents.length} student(s) exceeding advisory limits
          </span>
        </div>

        <div style={styles.tableResponsive}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Student Information</th>
                <th style={styles.th}>Course</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Total Absences</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Total Lates</th>
                <th style={styles.th}>Risk Level</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Faculty Action</th>
              </tr>
            </thead>
            <tbody>
              {atRiskStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No students currently flagged as at-risk for this course selection.
                  </td>
                </tr>
              ) : (
                atRiskStudents.map((item, idx) => (
                  <tr key={idx} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={styles.studentCell}>
                        <div style={styles.avatarMini}>{item.student.name.slice(0, 2).toUpperCase()}</div>
                        <div>
                          <div style={styles.studentName}>{item.student.name}</div>
                          <div style={styles.studentId}>{item.student.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.courseTag}>{item.course}</span>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center', fontWeight: 700, color: 'var(--status-absent-text)' }}>
                      {item.absences}
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center', fontWeight: 700, color: 'var(--status-late-text)' }}>
                      {item.lates}
                    </td>
                    <td style={styles.td}>
                      <span 
                        style={{
                          ...styles.riskBadge,
                          backgroundColor: item.riskLevel === 'High' ? 'var(--status-absent-bg)' : 'var(--status-late-bg)',
                          color: item.riskLevel === 'High' ? 'var(--status-absent-text)' : 'var(--status-late-text)',
                          border: item.riskLevel === 'High' ? '1px solid #FCA5A5' : '1px solid var(--status-late-border)',
                        }}
                      >
                        {item.riskLevel} Risk
                      </span>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>
                      <button 
                        style={styles.actionNoticeBtn}
                        onClick={() => triggerToast(`Advisory email dispatched to ${item.student.name}.`)}
                      >
                        <Send size={13} /> Send Advisory
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Class Comparison Overview Table ────────────────────────── */}
      <div className="card" style={styles.tableCard}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>Course Comparison Overview</h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Summary of all active subjects for Prof. Susan Caluya
          </span>
        </div>

        <div style={styles.tableResponsive}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Subject Code</th>
                <th style={styles.th}>Subject Name</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Roster Count</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Avg. Attendance %</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Total Absences</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Total Lates</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(CLASS_METRICS_DATA).map(c => (
                <tr key={c.code} style={styles.tr}>
                  <td style={{ ...styles.td, fontWeight: 700 }}>{c.code}</td>
                  <td style={styles.td}>{c.name}</td>
                  <td style={{ ...styles.td, textAlign: 'center' }}>{c.enrolled}</td>
                  <td style={{ ...styles.td, textAlign: 'center', fontWeight: 600, color: 'var(--status-present-text)' }}>
                    {c.avgAttendance}%
                  </td>
                  <td style={{ ...styles.td, textAlign: 'center', color: 'var(--status-absent-text)', fontWeight: 600 }}>
                    {c.totalAbsences}
                  </td>
                  <td style={{ ...styles.td, textAlign: 'center', color: 'var(--status-late-text)', fontWeight: 600 }}>
                    {c.totalLates}
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

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
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
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '1.5rem',
  },
  title: {
    fontSize: '1.85rem',
    margin: 0,
    fontFamily: 'var(--font-heading)',
  },
  subtitle: {
    color: 'var(--text-muted)',
    fontSize: '0.88rem',
    marginTop: '0.25rem',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  periodSelectorWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  periodIcon: {
    position: 'absolute',
    left: '0.75rem',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
  },
  periodSelect: {
    padding: '0.6rem 1rem 0.6rem 2.2rem',
    fontSize: '0.85rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-white)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    outline: 'none',
  },
  exportBtn: {
    padding: '0.6rem 1.15rem',
    fontSize: '0.85rem',
  },

  // Figma Tabs Bar
  tabsContainer: {
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0.25rem',
  },
  tabsList: {
    display: 'flex',
    gap: '0.5rem',
    overflowX: 'auto',
  },
  tabBtn: {
    padding: '0.6rem 1.25rem',
    fontSize: '0.88rem',
    fontWeight: 500,
    color: 'var(--text-muted)',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
  },
  activeTabBtn: {
    color: 'var(--text-primary)',
    fontWeight: 700,
    borderBottom: '2px solid var(--brand-primary)',
  },

  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.25rem',
  },
  metricCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    padding: '1.25rem 1.5rem',
    backgroundColor: 'var(--bg-white)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
  },
  metricHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: '0.82rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  metricIconBox: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValue: {
    fontSize: '1.85rem',
    fontWeight: 800,
    marginTop: '0.25rem',
    fontFamily: 'var(--font-heading)',
  },
  metricSub: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },

  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 1fr',
    gap: '1.5rem',
  },
  chartCard: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem',
    backgroundColor: 'var(--bg-white)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    minHeight: '340px',
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  chartTitle: {
    fontSize: '1.05rem',
    margin: 0,
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
  },
  chartSubtitle: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginTop: '0.2rem',
  },
  legend: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
  },
  legendDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'var(--brand-primary)',
  },
  legendText: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  chartSvgWrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  svgChart: {
    width: '100%',
    height: '100%',
    overflow: 'visible',
  },

  // Bar chart styles
  barsContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingTop: '2rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid var(--border-color)',
  },
  barGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },
  barPair: {
    display: 'flex',
    gap: '0.5rem',
    height: '150px',
    alignItems: 'flex-end',
  },
  barColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    width: '24px',
  },
  barValueLabel: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
    marginBottom: '0.25rem',
  },
  barFill: {
    width: '100%',
    borderRadius: '4px 4px 0 0',
    transition: 'height 0.4s ease',
  },
  barSubjectLabel: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginTop: '0.25rem',
  },

  tableCard: {
    padding: '0',
    overflow: 'hidden',
    backgroundColor: 'var(--bg-white)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid var(--border-color)',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  sectionTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    margin: 0,
    fontFamily: 'var(--font-body)',
  },
  sectionBadge: {
    fontSize: '0.78rem',
    color: 'var(--status-absent-text)',
    backgroundColor: 'var(--status-absent-bg)',
    padding: '0.25rem 0.65rem',
    borderRadius: '12px',
    fontWeight: 600,
  },

  tableResponsive: {
    overflowX: 'auto',
    width: '100%',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    minWidth: '700px',
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
  },
  td: {
    padding: '0.85rem 1.25rem',
    verticalAlign: 'middle',
  },
  studentCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  avatarMini: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: 'var(--bg-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  studentName: {
    fontWeight: 600,
    fontSize: '0.88rem',
    color: 'var(--text-primary)',
  },
  studentId: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontFamily: 'monospace',
  },
  courseTag: {
    backgroundColor: 'var(--bg-secondary)',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.78rem',
    fontWeight: 600,
  },
  riskBadge: {
    padding: '0.2rem 0.65rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 700,
    display: 'inline-block',
  },
  actionNoticeBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.35rem 0.75rem',
    fontSize: '0.78rem',
    fontWeight: 500,
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
  },
};

export default Reports;
