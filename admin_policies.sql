-- Add admin policies to existing tables
-- Run this script after the main supabase_setup.sql has been executed

-- Admin policy to view all investments (for admin access)
CREATE POLICY "Admin can view all investments" ON public.user_investments
  FOR SELECT USING (true);

-- Admin policy to view all user profiles (for admin access)
CREATE POLICY "Admin can view all profiles" ON public.user_profiles
  FOR SELECT USING (true);
