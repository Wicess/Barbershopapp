import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase') || supabaseKey.includes('your_supabase')) {
  console.error('⚠️  Supabase not configured. Please update your .env file with your actual Supabase credentials.');
  console.error('1. Go to https://supabase.com/dashboard');
  console.error('2. Create a new project or select an existing one');
  console.error('3. Go to Settings -> API');
  console.error('4. Copy your Project URL and anon/public key');
  console.error('5. Update the .env file with these values');
  throw new Error('Supabase configuration required. Please check the console for setup instructions.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Helper function to get current user profile
export const getCurrentUserProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return profile;
};

// Helper function to check if user is admin or manager
export const isAdminOrManager = async () => {
  const profile = await getCurrentUserProfile();
  return profile?.role === 'admin' || profile?.role === 'manager';
};

// Helper function to get user's barbershop
export const getUserBarbershop = async () => {
  const profile = await getCurrentUserProfile();
  if (!profile) return null;

  if (profile.role === 'admin' || profile.role === 'manager') {
    // Admin/Manager can access all barbershops, return the first one for now
    const { data: barbershops } = await supabase
      .from('barbershops')
      .select('*')
      .limit(1);
    
    return barbershops?.[0] || null;
  } else {
    // Barber can only access their assigned barbershop
    const { data: barber } = await supabase
      .from('barbers')
      .select(`
        *,
        barbershops(*)
      `)
      .eq('profile_id', profile.id)
      .single();

    return barber?.barbershops || null;
  }
};