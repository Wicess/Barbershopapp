import React, { useState, useEffect } from 'react';
import { DollarSign, Users, Receipt, TrendingUp, Calendar, Scissors, Award } from 'lucide-react';
import StatsCard from './StatsCard';
import { getBarbers, getTransactions } from '../../lib/storage';
import { DashboardStats, Barber, Transaction } from '../../types';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalTransactions: 0,
    totalBarbers: 0,
    bestBarber: { name: 'No data', sales: 0 }
  });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchDashboardStats();
    fetchRecentTransactions();
  }, []);

  const fetchDashboardStats = () => {
    const barbers = getBarbers();
    const transactions = getTransactions();

    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    // Calculate monthly revenue (current month)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyRevenue = transactions
      .filter(t => {
        const transactionDate = new Date(t.timestamp);
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    // Find best barber
    const barberSales = new Map<string, { name: string; sales: number }>();
    
    transactions.forEach(transaction => {
      const existing = barberSales.get(transaction.barberId);
      if (existing) {
        existing.sales += transaction.amount;
      } else {
        barberSales.set(transaction.barberId, {
          name: transaction.barberName,
          sales: transaction.amount
        });
      }
    });

    const bestBarber = Array.from(barberSales.values())
      .reduce((best, current) => current.sales > best.sales ? current : best, 
              { name: 'No data', sales: 0 });

    setStats({
      totalRevenue,
      monthlyRevenue,
      totalTransactions: transactions.length,
      totalBarbers: barbers.length,
      bestBarber
    });
  };

  const fetchRecentTransactions = () => {
    const transactions = getTransactions()
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
    
    setRecentTransactions(transactions);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to your barbershop management system</p>
        </div>
        <div className="flex items-center space-x-2 text-gray-600 bg-white px-3 sm:px-4 py-2 rounded-lg shadow-sm border text-sm sm:text-base">
          <Calendar className="h-5 w-5" />
          <span className="font-medium hidden sm:inline">{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
          <span className="font-medium sm:hidden">{new Date().toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Revenue"
          value={`${stats.totalRevenue.toFixed(0)} CFA`}
          icon={DollarSign}
          color="green"
          subtitle="All time earnings"
        />
        <StatsCard
          title="Monthly Revenue"
          value={`${stats.monthlyRevenue.toFixed(0)} CFA`}
          icon={TrendingUp}
          color="blue"
          subtitle="Current month"
        />
        <StatsCard
          title="Total Transactions"
          value={stats.totalTransactions.toString()}
          icon={Receipt}
          color="orange"
          subtitle="Completed sales"
        />
        <StatsCard
          title="Active Barbers"
          value={stats.totalBarbers.toString()}
          icon={Users}
          color="purple"
          subtitle="Staff members"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Performer</h3>
            <div className="bg-yellow-50 p-2 rounded-lg">
              <Award className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
          <div className="text-center">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Scissors className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-1">{stats.bestBarber.name}</h4>
            <p className="text-gray-600 mb-2">Best Performing Barber</p>
            <div className="bg-green-50 px-4 py-2 rounded-lg inline-block">
              <span className="text-green-700 font-semibold">{stats.bestBarber.sales.toFixed(0)} CFA</span>
              <span className="text-green-600 text-sm ml-1">total sales</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{transaction.clientName}</p>
                    <p className="text-sm text-gray-600">by {transaction.barberName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{transaction.amount.toFixed(0)} CFA</p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Receipt className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No recent transactions</p>
                <p className="text-sm">Start recording sales to see them here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-6 rounded-2xl text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Quick Actions</h3>
            <p className="text-blue-100">Manage your barbershop efficiently</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            <button 
              onClick={() => onNavigate('transactions')}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium hover:scale-105 transform"
            >
              Record Sale
            </button>
            <button 
              onClick={() => onNavigate('barbers')}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium hover:scale-105 transform"
            >
              Add Barber
            </button>
            <button 
              onClick={() => onNavigate('reports')}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium hover:scale-105 transform"
            >
              View Reports
            </button>
            <button 
              onClick={() => onNavigate('salaries')}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium hover:scale-105 transform"
            >
              Salary Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;