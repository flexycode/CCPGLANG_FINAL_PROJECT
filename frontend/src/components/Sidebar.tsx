import { NavLink } from 'react-router-dom';
import { Home, BarChart2, LayoutGrid, CheckCircle } from 'lucide-react';

const Sidebar = () => {
  const classes = [
    { code: 'CCPGLANG', name: 'Programming Languages' },
    { code: 'CCINTHCI', name: 'Human Computer Interaction' },
    { code: 'CCAUTOMATA', name: 'Automata Theory' },
    { code: 'CCDATRCL', name: 'Data Structure' }
  ];

  return (
    <aside style={styles.sidebar}>
      <div style={styles.brand}>
        <h2>Checkmate</h2>
        <p>ATTENDANCE MONITORING</p>
      </div>
      
      <nav style={styles.nav}>
        <NavLink to="/dashboard" style={({ isActive }) => isActive ? { ...styles.navItem, ...styles.activeNavItem } : styles.navItem}>
          <Home size={20} />
          Overview
        </NavLink>
        <NavLink to="/reports" style={({ isActive }) => isActive ? { ...styles.navItem, ...styles.activeNavItem } : styles.navItem}>
          <BarChart2 size={20} />
          Reports
        </NavLink>
      </nav>

      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>YOUR CLASSES</h4>
        <ul style={styles.classList}>
          {classes.map(c => (
            <li key={c.code} style={styles.classItem}>
              <NavLink to={`/schedule/${c.code}`} style={({ isActive }) => isActive ? { ...styles.classLink, ...styles.activeClassLink } : styles.classLink}>
                <span style={styles.classIcon}><LayoutGrid size={16} /></span>
                {c.name} ({c.code})
              </NavLink>
            </li>
          ))}
        </ul>
        <NavLink to="/attendance-point" style={({ isActive }) => isActive ? { ...styles.navItem, ...styles.activeNavItem, marginTop: '1rem' } : { ...styles.navItem, marginTop: '1rem' }}>
          <CheckCircle size={20} />
          Attendance Point
        </NavLink>
      </div>

      <NavLink to="/settings" style={({ isActive }) => isActive ? { ...styles.userProfile, backgroundColor: 'var(--bg-primary)' } : styles.userProfile}>
        <div style={styles.avatar}>SC</div>
        <div>
          <h4 style={styles.userName}>Prof. Susan Caluya</h4>
          <p style={styles.userDept}>Computer Science</p>
        </div>
      </NavLink>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '280px',
    backgroundColor: 'var(--bg-white)',
    borderRight: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100vh',
    padding: '2rem 1.5rem',
  },
  brand: {
    marginBottom: '2rem',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    marginBottom: '2rem',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-secondary)',
    fontWeight: 500,
    transition: 'background 0.2s',
  },
  activeNavItem: {
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--brand-primary)',
  },
  section: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: '0.75rem',
    textTransform: 'uppercase' as const,
    color: 'var(--text-muted)',
    marginBottom: '1rem',
    letterSpacing: '0.05em',
  },
  classList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  classItem: {},
  classLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    padding: '0.5rem 1rem',
    borderRadius: 'var(--radius-md)',
  },
  activeClassLink: {
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--brand-primary)',
    fontWeight: 500,
  },
  classIcon: {
    opacity: 0.7,
  },
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid var(--border-color)',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'var(--brand-primary)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
  },
  userName: {
    fontSize: '0.9rem',
    margin: 0,
    fontFamily: 'var(--font-body)',
  },
  userDept: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    margin: 0,
  }
};

export default Sidebar;
