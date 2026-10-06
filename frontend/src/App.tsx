import { useState } from 'react';
import { ThemeProvider } from './utils/theme';
import SidePanel from './components/SidePanel';
import LoginForm from './components/LoginForm';
import Overview from './overview';
import Reports from './reports';
import ClassDetails from './classDetails';
import LandingPage from './pages/LandingPage';
import ToastContainer from './components/ui/toast';

const classTitleMap: Record<string, { title: string; code: string; fullCode: string }> = {
  CCPGLANG: { title: 'Programming Languages', code: 'CCPGLANG', fullCode: 'CCPGLANG - COM232' },
  CCINTHCI: { title: 'Human Computer Interaction', code: 'CCINTHCI', fullCode: 'CCINTHCI - COM242' },
  CCAUTOMATA: { title: 'Automata Theory', code: 'CCAUTOMATA', fullCode: 'CCAUTOMA - COM222' },
  CCAUTOMA: { title: 'Automata Theory', code: 'CCAUTOMATA', fullCode: 'CCAUTOMA - COM222' },
  CCDATRCL: { title: 'Data Structure', code: 'CCDATRCL', fullCode: 'CCDATRCL - COM242' },
};

type AppPage = 'Landing' | 'Login' | 'Dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('Landing');
  const [activePage, setActivePage] = useState('Overview');

  const handleSignIn = () => {
    setCurrentPage('Dashboard');
    setActivePage('Overview');
  };

  const handleSignOut = () => {
    setCurrentPage('Landing');
    setActivePage('Overview');
  };

  const renderContent = () => {
    // Landing page — first screen
    if (currentPage === 'Landing') {
      return <LandingPage onGetStarted={() => setCurrentPage('Login')} />;
    }

    // Login page
    if (currentPage === 'Login') {
      return (
        <div className="flex min-h-screen w-screen flex-col md:flex-row">
          <SidePanel onBackToLanding={() => setCurrentPage('Landing')} />
          <LoginForm onSignIn={handleSignIn} />
        </div>
      );
    }

    // Dashboard pages
    if (activePage === 'Reports') {
      return (
        <Reports
          onSignOut={handleSignOut}
          onPageChange={(page) => setActivePage(page)}
        />
      );
    }

    if (classTitleMap[activePage] || activePage.startsWith('CC')) {
      const currentClass = classTitleMap[activePage] || {
        title: activePage,
        code: activePage,
        fullCode: `${activePage} - COM232`,
      };
      return (
        <ClassDetails
          onSignOut={handleSignOut}
          onPageChange={(page) => setActivePage(page)}
          classCode={currentClass.code}
          classNameTitle={currentClass.title}
          fullCode={currentClass.fullCode}
        />
      );
    }

    return (
      <Overview
        onSignOut={handleSignOut}
        onPageChange={(page) => setActivePage(page)}
      />
    );
  };

  return (
    <ThemeProvider>
      {renderContent()}
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;
