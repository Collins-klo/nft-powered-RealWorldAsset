'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { supabase } from '../../../utils/supabase';
import { investmentTracker } from '../../../utils/investmentTracker';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [userInvestments, setUserInvestments] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const router = useRouter();
  const { isConnected } = useAccount();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all users from Supabase
      const { data: usersData, error: usersError } = await supabase
        .from('user_profiles')
        .select(`
          id,
          username,
          full_name,
          wallet_addresses,
          created_at,
          auth_users:auth.users!inner(
            id,
            email,
            created_at,
            last_sign_in_at
          )
        `)
        .order('created_at', { ascending: false });

      if (usersError) {
        console.error('Error fetching users:', usersError);
        return;
      }

      // Fetch investments for each user
      const investmentsMap = {};
      for (const user of usersData) {
        try {
          const investments = await investmentTracker.getUserInvestments(user.id);
          investmentsMap[user.id] = investments;
        } catch (error) {
          console.error(`Error fetching investments for user ${user.id}:`, error);
          investmentsMap[user.id] = [];
        }
      }

      setUsers(usersData);
      setUserInvestments(investmentsMap);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotalInvestment = (investments) => {
    return investments.reduce((total, inv) => total + parseFloat(inv.total_amount), 0);
  };

  useEffect(() => {
    if (isConnected) {
      fetchUsers();
    } else {
      setIsLoading(false);
    }
  }, [isConnected]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800 rounded-3xl shadow-xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-white">User Management</h1>
            </div>
            <ConnectButton />
          </div>

          {isConnected ? (
            <>
              {isLoading ? (
                <div className="text-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-400 mt-4">Loading users...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-400 text-lg">No users found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                      <tr>
                        <th className="px-6 py-3">User</th>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3">Wallets</th>
                        <th className="px-6 py-3">Total Investments</th>
                        <th className="px-6 py-3">Investment Count</th>
                        <th className="px-6 py-3">Joined</th>
                        <th className="px-6 py-3">Last Sign In</th>
                        <th className="px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => {
                        const investments = userInvestments[user.id] || [];
                        const totalInvestment = calculateTotalInvestment(investments);
                        
                        return (
                          <tr key={user.id} className="bg-gray-700 border-b border-gray-600 hover:bg-gray-600">
                            <td className="px-6 py-4">
                              <div>
                                <div className="font-medium text-white">
                                  {user.full_name || user.username || 'N/A'}
                                </div>
                                {user.username && (
                                  <div className="text-xs text-gray-400">@{user.username}</div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-white">{user.auth_users?.email || 'N/A'}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-1">
                                {user.wallet_addresses && user.wallet_addresses.length > 0 ? (
                                  user.wallet_addresses.map((wallet, index) => (
                                    <div key={index} className="text-xs font-mono bg-gray-600 px-2 py-1 rounded">
                                      {wallet.slice(0, 6)}...{wallet.slice(-4)}
                                    </div>
                                  ))
                                ) : (
                                  <span className="text-gray-500 text-xs">No wallets</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-medium text-white">
                                ${totalInvestment.toLocaleString()}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-white">{investments.length}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-gray-300">{formatDate(user.created_at)}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-gray-300">{formatDate(user.auth_users?.last_sign_in_at)}</span>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors"
                              >
                                {selectedUser === user.id ? 'Hide' : 'View'} Details
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Investment Details Modal */}
                  {selectedUser && (
                    <div className="mt-6 bg-gray-700 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Investment Details for {users.find(u => u.id === selectedUser)?.full_name || users.find(u => u.id === selectedUser)?.auth_users?.email}
                      </h3>
                      
                      {userInvestments[selectedUser] && userInvestments[selectedUser].length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left text-gray-300">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-600">
                              <tr>
                                <th className="px-4 py-2">Asset</th>
                                <th className="px-4 py-2">Type</th>
                                <th className="px-4 py-2">Shares</th>
                                <th className="px-4 py-2">Price/Share</th>
                                <th className="px-4 py-2">Total Amount</th>
                                <th className="px-4 py-2">Date</th>
                                <th className="px-4 py-2">Transaction</th>
                              </tr>
                            </thead>
                            <tbody>
                              {userInvestments[selectedUser].map((investment) => (
                                <tr key={investment.id} className="border-b border-gray-600 hover:bg-gray-600">
                                  <td className="px-4 py-2 font-medium text-white">
                                    {investment.asset_title}
                                  </td>
                                  <td className="px-4 py-2">
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      investment.asset_type === 'RealEstate' 
                                        ? 'bg-blue-900 text-blue-300' 
                                        : 'bg-green-900 text-green-300'
                                    }`}>
                                      {investment.asset_type}
                                    </span>
                                  </td>
                                  <td className="px-4 py-2">{investment.shares_purchased}</td>
                                  <td className="px-4 py-2">${parseFloat(investment.share_price).toLocaleString()}</td>
                                  <td className="px-4 py-2">${parseFloat(investment.total_amount).toLocaleString()}</td>
                                  <td className="px-4 py-2">
                                    {new Date(investment.purchased_at).toLocaleDateString()}
                                  </td>
                                  <td className="px-4 py-2">
                                    {investment.transaction_hash ? (
                                      <a 
                                        href={`https://sepolia.etherscan.io/tx/${investment.transaction_hash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300 underline text-xs"
                                      >
                                        View
                                      </a>
                                    ) : (
                                      <span className="text-gray-500 text-xs">-</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-gray-400">No investments found for this user.</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-400 text-lg">Please connect your wallet to access admin features</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
