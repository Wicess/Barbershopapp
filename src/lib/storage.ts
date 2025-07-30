import { Barber, Transaction } from '../types';

const STORAGE_KEYS = {
  BARBERS: 'barbershop_barbers',
  TRANSACTIONS: 'barbershop_transactions',
  IS_LOGGED_IN: 'barbershop_logged_in'
};

// Barber operations
export const getBarbers = (): Barber[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.BARBERS);
  return stored ? JSON.parse(stored) : [];
};

export const saveBarbers = (barbers: Barber[]): void => {
  localStorage.setItem(STORAGE_KEYS.BARBERS, JSON.stringify(barbers));
};

export const addBarber = (barber: Omit<Barber, 'id' | 'totalSales' | 'monthlySales'>): Barber => {
  const barbers = getBarbers();
  const newBarber: Barber = {
    ...barber,
    id: Date.now().toString(),
    totalSales: 0,
    monthlySales: 0
  };
  barbers.push(newBarber);
  saveBarbers(barbers);
  return newBarber;
};

export const updateBarber = (id: string, updates: Partial<Barber>): void => {
  const barbers = getBarbers();
  const index = barbers.findIndex(b => b.id === id);
  if (index !== -1) {
    barbers[index] = { ...barbers[index], ...updates };
    saveBarbers(barbers);
  }
};

export const deleteBarber = (id: string): void => {
  const barbers = getBarbers().filter(b => b.id !== id);
  saveBarbers(barbers);
};

// Transaction operations
export const getTransactions = (): Transaction[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  return stored ? JSON.parse(stored) : [];
};

export const saveTransactions = (transactions: Transaction[]): void => {
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  updateBarberSales();
};

export const addTransaction = (transaction: Omit<Transaction, 'id'>): Transaction => {
  const transactions = getTransactions();
  const newTransaction: Transaction = {
    ...transaction,
    id: Date.now().toString()
  };
  transactions.push(newTransaction);
  saveTransactions(transactions);
  return newTransaction;
};

export const updateTransaction = (id: string, updates: Partial<Transaction>): void => {
  const transactions = getTransactions();
  const index = transactions.findIndex(t => t.id === id);
  if (index !== -1) {
    transactions[index] = { ...transactions[index], ...updates };
    saveTransactions(transactions);
  }
};

export const deleteTransaction = (id: string): void => {
  const transactions = getTransactions().filter(t => t.id !== id);
  saveTransactions(transactions);
};

// Update barber sales based on transactions
const updateBarberSales = (): void => {
  const barbers = getBarbers();
  const transactions = getTransactions();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  barbers.forEach(barber => {
    const barberTransactions = transactions.filter(t => t.barberId === barber.id);
    
    // Calculate total sales
    barber.totalSales = barberTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    // Calculate monthly sales
    barber.monthlySales = barberTransactions
      .filter(t => {
        const transactionDate = new Date(t.timestamp);
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  });

  saveBarbers(barbers);
};

// Authentication
export const login = (username: string, password: string): boolean => {
  // Simple demo login - in real app this would be secure
  if (username === 'admin' && password === 'admin123') {
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
    return true;
  }
  return false;
};

export const logout = (): void => {
  localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
};

export const isLoggedIn = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true';
};

// Initialize with empty data
export const initializeDemoData = (): void => {
  // Initialize with empty arrays - no demo data
  if (!localStorage.getItem(STORAGE_KEYS.BARBERS)) {
    saveBarbers([]);
  }
  if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
    saveTransactions([]);
  }
};