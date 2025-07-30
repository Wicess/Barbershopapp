import React, { useState, useEffect } from 'react';
import { BarChart, Download, TrendingUp, Calendar } from 'lucide-react';
import { getTransactions, getBarbers } from '../../lib/storage';
import { Transaction, Barber } from '../../types';

const Reports: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedBarber, setSelectedBarber] = useState('');

  useEffect(() => {
    fetchData();
  }, [selectedPeriod, selectedBarber]);

  const fetchData = () => {
    setTransactions(getTransactions());
    setBarbers(getBarbers());
  };

  const getFilteredTransactions = () => {
    let filtered = transactions;

    if (selectedBarber) {
      filtered = filtered.filter(t => t.barberId === selectedBarber);
    }

    const now = new Date();
    const startDate = new Date();

    switch (selectedPeriod) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return filtered.filter(t => new Date(t.timestamp) >= startDate);
  };

  const filteredTransactions = getFilteredTransactions();
  const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  const averageTransaction = filteredTransactions.length > 0 ? totalRevenue / filteredTransactions.length : 0;

  const generateDailyReport = () => {
    const dailyData = new Map<string, number>();
    
    filteredTransactions.forEach(transaction => {
      const date = new Date(transaction.timestamp).toDateString();
      dailyData.set(date, (dailyData.get(date) || 0) + transaction.amount);
    });

    return Array.from(dailyData.entries())
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .slice(-7); // Last 7 days
  };

  const generateBarberReport = () => {
    const barberData = new Map<string, { name: string; sales: number; count: number }>();
    
    filteredTransactions.forEach(transaction => {
      const barberId = transaction.barberId;
      const existing = barberData.get(barberId);
      
      if (existing) {
        existing.sales += transaction.amount;
        existing.count += 1;
      } else {
        barberData.set(barberId, {
          name: transaction.barberName,
          sales: transaction.amount,
          count: 1
        });
      }
    });

    return Array.from(barberData.values())
      .sort((a, b) => b.sales - a.sales);
  };

  const exportReport = () => {
    const headers = ['Date', 'Barber', 'Client', 'Amount'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => [
        new Date(t.timestamp).toLocaleDateString(),
        t.barberName,
        t.clientName,
        t.amount.toFixed(2)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `barbershop-report-${selectedPeriod}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const dailyData = generateDailyReport();
  const barberData = generateBarberReport();

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Analyze your barbershop performance</p>
        </div>
        <button
          onClick={exportReport}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
        >
          <Download className="h-4 w-4" />
          <span>Export Report</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last 3 Months</option>
              <option value="year">Last Year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Barber</label>
            <select
              value={selectedBarber}
              onChange={(e) => setSelectedBarber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Barbers</option>
              {barbers.map(barber => (
                <option key={barber.id} value={barber.id}>{barber.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">{totalRevenue.toFixed(0)} CFA</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-blue-600">{filteredTransactions.length}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <BarChart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Transaction</p>
              <p className="text-2xl font-bold text-purple-600">{averageTransaction.toFixed(0)} CFA</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Daily Sales (Last 7 Days)</h3>
          <div className="space-y-3">
            {dailyData.map(([date, amount]) => (
              <div key={date} className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600 truncate max-w-[80px] sm:max-w-none">{new Date(date).toLocaleDateString()}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 sm:w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(amount / Math.max(...dailyData.map(([, amt]) => amt))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs sm:text-sm font-medium">{amount.toFixed(0)} CFA</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Barber Performance</h3>
          <div className="space-y-3">
            {barberData.map((barber, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <span className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[100px] sm:max-w-none block">{barber.name}</span>
                  <span className="text-xs text-gray-500">({barber.count} transactions)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 sm:w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(barber.sales / Math.max(...barberData.map(b => b.sales))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs sm:text-sm font-medium">{barber.sales.toFixed(0)} CFA</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;