import React from 'react';
import { 
  BarChart3, 
  Users, 
  Receipt, 
  DollarSign, 
  TrendingUp,
  UserCheck,
  Scissors
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, description: 'Overview & Analytics' },
    { id: 'barbers', label: 'Barbers', icon: UserCheck, description: 'Manage Staff' },
    { id: 'transactions', label: 'Transactions', icon: Receipt, description: 'Record Sales' },
    { id: 'salaries', label: 'Salaries', icon: DollarSign, description: 'Commission Reports' },
    { id: 'reports', label: 'Reports', icon: TrendingUp, description: 'Analytics & Insights' },
  ];

  return (
    <aside className="w-16 sm:w-20 lg:w-72 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 h-full flex-shrink-0 transition-colors duration-300">
      <nav className="mt-4 lg:mt-8 px-2 lg:px-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-center lg:justify-start space-x-0 lg:space-x-3 px-2 lg:px-4 py-3 text-left rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-200 dark:border-blue-700'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
                title={item.label}
              >
                <div className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                  isActive 
                    ? 'bg-blue-200 dark:bg-blue-700 text-blue-700 dark:text-blue-300' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 hidden lg:block">
                  <p className="font-medium">{item.label}</p>
                  <p className={`text-xs ${
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {item.description}
                  </p>
                </div>
                {isActive && (
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;