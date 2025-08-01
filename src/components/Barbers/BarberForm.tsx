import React, { useState } from 'react';
import { X } from 'lucide-react';
import { addBarber, updateBarber } from '../../lib/storage';
import { Barber } from '../../types';

interface BarberFormProps {
  barber?: Barber | null;
  onClose: () => void;
}

const BarberForm: React.FC<BarberFormProps> = ({ barber, onClose }) => {
  const [name, setName] = useState(barber?.name || '');
  const [dateJoined, setDateJoined] = useState(
    barber?.dateJoined || new Date().toISOString().split('T')[0]
  );
  const [commissionRate, setCommissionRate] = useState(barber?.commissionRate || 50);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (barber) {
        // Update existing barber
        updateBarber(barber.id, {
          name,
          dateJoined,
          commissionRate
        });
      } else {
        // Create new barber
        addBarber({
          name,
          dateJoined,
          commissionRate
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving barber:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {barber ? 'Edit Barber' : 'Add New Barber'}
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter barber's full name"
            />
          </div>

          <div>
            <label htmlFor="dateJoined" className="block text-sm font-medium text-gray-700 mb-2">
              Date Joined *
            </label>
            <input
              id="dateJoined"
              type="date"
              required
              value={dateJoined}
              onChange={(e) => setDateJoined(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label htmlFor="commissionRate" className="block text-sm font-medium text-gray-700 mb-2">
              Commission Rate (%) *
            </label>
            <input
              id="commissionRate"
              type="number"
              min="0"
              max="100"
              step="0.01"
              required
              value={commissionRate}
              onChange={(e) => setCommissionRate(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="50.00"
            />
          </div>

          <div className="flex space-x-3 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
            >
              {loading ? 'Saving...' : (barber ? 'Update' : 'Add')} Barber
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

export default BarberForm;