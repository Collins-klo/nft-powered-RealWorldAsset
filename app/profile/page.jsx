"use client"

import Topbar from "@components/topbar"
import Displayinvestments from "@components/DisplayEvents";
import { useEffect, useState } from "react";
import { contractFunctions } from "../../utils/contract";
import { useAccount } from 'wagmi';
import { supabase } from "../../utils/supabase";
import { useRouter } from 'next/navigation';
import { investmentTracker } from "../../utils/investmentTracker";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [investments, setInvestments] = useState([]);
  const [dbInvestments, setDbInvestments] = useState([]);
  const [user, setUser] = useState(null);
  const { isConnected, address } = useAccount();
  const router = useRouter();

  const fetchUserInvestments = async () => {
    try {
      setIsLoading(true);
      const allAssets = await contractFunctions.getAllAssets();
      const userInvestments = [];

      for (const asset of allAssets) {
        if (address) {
          const userShares = await contractFunctions.getBuyerShares(asset.id, address);
          if (userShares > 0) {
            userInvestments.push({
              id: asset.id,
              owner: asset.paymentToken,
              title: asset.assetTitle,
              description: asset.assetDescription,
              target: asset.valuation,
              deadline: asset.deadline,
              image: asset.image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3",
              amountCollected: asset.amountCollected,
              userShares: userShares,
              sharePrice: asset.sharePrice,
              totalShares: asset.totalShares,
              assetType: asset.assetType === 0 ? "Real Estate" : "Bond",
              type: asset.assetType === 0 ? "estate" : "bonds"
            });
          }
        }
      }

      setInvestments(userInvestments);
    } catch (error) {
      console.error('Error fetching user investments:', error);
      setInvestments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }
      setUser(user);
    };
    
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (isConnected && address) {
      fetchUserInvestments();
    } else {
      setIsLoading(false);
      setInvestments([]);
    }
  }, [isConnected, address]);

  // Fetch investments from database
  useEffect(() => {
    const fetchDbInvestments = async () => {
      if (user) {
        try {
          const investments = await investmentTracker.getUserInvestments(user.id);
          setDbInvestments(investments);
        } catch (error) {
          console.error('Error fetching DB investments:', error);
        }
      }
    };

    fetchDbInvestments();
  }, [user]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!user) {
    return (
      <div className="bg-[#000000] text-center min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#000000] text-center min-h-screen">
      <Topbar />
      
      {/* User Info and Logout Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-[#0a0a0a] rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#322543bd] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <div className="text-left">
                <h2 className="text-white text-xl font-semibold">
                  Welcome back, {user.user_metadata?.username || user.email}
                </h2>
                <p className="text-gray-400">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

             <Displayinvestments 
         title="My Investments"
         isLoading={isLoading}
         investments={investments}
       />

       {/* Database Investment History */}
       {dbInvestments.length > 0 && (
         <div className="max-w-7xl mx-auto px-4 py-8">
           <div className="bg-[#322543bd] rounded-lg p-6">
             <h3 className="text-white text-xl font-semibold mb-6">Investment History</h3>
             <div className="overflow-x-auto">
               <table className="w-full text-sm text-left text-gray-300">
                 <thead className="text-xs text-gray-400 uppercase bg-[#322543bd]">
                   <tr>
                     <th className="px-6 py-3">Asset</th>
                     <th className="px-6 py-3">Type</th>
                     <th className="px-6 py-3">Shares</th>
                     <th className="px-6 py-3">Price/Share</th>
                     <th className="px-6 py-3">Total Amount</th>
                     <th className="px-6 py-3">Date</th>
                     <th className="px-6 py-3">Transaction</th>
                   </tr>
                 </thead>
                 <tbody>
                   {dbInvestments.map((investment) => (
                     <tr key={investment.id} className="border-b border-gray-700 hover:bg-[#0a0a0a]">
                       <td className="px-6 py-4 font-medium text-white">
                         {investment.asset_title}
                       </td>
                       <td className="px-6 py-4">
                         <span className={`px-2 py-1 rounded-full text-xs ${
                           investment.asset_type === 'RealEstate' 
                             ? 'bg-blue-900 text-blue-300' 
                             : 'bg-green-900 text-green-300'
                         }`}>
                           {investment.asset_type}
                         </span>
                       </td>
                       <td className="px-6 py-4">{investment.shares_purchased}</td>
                       <td className="px-6 py-4">${parseFloat(investment.share_price).toLocaleString()}</td>
                       <td className="px-6 py-4">${parseFloat(investment.total_amount).toLocaleString()}</td>
                       <td className="px-6 py-4">
                         {new Date(investment.purchased_at).toLocaleDateString()}
                       </td>
                       <td className="px-6 py-4">
                         {investment.transaction_hash ? (
                           <a 
                             href={`https://sepolia.etherscan.io/tx/${investment.transaction_hash}`}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="text-blue-400 hover:text-blue-300 underline"
                           >
                             View
                           </a>
                         ) : (
                           <span className="text-gray-500">-</span>
                         )}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
         </div>
       )}
    </div>
  )
} 

export default Profile