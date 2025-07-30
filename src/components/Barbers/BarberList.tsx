import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, User, Calendar, DollarSign } from 'lucide-react';
import { getBarbers, deleteBarber } from '../../lib/storage';
import { Barber } from '../../types';
import BarberForm from './BarberForm';

const BarberList: React.FC = () => {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);

  useEffect(() => {
    fetchBarbers();
  }, []);

  const fetchBarbers = () => {
    setBarbers(getBarbers());
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this barber? This action cannot be undone.')) {
      deleteBarber(id);
      fetchBarbers();
    }
  };

  const handleEdit = (barber: Barber) => {
    setEditingBarber(barber);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingBarber(null);
    fetchBarbers();
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Barbers</h1>
          <p className="text-gray-600 mt-1">Manage your barbershop staff</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
        >
          <Plus className="h-5 w-5" />
          <span>Add Barber</span>
        </button>
      </div>

      {barbers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
          <User className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No barbers found</h3>
          <p className="text-gray-600 mb-6">Get started by adding your first barber to the system</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add First Barber
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {barbers.map((barber) => (
            <div key={barber.id} className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{barber.name}</h3>
                    <div className="flex items-center space-x-1 text-gray-500 text-xs sm:text-sm">
                      <Calendar className="h-4 w-4" />
                      <span className="truncate">Since {new Date(barber.dateJoined).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(barber)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(barber.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Commission Rate:</span>
                    <span className="font-semibold text-blue-600">{barber.commissionRate}%</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Total Sales:</span>
                    <span className="font-semibold text-green-600">{barber.totalSales.toFixed(0)} CFA</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Monthly Commission:</span>
                    <span className="font-semibold text-purple-600">
                      {((barber.monthlySales * barber.commissionRate) / 100).toFixed(0)} CFA
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <BarberForm
          barber={editingBarber}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default BarberList;