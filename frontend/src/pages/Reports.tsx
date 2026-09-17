import React from 'react';
import MetricCard from '../components/MetricCard';

const Reports: React.FC = () => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Attendance Reports</h1>
        <p style={styles.subtitle}>2026 - 2027 insights and data</p>
      </header>

      <div style={styles.metricsGrid}>
        <MetricCard title="Total Students" value="160" />
        <MetricCard title="Avg. Attendance Rate" value="92.4%" highlight />
        <MetricCard title="Total Absences" value="24" />
        <MetricCard title="Total Lates" value="15" />
      </div>

      <div style={styles.chartsGrid}>
        <div className="card" style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>Overall Attendance Rate Trend</h3>
            <div style={styles.tabs}>
              <span style={{ ...styles.tab, ...styles.activeTab }}>All Classes</span>
              <span style={styles.tab}>CCPGLANG</span>
              <span style={styles.tab}>CCINTHCI</span>
              <span style={styles.tab}>CCAUTOMATA</span>
            </div>
          </div>
          <div style={styles.chartPlaceholder}>
            <p>Line Chart: Attendance over weeks</p>
          </div>
        </div>

        <div className="card" style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>Absences vs Lates</h3>
          </div>
          <div style={styles.chartPlaceholder}>
            <p>Bar Chart: Absences/Lates grouped by subject</p>
          </div>
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
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1.5rem',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1.5rem',
  },
  chartCard: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
    minHeight: '400px',
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: '1.1rem',
    margin: 0,
    fontFamily: 'var(--font-body)',
  },
  tabs: {
    display: 'flex',
    gap: '1rem',
  },
  tab: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '0.5rem 0',
  },
  activeTab: {
    color: 'var(--text-primary)',
    fontWeight: 600,
    borderBottom: '2px solid var(--brand-primary)',
  },
  chartPlaceholder: {
    flex: 1,
    backgroundColor: 'var(--bg-primary)',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted)',
  }
};

export default Reports;
