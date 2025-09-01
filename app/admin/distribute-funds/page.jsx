'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { contractFunctions } from '../../../utils/contract';
import FormField from '../../../components/FormField';
import CustomButton from '../../../components/CustomButton';

const DistributeFunds = () => {
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [assetDetails, setAssetDetails] = useState(null);

  const fetchAssets = async () => {
    try {
      const allAssets = await contractFunctions.getAllAssets();
      setAssets(allAssets);
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  const fetchAssetDetails = async (assetId) => {
    try {
      const asset = await contractFunctions.getAsset(assetId);
      setAssetDetails(asset);
    } catch (error) {
      console.error('Error fetching asset details:', error);
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchAssets();
    }
  }, [isConnected]);

  useEffect(() => {
    if (selectedAsset !== '') {
      fetchAssetDetails(selectedAsset);
    }
  }, [selectedAsset]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!selectedAsset || !withdrawAddress) {
      alert('Please select an asset and enter withdrawal address');
      return;
    }

    try {
      setIsLoading(true);
      
      // Check if user is owner
      const isOwner = await contractFunctions.isOwner(address);
      if (!isOwner) {
        alert('Only contract owner can withdraw funds');
        return;
      }

      // Withdraw funds
      const tx = await contractFunctions.withdrawFunds(selectedAsset, withdrawAddress);
      await tx.wait();

      alert('Funds withdrawn successfully!');
      setSelectedAsset('');
      setWithdrawAddress('');
      setAssetDetails(null);
      fetchAssets(); // Refresh assets list
    } catch (error) {
      console.error('Error withdrawing funds:', error);
      alert('Error withdrawing funds: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-3xl shadow-xl p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-white">Distribute Funds</h1>
          <ConnectButton />
        </div>

        {isConnected ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Asset *
              </label>
              <select
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose an asset...</option>
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.assetTitle} - {asset.assetType === 0 ? 'Real Estate' : 'Bond'} (${asset.amountCollected})
                  </option>
                ))}
              </select>
            </div>

            {assetDetails && (
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Asset Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Title:</span>
                    <p className="text-white">{assetDetails.assetTitle}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Type:</span>
                    <p className="text-white">{assetDetails.assetType === 0 ? 'Real Estate' : 'Bond'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Valuation:</span>
                    <p className="text-white">${assetDetails.valuation}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Amount Collected:</span>
                    <p className="text-white">${assetDetails.amountCollected}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Shares Sold:</span>
                    <p className="text-white">{assetDetails.sharesSold} / {assetDetails.totalShares}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <p className={`text-white ${assetDetails.active ? 'text-green-400' : 'text-red-400'}`}>
                      {assetDetails.active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <FormField
              labelName="Withdrawal Address *"
              placeholder="Enter address to receive funds"
              inputType="text"
              value={withdrawAddress}
              handleChange={(e) => setWithdrawAddress(e.target.value)}
            />

            <div className="flex gap-4">
              <CustomButton
                btnType="submit"
                title={isLoading ? 'Withdrawing...' : 'Withdraw Funds'}
                styles="bg-purple-600 hover:bg-purple-700"
                disabled={isLoading || !selectedAsset || !withdrawAddress}
                handleClick={handleSubmit}
              />
              <CustomButton
                btnType="button"
                title="Cancel"
                styles="bg-gray-600 hover:bg-gray-700"
                handleClick={() => router.push('/admin')}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-400 text-lg">Please connect your wallet to distribute funds</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DistributeFunds; 