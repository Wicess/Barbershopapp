import React, { useState, useEffect } from 'react';
import { Download, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { getBarbers, getTransactions } from '../../lib/storage';
import { Barber, Transaction, SalaryReport } from '../../types';

const SalaryReports: React.FC = () => {
  const [salaryReports, setSalaryReports] = useState<SalaryReport[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedBarber, setSelectedBarber] = useState('');

  useEffect(() => {
    fetchBarbers();
    generateSalaryReports();
  }, [selectedMonth, selectedYear, selectedBarber]);

  const fetchBarbers = () => {
    setBarbers(getBarbers());
  };

  const generateSalaryReports = () => {
    const allBarbers = getBarbers();
    const allTransactions = getTransactions();

    // Filter transactions by selected month/year
    const filteredTransactions = allTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.timestamp);
      const matchesMonth = transactionDate.getMonth() + 1 === selectedMonth;
      const matchesYear = transactionDate.getFullYear() === selectedYear;
      const matchesBarber = !selectedBarber || transaction.barberId === selectedBarber;
      
      return matchesMonth && matchesYear && matchesBarber;
    });

    // Group by barber and calculate salaries
    const salaryMap = new Map<string, SalaryReport>();

    filteredTransactions.forEach(transaction => {
      const barber = allBarbers.find(b => b.id === transaction.barberId);
      if (!barber) return;

      const existing = salaryMap.get(transaction.barberId);
      const commission = (transaction.amount * barber.commissionRate) / 100;

      if (existing) {
        existing.totalSales += transaction.amount;
        existing.commissionEarned += commission;
      } else {
        salaryMap.set(transaction.barberId, {
          barberId: transaction.barberId,
          barberName: transaction.barberName,
          totalSales: transaction.amount,
          commissionEarned: commission,
          month: selectedMonth.toString().padStart(2, '0'),
          year: selectedYear
        });
      }
    });

    setSalaryReports(Array.from(salaryMap.values()).sort((a, b) => b.commissionEarned - a.commissionEarned));
  };

  const exportToCSV = () => {
    const headers = [
      'Barber Name',
      'Total Sales',
      'Commission Earned',
      'Month',
      'Year'
    ];
    
    const csvContent = [
      headers.join(','),
      ...salaryReports.map(report => [
        report.barberName,
        report.totalSales.toFixed(2),
        report.commissionEarned.toFixed(2),
        report.month,
        report.year
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `salary-report-${selectedYear}-${selectedMonth.toString().padStart(2, '0')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalEarnings = salaryReports.reduce((sum, report) => sum + report.commissionEarned, 0);
  const totalSales = salaryReports.reduce((sum, report) => sum + report.totalSales, 0);

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Salary Reports</h1>
          <p className="text-gray-600 mt-1">Track barber earnings and commissions</p>
        </div>
        <button
          onClick={exportToCSV}
          className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
        >
          <Download className="h-5 w-5" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>{year}</option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Barber</label>
            <select
              value={selectedBarber}
              onChange={(e) => setSelectedBarber(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="">All Barbers</option>
              {barbers.map(barber => (
                <option key={barber.id} value={barber.id}>{barber.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Commissions</p>
              <p className="text-3xl font-bold text-green-600">{totalEarnings.toFixed(0)} CFA</p>
            </div>
            <div className="bg-green-50 p-3 rounded-xl">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-3xl font-bold text-blue-600">{totalSales.toFixed(0)} CFA</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Salary Details - {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
        </div>

        {salaryReports.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No salary data found</h3>
            <p className="text-gray-600">No sales recorded for the selected period.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Barber Name
                  </th>
                  <th className="hidden sm:table-cell px-3 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Sales
                  </th>
                  <th className="px-3 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission Earned
                  </th>
                  <th className="hidden lg:table-cell px-3 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {salaryReports.map((report) => {
                  const barber = barbers.find(b => b.id === report.barberId);
                  return (
                    <tr key={report.barberId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm font-medium text-gray-900">
                        <div className="truncate max-w-[120px] sm:max-w-none">{report.barberName}</div>
                        <div className="sm:hidden text-xs text-gray-500">{report.totalSales.toFixed(0)} CFA sales</div>
                      </td>
                      <td className="hidden sm:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {report.totalSales.toFixed(0)} CFA
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-bold text-green-600">
                        {report.commissionEarned.toFixed(0)} CFA
                      </td>
                      <td className="hidden lg:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {barber?.commissionRate || 50}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalaryReports;