import React from 'react';


const Dashboard: React.FC = () => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.greeting}>Good morning, Prof. Caluya</h1>
          <p style={styles.subtitle}>You have 3 classes scheduled today.</p>
        </div>
      </header>

      <section style={styles.classesSection}>
        <h2 style={styles.sectionTitle}>Today's Classes</h2>
        <div style={styles.classesGrid}>
          {/* Class Card 1 */}
          <div className="card" style={styles.classCard}>
            <div style={styles.classHeader}>
              <span style={styles.classCode}>CCPGLANG - COM232</span>
              <span style={styles.classTime}>3:00 PM - 5:00 PM</span>
            </div>
            <h3 style={styles.className}>Programming Languages</h3>
            <div style={styles.progressContainer}>
              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: '87.5%' }}></div>
              </div>
              <span style={styles.progressText}>35 / 40 checked in</span>
            </div>
          </div>

          {/* Class Card 2 */}
          <div className="card" style={styles.classCard}>
            <div style={styles.classHeader}>
              <span style={styles.classCode}>CCINTHCI - COM232</span>
              <span style={styles.classTime}>5:00 PM - 7:00 PM</span>
            </div>
            <h3 style={styles.className}>Human Computer Interaction</h3>
            <div style={styles.progressContainer}>
              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: '0%' }}></div>
              </div>
              <span style={styles.progressText}>0 / 38 checked in</span>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.analyticsSection}>
        <div style={styles.chartCard} className="card">
          <h3 style={styles.chartTitle}>Overall Attendance</h3>
          <div style={styles.chartPlaceholder}>
            {/* Placeholder for Area Chart */}
            <p>Attendance Chart (Week 1 - 5)</p>
          </div>
        </div>
        
        <div style={styles.chartCard} className="card">
          <h3 style={styles.chartTitle}>Requires Attention</h3>
          <div style={styles.chartPlaceholder}>
            {/* Placeholder for Line Chart */}
            <p>Classes with attendance drops</p>
          </div>
        </div>
      </section>
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
    marginBottom: '1rem',
  },
  greeting: {
    fontSize: '2rem',
    marginBottom: '0.25rem',
  },
  subtitle: {
    color: 'var(--text-muted)',
  },
  classesSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    fontFamily: 'var(--font-body)',
  },
  classesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  classCard: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  classHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  classCode: {
    color: 'var(--brand-primary)',
    backgroundColor: 'var(--bg-secondary)',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
  },
  classTime: {},
  className: {
    fontSize: '1.1rem',
    margin: 0,
    fontFamily: 'var(--font-body)',
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    marginTop: '0.5rem',
  },
  progressBar: {
    height: '6px',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'var(--status-present-text)',
    borderRadius: '3px',
  },
  progressText: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    alignSelf: 'flex-end',
  },
  analyticsSection: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '1.5rem',
  },
  chartCard: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    minHeight: '300px',
  },
  chartTitle: {
    fontSize: '1rem',
    margin: 0,
    fontFamily: 'var(--font-body)',
  },
  chartPlaceholder: {
    flex: 1,
    backgroundColor: 'var(--bg-primary)',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
  }
};

export default Dashboard;
