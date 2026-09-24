import { useState } from 'react';
import SidePanel from './components/SidePanel';
import LoginForm from './components/LoginForm';
import Overview from './overview';
import Reports from './reports';
import ClassDetails from './classDetails';
import ToastContainer from './components/ui/toast';

const classTitleMap: Record<string, { title: string; code: string; fullCode: string }> = {
  CCPGLANG: { title: 'Programming Languages', code: 'CCPGLANG', fullCode: 'CCPGLANG - COM232' },
  CCINTHCI: { title: 'Human Computer Interaction', code: 'CCINTHCI', fullCode: 'CCINTHCI - COM242' },
  CCAUTOMATA: { title: 'Automata Theory', code: 'CCAUTOMATA', fullCode: 'CCAUTOMA - COM222' },
  CCAUTOMA: { title: 'Automata Theory', code: 'CCAUTOMATA', fullCode: 'CCAUTOMA - COM222' },
  CCDATRCL: { title: 'Data Structure', code: 'CCDATRCL', fullCode: 'CCDATRCL - COM242' },
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState('Overview');

  const renderContent = () => {
    if (!isLoggedIn) {
      return (
        <div className="flex min-h-screen w-screen flex-col md:flex-row">
          <SidePanel />
          <LoginForm onSignIn={() => setIsLoggedIn(true)} />
        </div>
      );
    }

    if (activePage === 'Reports') {
      return (
        <Reports
          onSignOut={() => setIsLoggedIn(false)}
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
          onSignOut={() => setIsLoggedIn(false)}
          onPageChange={(page) => setActivePage(page)}
          classCode={currentClass.code}
          classNameTitle={currentClass.title}
          fullCode={currentClass.fullCode}
        />
      );
    }

    return (
      <Overview
        onSignOut={() => setIsLoggedIn(false)}
        onPageChange={(page) => setActivePage(page)}
      />
    );
  };

  return (
    <>
      {renderContent()}
      <ToastContainer />
    </>
  );
}

export default App;
