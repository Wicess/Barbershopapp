export interface Barber {
  id: string;
  name: string;
  dateJoined: string;
  commissionRate: number;
  totalSales: number;
  monthlySales: number;
}

export interface Transaction {
  id: string;
  barberId: string;
  barberName: string;
  clientName: string;
  amount: number;
  timestamp: string;
}

export interface SalaryReport {
  barberId: string;
  barberName: string;
  totalSales: number;
  commissionEarned: number;
  month: string;
  year: number;
}

export interface DashboardStats {
  totalRevenue: number;
  monthlyRevenue: number;
  totalTransactions: number;
  totalBarbers: number;
  bestBarber: {
    name: string;
    sales: number;
  };
}