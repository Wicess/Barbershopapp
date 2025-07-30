import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, DollarSign } from 'lucide-react';
import { getTransactions, getBarbers, deleteTransaction } from '../../lib/storage';
import { Transaction, Barber } from '../../types';
import TransactionForm from './TransactionForm';

const TransactionList: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBarber, setFilterBarber] = useState('');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchTransactions();
    fetchBarbers();
  }, []);

  const fetchTransactions = () => {
    const allTransactions = getTransactions();
    const sorted = [...allTransactions].sort((a, b) => {
      const aValue = sortBy === 'timestamp' ? new Date(a.timestamp).getTime() : 
                    sortBy === 'amount' ? a.amount :
                    sortBy === 'clientName' ? a.clientName.toLowerCase() :
                    a.barberName.toLowerCase();
      
      const bValue = sortBy === 'timestamp' ? new Date(b.timestamp).getTime() : 
                    sortBy === 'amount' ? b.amount :
                    sortBy === 'clientName' ? b.clientName.toLowerCase() :
                    b.barberName.toLowerCase();

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setTransactions(sorted);
  };

  const fetchBarbers = () => {
    setBarbers(getBarbers());
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction? This action cannot be undone.')) {
      deleteTransaction(id);
      fetchTransactions();
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTransaction(null);
    fetchTransactions();
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.barberName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBarber = !filterBarber || transaction.barberId === filterBarber;
    return matchesSearch && matchesBarber;
  });

  useEffect(() => {
    fetchTransactions();
  }, [sortBy, sortOrder]);

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">Record and manage sales</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
        >
          <Plus className="h-5 w-5" />
          <span>Record Sale</span>
        </button>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by client or barber..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
          
          <div className="sm:col-span-2 lg:col-span-1">
            <select
            value={filterBarber}
            onChange={(e) => setFilterBarber(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
            <option value="">All Barbers</option>
            {barbers.map(barber => (
              <option key={barber.id} value={barber.id}>{barber.name}</option>
            ))}
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="timestamp-desc">Latest First</option>
            <option value="timestamp-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
            <option value="clientName-asc">Client Name A-Z</option>
            <option value="clientName-desc">Client Name Z-A</option>
            </select>
          </div>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
          <DollarSign className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
          <p className="text-gray-600 mb-6">Start recording sales to see them here</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Record First Sale
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => handleSort('timestamp')} className="flex items-center space-x-1 hover:text-gray-700">
                      <span className="hidden sm:inline">Date & Time</span>
                      <span className="sm:hidden">Date</span>
                    </button>
                  </th>
                  <th className="px-3 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => handleSort('clientName')} className="flex items-center space-x-1 hover:text-gray-700">
                      <span>Client Name</span>
                    </button>
                  </th>
                  <th className="hidden sm:table-cell px-3 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Barber
                  </th>
                  <th className="px-3 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => handleSort('amount')} className="flex items-center space-x-1 hover:text-gray-700">
                      <span>Amount</span>
                    </button>
                  </th>
                  <th className="hidden lg:table-cell px-3 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-3 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => {
                  const barber = barbers.find(b => b.id === transaction.barberId);
                  const commission = barber ? (transaction.amount * barber.commissionRate) / 100 : 0;
                  
                  return (
                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        <div className="hidden sm:block">
                          {new Date(transaction.timestamp).toLocaleString()}
                        </div>
                        <div className="sm:hidden">
                          {new Date(transaction.timestamp).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">
                        <div className="truncate max-w-[100px] sm:max-w-none">{transaction.clientName}</div>
                        <div className="sm:hidden text-xs text-gray-500 truncate max-w-[100px]">{transaction.barberName}</div>
                      </td>
                      <td className="hidden sm:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {transaction.barberName}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-green-600">
                        {transaction.amount.toFixed(0)} CFA
                      </td>
                      <td className="hidden lg:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-blue-600">
                        {commission.toFixed(0)} CFA
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <button
                            onClick={() => handleEdit(transaction)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <TransactionForm
          transaction={editingTransaction}
          barbers={barbers}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default TransactionList;