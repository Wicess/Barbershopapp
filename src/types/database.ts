export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          role: 'admin' | 'manager' | 'barber';
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          role?: 'admin' | 'manager' | 'barber';
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string;
          role?: 'admin' | 'manager' | 'barber';
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      barbershops: {
        Row: {
          id: string;
          name: string;
          address: string | null;
          phone: string | null;
          owner_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address?: string | null;
          phone?: string | null;
          owner_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string | null;
          phone?: string | null;
          owner_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      barbers: {
        Row: {
          id: string;
          profile_id: string;
          barbershop_id: string;
          commission_rate: number;
          base_salary: number | null;
          is_active: boolean;
          hire_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          barbershop_id: string;
          commission_rate?: number;
          base_salary?: number | null;
          is_active?: boolean;
          hire_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          barbershop_id?: string;
          commission_rate?: number;
          base_salary?: number | null;
          is_active?: boolean;
          hire_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          barbershop_id: string;
          name: string;
          phone: string | null;
          email: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          barbershop_id: string;
          name: string;
          phone?: string | null;
          email?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          barbershop_id?: string;
          name?: string;
          phone?: string | null;
          email?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          barbershop_id: string;
          name: string;
          description: string | null;
          price: number;
          duration_minutes: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          barbershop_id: string;
          name: string;
          description?: string | null;
          price: number;
          duration_minutes?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          barbershop_id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          duration_minutes?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      sales: {
        Row: {
          id: string;
          barbershop_id: string;
          barber_id: string;
          client_id: string | null;
          total_amount: number;
          commission_amount: number;
          payment_method: 'cash' | 'card' | 'pix' | 'other';
          notes: string | null;
          sale_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          barbershop_id: string;
          barber_id: string;
          client_id?: string | null;
          total_amount: number;
          commission_amount?: number;
          payment_method: 'cash' | 'card' | 'pix' | 'other';
          notes?: string | null;
          sale_date?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          barbershop_id?: string;
          barber_id?: string;
          client_id?: string | null;
          total_amount?: number;
          commission_amount?: number;
          payment_method?: 'cash' | 'card' | 'pix' | 'other';
          notes?: string | null;
          sale_date?: string;
          created_at?: string;
        };
      };
      sale_items: {
        Row: {
          id: string;
          sale_id: string;
          service_id: string;
          quantity: number;
          unit_price: number;
          subtotal: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          sale_id: string;
          service_id: string;
          quantity?: number;
          unit_price: number;
          subtotal: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          sale_id?: string;
          service_id?: string;
          quantity?: number;
          unit_price?: number;
          subtotal?: number;
          created_at?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          barbershop_id: string;
          barber_id: string;
          client_id: string | null;
          service_id: string;
          scheduled_at: string;
          status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          barbershop_id: string;
          barber_id: string;
          client_id?: string | null;
          service_id: string;
          scheduled_at: string;
          status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          barbershop_id?: string;
          barber_id?: string;
          client_id?: string | null;
          service_id?: string;
          scheduled_at?: string;
          status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}