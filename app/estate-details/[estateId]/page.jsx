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

const EstateDetails = () => {
  const params = useParams();
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const { user } = useAuth();
  const [estate, setEstate] = useState(null);
  const [userShares, setUserShares] = useState(0);
  const [sharesToBuy, setSharesToBuy] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isBuying, setIsBuying] = useState(false);

  const estateId = parseInt(params.estateId);

  const fetchEstateDetails = async () => {
    try {
      setIsLoading(true);
      const estateData = await contractFunctions.getAsset(estateId);
      
      if (estateData.assetType !== 0) { // Not a real estate
        router.push('/estates');
        return;
      }
      
      setEstate(estateData);
      
      if (address) {
        const shares = await contractFunctions.getBuyerShares(estateId, address);
        setUserShares(shares);
      }
    } catch (error) {
      console.error('Error fetching estate details:', error);
      router.push('/estates');
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
      const tx = await contractFunctions.buyShares(estateId, parseInt(sharesToBuy));
      const receipt = await tx.wait();
      
      // Record the investment in Supabase
      await investmentTracker.recordInvestment({
        userId: user.id,
        walletAddress: address,
        assetId: estateId,
        assetType: 'RealEstate',
        assetTitle: estate.assetTitle,
        sharesPurchased: parseInt(sharesToBuy),
        sharePrice: parseFloat(estate.sharePrice),
        totalAmount: parseFloat(sharesToBuy) * parseFloat(estate.sharePrice),
        paymentToken: estate.paymentToken,
        transactionHash: receipt.transactionHash
      });

      // Update user profile with wallet address
      await investmentTracker.updateUserWallet(user.id, address);
      
      alert('Shares purchased successfully!');
      setSharesToBuy('');
      fetchEstateDetails(); // Refresh data
    } catch (error) {
      console.error('Error buying shares:', error);
      alert('Error buying shares: ' + error.message);
    } finally {
      setIsBuying(false);
    }
  };

  useEffect(() => {
    if (estateId !== undefined) {
      fetchEstateDetails();
    }
  }, [estateId, address]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading estate details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!estate) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Estate not found</p>
            <CustomButton
              btnType="button"
              title="Back to Estates"
              styles="bg-[#0a0a0a] hover:bg-black mt-4"
              handleClick={() => router.push('/estates')}
            />
          </div>
        </div>
      </div>
    );
  }

  const remainingDays = Math.max(0, Math.ceil((estate.deadline - Math.floor(Date.now() / 1000)) / (24 * 60 * 60)));
  const progressPercentage = calculatePercentage(parseFloat(estate.amountCollected), parseFloat(estate.valuation));
  const isExpired = isDeadlinePassed(estate.deadline);

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#0a0a0a] rounded-3xl shadow-xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Estate Details</h1>
            <ConnectButton />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Estate Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">{estate.assetTitle}</h2>
                <p className="text-gray-400">{estate.assetDescription}</p>
              </div>

              {/* Estate Image */}
              {estate.image && (
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src={estate.image} 
                    alt={estate.assetTitle}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              <div className="bg-[#322543bd] p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Property Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Property Value:</span>
                    <p className="text-white font-medium">{formatCurrency(estate.valuation)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Amount Collected:</span>
                    <p className="text-white font-medium">{formatCurrency(estate.amountCollected)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Share Price:</span>
                    <p className="text-white font-medium">{formatCurrency(estate.sharePrice)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Shares Available:</span>
                    <p className="text-white font-medium">{estate.totalShares - estate.sharesSold} / {estate.totalShares}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Days Remaining:</span>
                    <p className={`font-medium ${remainingDays === 0 ? 'text-red-400' : 'text-white'}`}>
                      {remainingDays === 0 ? 'Expired' : `${remainingDays} days`}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <p className={`font-medium ${estate.active ? 'text-green-400' : 'text-red-400'}`}>
                      {estate.active ? 'Active' : 'Inactive'}
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
                  <p className="text-green-300">You own {userShares} shares in this property</p>
                  <p className="text-green-300">Total Value: {formatCurrency(userShares * parseFloat(estate.sharePrice))}</p>
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
                ) : !estate.active ? (
                  <div className="text-center py-8">
                    <p className="text-red-400">This property is currently inactive</p>
                  </div>
                ) : isExpired ? (
                  <div className="text-center py-8">
                    <p className="text-red-400">This property has expired</p>
                  </div>
                ) : estate.sharesSold >= estate.totalShares ? (
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
                      max={estate.totalShares - estate.sharesSold}
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
                            <span className="text-white">{formatCurrency(estate.sharePrice)}</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span className="text-gray-300">Total Cost:</span>
                            <span className="text-white">
                              {formatCurrency(parseFloat(sharesToBuy) * parseFloat(estate.sharePrice))}
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
                title="Back to Estates"
                styles="w-full bg-black hover:bg-[#0a0a0a]"
                handleClick={() => router.push('/estates')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstateDetails;