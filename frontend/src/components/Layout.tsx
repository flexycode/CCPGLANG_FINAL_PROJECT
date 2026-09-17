import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const Layout: React.FC = () => {
  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.mainContent}>
        <Topbar />
        <main style={styles.pageContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: 'var(--bg-secondary)',
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    flex: 1,
  },
  pageContent: {
    padding: '2rem 2.5rem',
    flex: 1,
    overflowY: 'auto' as const,
  }
};

export default Layout;
