-- Create user investments table to track user purchases
CREATE TABLE public.user_investments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  wallet_address TEXT NOT NULL,
  asset_id INTEGER NOT NULL,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('RealEstate', 'Bond')),
  asset_title TEXT NOT NULL,
  shares_purchased INTEGER NOT NULL,
  share_price DECIMAL(20, 8) NOT NULL,
  total_amount DECIMAL(20, 8) NOT NULL,
  payment_token TEXT,
  transaction_hash TEXT,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_user_investments_user_id ON public.user_investments(user_id);
CREATE INDEX idx_user_investments_wallet_address ON public.user_investments(wallet_address);
CREATE INDEX idx_user_investments_asset_id ON public.user_investments(asset_id);

-- Enable Row Level Security
ALTER TABLE public.user_investments ENABLE ROW LEVEL SECURITY;

-- Create policies for user_investments
CREATE POLICY "Users can view their own investments" ON public.user_investments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own investments" ON public.user_investments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own investments" ON public.user_investments
  FOR UPDATE USING (auth.uid() = user_id);

-- Admin policy to view all investments (you can customize this based on your admin logic)
CREATE POLICY "Admin can view all investments" ON public.user_investments
  FOR SELECT USING (true);

-- Create user profiles table (optional enhancement)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  wallet_addresses TEXT[], -- Array of wallet addresses
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admin policy to view all user profiles (you can customize this based on your admin logic)
CREATE POLICY "Admin can view all profiles" ON public.user_profiles
  FOR SELECT USING (true);

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, username, full_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'username')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_user_investments_updated_at
  BEFORE UPDATE ON public.user_investments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
