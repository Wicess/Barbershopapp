import React, { useState, useEffect } from 'react';
import { isLoggedIn, initializeDemoData } from './lib/storage';
import LoginForm from './components/Auth/LoginForm';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import BarberList from './components/Barbers/BarberList';
import TransactionList from './components/Transactions/TransactionList';
import SalaryReports from './components/Salaries/SalaryReports';
import Reports from './components/Reports/Reports';
import Settings from './components/Settings/Settings';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Initialize demo data on first load
    initializeDemoData();
    
    // Check if user is logged in
    setAuthenticated(isLoggedIn());
  }, []);

  const handleLogin = () => {
    setAuthenticated(true);
  };

  const handleLogout = () => {
    setAuthenticated(false);
  };

  const handleOpenSettings = () => {
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  if (!authenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'barbers':
        return <BarberList />;
      case 'transactions':
        return <TransactionList />;
      case 'salaries':
        return <SalaryReports />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
      <Header onLogout={handleLogout} onOpenSettings={handleOpenSettings} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          activeTab={showSettings ? 'settings' : activeTab} 
          onTabChange={(tab) => {
            if (tab === 'settings') {
              setShowSettings(true);
            } else {
              setShowSettings(false);
              setActiveTab(tab);
            }
          }} 
        />
        <main className="flex-1 overflow-x-auto overflow-y-auto">
          {showSettings ? <Settings /> : renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;