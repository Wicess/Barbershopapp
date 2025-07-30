import React, { useState } from 'react';
import { X } from 'lucide-react';
import { addTransaction, updateTransaction } from '../../lib/storage';
import { Transaction, Barber } from '../../types';

interface TransactionFormProps {
  transaction?: Transaction | null;
  barbers: Barber[];
  onClose: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ transaction, barbers, onClose }) => {
  const [barberId, setBarberId] = useState(transaction?.barberId || '');
  const [clientName, setClientName] = useState(transaction?.clientName || '');
  const [amount, setAmount] = useState(transaction?.amount?.toString() || '');
  const [timestamp, setTimestamp] = useState(
    transaction ? new Date(transaction.timestamp).toISOString().slice(0, 16) : 
    new Date().toISOString().slice(0, 16)
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const selectedBarber = barbers.find(b => b.id === barberId);
      if (!selectedBarber) {
        alert('Please select a barber');
        return;
      }

      const transactionData = {
        barberId,
        barberName: selectedBarber.name,
        clientName,
        amount: parseFloat(amount),
        timestamp: new Date(timestamp).toISOString(),
      };

      if (transaction) {
        // Update existing transaction
        updateTransaction(transaction.id, transactionData);
      } else {
        // Create new transaction
        addTransaction(transactionData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedBarber = barbers.find(b => b.id === barberId);
  const commission = selectedBarber && amount ? 
    (parseFloat(amount) * selectedBarber.commissionRate) / 100 : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {transaction ? 'Edit Transaction' : 'Record New Sale'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="barber" className="block text-sm font-medium text-gray-700 mb-2">
              Barber *
            </label>
            <select
              id="barber"
              required
              value={barberId}
              onChange={(e) => setBarberId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="">Select a barber</option>
              {barbers.map(barber => (
                <option key={barber.id} value={barber.id}>
                  {barber.name} ({barber.commissionRate}% commission)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-2">
              Client Name *
            </label>
            <input
              id="clientName"
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter client name"
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount (CFA) *
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="0.00"
            />
            {commission > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                Commission: {commission.toFixed(0)} CFA ({selectedBarber?.commissionRate}%)
              </p>
            )}
          </div>

          <div>
            <label htmlFor="timestamp" className="block text-sm font-medium text-gray-700 mb-2">
              Date & Time *
            </label>
            <input
              id="timestamp"
              type="datetime-local"
              required
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <div className="flex space-x-3 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                <span>{transaction ? 'Update Sale' : 'Record Sale'}</span>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;