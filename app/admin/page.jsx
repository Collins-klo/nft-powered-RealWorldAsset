'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { contractFunctions } from '../../utils/contract';

const AdminDashboard = () => {
  const [balance, setBalance] = useState('0.00');
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { isConnected, address } = useAccount();

  const fetchAssets = async () => {
    try {
      setIsLoading(true);
      const allAssets = await contractFunctions.getAllAssets();
      setAssets(allAssets);
      
      // Calculate total balance from all assets
      const totalBalance = allAssets.reduce((sum, asset) => {
        return sum + parseFloat(asset.amountCollected);
      }, 0);
      setBalance(totalBalance.toFixed(2));
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAssetStatus = async (assetId, currentStatus) => {
    try {
      await contractFunctions.setAssetActive(assetId, !currentStatus);
      fetchAssets(); // Refresh the list
    } catch (error) {
      console.error('Error toggling asset status:', error);
      alert('Error updating asset status: ' + error.message);
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchAssets();
    } else {
      setIsLoading(false);
    }
  }, [isConnected]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800 rounded-3xl shadow-xl p-6 border border-gray-700 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            <ConnectButton />
          </div>

          {isConnected ? (
            <>
              <div className="mb-8">
                <h2 className="text-gray-400 text-sm mb-2">Platform Balance</h2>
                <div className="flex items-baseline">
                  <span className="text-3xl font-semibold text-gray-200">$</span>
                  <span className="text-4xl font-bold text-white">{balance}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Link 
                  href="/admin/create-estate"
                  className="flex flex-col items-center p-4 bg-gray-700 rounded-xl border border-gray-600 hover:bg-gray-600 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-200">Create Estate</span>
                </Link>

                <Link 
                  href="/admin/create-bond"
                  className="flex flex-col items-center p-4 bg-gray-700 rounded-xl border border-gray-600 hover:bg-gray-600 transition-colors"
                >
                  <div className="w-10 h-10 bg-green-900 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-200">Create Bond</span>
                </Link>

                <Link 
                  href="/admin/distribute-funds"
                  className="flex flex-col items-center p-4 bg-gray-700 rounded-xl border border-gray-600 hover:bg-gray-600 transition-colors"
                >
                  <div className="w-10 h-10 bg-purple-900 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-200">Distribute Funds</span>
                </Link>

                <Link 
                  href="/admin/users"
                  className="flex flex-col items-center p-4 bg-gray-700 rounded-xl border border-gray-600 hover:bg-gray-600 transition-colors"
                >
                  <div className="w-10 h-10 bg-orange-900 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-200">Users</span>
                </Link>
              </div>

              {/* Assets Management Section */}
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-white mb-4">Asset Management</h2>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-400 mt-2">Loading assets...</p>
                  </div>
                ) : assets.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No assets found. Create your first asset above.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                      <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                        <tr>
                          <th className="px-6 py-3">ID</th>
                          <th className="px-6 py-3">Title</th>
                          <th className="px-6 py-3">Type</th>
                          <th className="px-6 py-3">Valuation</th>
                          <th className="px-6 py-3">Collected</th>
                          <th className="px-6 py-3">Shares</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assets.map((asset) => (
                          <tr key={asset.id} className="bg-gray-700 border-b border-gray-600 hover:bg-gray-600">
                            <td className="px-6 py-4">{asset.id}</td>
                            <td className="px-6 py-4 font-medium text-white">{asset.assetTitle}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                asset.assetType === 0 
                                  ? 'bg-blue-900 text-blue-300' 
                                  : 'bg-green-900 text-green-300'
                              }`}>
                                {asset.assetType === 0 ? 'Real Estate' : 'Bond'}
                              </span>
                            </td>
                            <td className="px-6 py-4">${asset.valuation}</td>
                            <td className="px-6 py-4">${asset.amountCollected}</td>
                            <td className="px-6 py-4">{asset.sharesSold}/{asset.totalShares}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                asset.active 
                                  ? 'bg-green-900 text-green-300' 
                                  : 'bg-red-900 text-red-300'
                              }`}>
                                {asset.active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => toggleAssetStatus(asset.id, asset.active)}
                                className={`px-3 py-1 rounded text-xs ${
                                  asset.active 
                                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                                }`}
                              >
                                {asset.active ? 'Deactivate' : 'Activate'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
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

export default AdminDashboard;
