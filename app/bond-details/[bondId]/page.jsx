'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { contractFunctions, formatCurrency, calculatePercentage, isDeadlinePassed } from '../../../utils/contract';
import FormField from '../../../components/FormField';
import CustomButton from '../../../components/CustomButton';
import { useAuth } from '../../../context/AuthContext';
import { investmentTracker } from '../../../utils/investmentTracker';

const BondDetails = () => {
  const params = useParams();
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const { user } = useAuth();
  const [bond, setBond] = useState(null);
  const [userShares, setUserShares] = useState(0);
  const [sharesToBuy, setSharesToBuy] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isBuying, setIsBuying] = useState(false);

  const bondId = parseInt(params.bondId);

  const fetchBondDetails = async () => {
    try {
      setIsLoading(true);
      const bondData = await contractFunctions.getAsset(bondId);
      
      if (bondData.assetType !== 1) { // Not a bond
        router.push('/bonds');
        return;
      }
      
      setBond(bondData);
      
      if (address) {
        const shares = await contractFunctions.getBuyerShares(bondId, address);
        setUserShares(shares);
      }
    } catch (error) {
      console.error('Error fetching bond details:', error);
      router.push('/bonds');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyShares = async (e) => {
    e.preventDefault();
    
    // Check authentication first
    if (!user) {
      alert('Please log in to buy shares');
      router.push('/auth');
      return;
    }
    
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!sharesToBuy || parseInt(sharesToBuy) <= 0) {
      alert('Please enter a valid number of shares');
      return;
    }

    try {
      setIsBuying(true);
      const tx = await contractFunctions.buyShares(bondId, parseInt(sharesToBuy));
      const receipt = await tx.wait();
      
      // Record the investment in Supabase
      await investmentTracker.recordInvestment({
        userId: user.id,
        walletAddress: address,
        assetId: bondId,
        assetType: 'Bond',
        assetTitle: bond.assetTitle,
        sharesPurchased: parseInt(sharesToBuy),
        sharePrice: parseFloat(bond.sharePrice),
        totalAmount: parseFloat(sharesToBuy) * parseFloat(bond.sharePrice),
        paymentToken: bond.paymentToken,
        transactionHash: receipt.transactionHash
      });

      // Update user profile with wallet address
      await investmentTracker.updateUserWallet(user.id, address);
      
      alert('Shares purchased successfully!');
      setSharesToBuy('');
      fetchBondDetails(); // Refresh data
    } catch (error) {
      console.error('Error buying shares:', error);
      alert('Error buying shares: ' + error.message);
    } finally {
      setIsBuying(false);
    }
  };

  useEffect(() => {
    if (bondId !== undefined) {
      fetchBondDetails();
    }
  }, [bondId, address]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading bond details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!bond) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Bond not found</p>
            <CustomButton
              btnType="button"
              title="Back to Bonds"
              styles="bg-[#0a0a0a] hover:bg-black mt-4"
              handleClick={() => router.push('/bonds')}
            />
          </div>
        </div>
      </div>
    );
  }

  const remainingDays = Math.max(0, Math.ceil((bond.deadline - Math.floor(Date.now() / 1000)) / (24 * 60 * 60)));
  const progressPercentage = calculatePercentage(parseFloat(bond.amountCollected), parseFloat(bond.valuation));
  const isExpired = isDeadlinePassed(bond.deadline);

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#0a0a0a] rounded-3xl shadow-xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Bond Details</h1>
            <ConnectButton />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bond Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">{bond.assetTitle}</h2>
                <p className="text-gray-400">{bond.assetDescription}</p>
              </div>

              <div className="bg-[#322543bd] p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Bond Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Face Value:</span>
                    <p className="text-white font-medium">{formatCurrency(bond.valuation)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Amount Collected:</span>
                    <p className="text-white font-medium">{formatCurrency(bond.amountCollected)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Share Price:</span>
                    <p className="text-white font-medium">{formatCurrency(bond.sharePrice)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Shares Available:</span>
                    <p className="text-white font-medium">{bond.totalShares - bond.sharesSold} / {bond.totalShares}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Days Remaining:</span>
                    <p className={`font-medium ${remainingDays === 0 ? 'text-red-400' : 'text-white'}`}>
                      {remainingDays === 0 ? 'Expired' : `${remainingDays} days`}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <p className={`font-medium ${bond.active ? 'text-green-400' : 'text-red-400'}`}>
                      {bond.active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* User Shares */}
              {isConnected && userShares > 0 && (
                <div className="bg-green-900/20 border border-green-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-400 mb-2">Your Investment</h3>
                  <p className="text-green-300">You own {userShares} shares in this bond</p>
                  <p className="text-green-300">Total Value: {formatCurrency(userShares * parseFloat(bond.sharePrice))}</p>
                </div>
              )}
            </div>

            {/* Buy Shares Form */}
            <div className="space-y-6">
              <div className="bg-[#322543bd] p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Buy Shares</h3>
                
                {!user ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">Please log in to buy shares</p>
                    <CustomButton
                      btnType="button"
                      title="Log In"
                      styles="bg-[#0a0a0a] hover:bg-black"
                      handleClick={() => router.push('/auth')}
                    />
                  </div>
                ) : !isConnected ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">Connect your wallet to buy shares</p>
                  </div>
                ) : !bond.active ? (
                  <div className="text-center py-8">
                    <p className="text-red-400">This bond is currently inactive</p>
                  </div>
                ) : isExpired ? (
                  <div className="text-center py-8">
                    <p className="text-red-400">This bond has expired</p>
                  </div>
                ) : bond.sharesSold >= bond.totalShares ? (
                  <div className="text-center py-8">
                    <p className="text-red-400">All shares have been sold</p>
                  </div>
                ) : (
                  <form onSubmit={handleBuyShares} className="space-y-4">
                    <FormField
                      labelName="Number of Shares"
                      placeholder="Enter number of shares to buy"
                      inputType="number"
                      value={sharesToBuy}
                      handleChange={(e) => setSharesToBuy(e.target.value)}
                      min="1"
                      max={bond.totalShares - bond.sharesSold}
                    />

                    {sharesToBuy && (
                      <div className="bg-[#322543bd] p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Purchase Summary</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Shares:</span>
                            <span className="text-white">{sharesToBuy}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Price per share:</span>
                            <span className="text-white">{formatCurrency(bond.sharePrice)}</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span className="text-gray-300">Total Cost:</span>
                            <span className="text-white">
                              {formatCurrency(parseFloat(sharesToBuy) * parseFloat(bond.sharePrice))}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <CustomButton
                      btnType="submit"
                      title={isBuying ? 'Processing...' : 'Buy Shares'}
                      styles="w-full bg-[#0a0a0a] hover:bg-black"
                      disabled={isBuying || !sharesToBuy || parseInt(sharesToBuy) <= 0}
                    />
                  </form>
                )}
              </div>

              <CustomButton
                btnType="button"
                title="Back to Bonds"
                styles="w-full bg-black hover:bg-[#0a0a0a]"
                handleClick={() => router.push('/bonds')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BondDetails;