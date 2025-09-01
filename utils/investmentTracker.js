import { supabase } from './supabase'

export const investmentTracker = {
  // Record a new investment purchase
  async recordInvestment(investmentData) {
    try {
      const { data, error } = await supabase
        .from('user_investments')
        .insert([{
          user_id: investmentData.userId,
          wallet_address: investmentData.walletAddress,
          asset_id: investmentData.assetId,
          asset_type: investmentData.assetType,
          asset_title: investmentData.assetTitle,
          shares_purchased: investmentData.sharesPurchased,
          share_price: investmentData.sharePrice,
          total_amount: investmentData.totalAmount,
          payment_token: investmentData.paymentToken,
          transaction_hash: investmentData.transactionHash
        }])
        .select()

      if (error) {
        console.error('Error recording investment:', error)
        throw error
      }

      return data[0]
    } catch (error) {
      console.error('Failed to record investment:', error)
      throw error
    }
  },

  // Get user's investment history
  async getUserInvestments(userId) {
    try {
      const { data, error } = await supabase
        .from('user_investments')
        .select('*')
        .eq('user_id', userId)
        .order('purchased_at', { ascending: false })

      if (error) {
        console.error('Error fetching user investments:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Failed to fetch user investments:', error)
      throw error
    }
  },

  // Get investments by wallet address
  async getInvestmentsByWallet(walletAddress) {
    try {
      const { data, error } = await supabase
        .from('user_investments')
        .select('*')
        .eq('wallet_address', walletAddress)
        .order('purchased_at', { ascending: false })

      if (error) {
        console.error('Error fetching wallet investments:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Failed to fetch wallet investments:', error)
      throw error
    }
  },

  // Update user profile with wallet address
  async updateUserWallet(userId, walletAddress) {
    try {
      // First, get the current profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('wallet_addresses')
        .eq('id', userId)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError)
        throw profileError
      }

      let walletAddresses = profile?.wallet_addresses || []
      
      // Add wallet address if not already present
      if (!walletAddresses.includes(walletAddress)) {
        walletAddresses.push(walletAddress)
      }

      // Update the profile
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          wallet_addresses: walletAddresses
        }, {
          onConflict: 'id'
        })

      if (error) {
        console.error('Error updating user wallet:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Failed to update user wallet:', error)
      throw error
    }
  }
}
