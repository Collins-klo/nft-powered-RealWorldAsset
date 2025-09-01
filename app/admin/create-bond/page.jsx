'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { contractFunctions, AssetType, clearWalletCache } from '../../../utils/contract';
import FormField from '../../../components/FormField';
import CustomButton from '../../../components/CustomButton';

const CreateBond = () => {
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    valuation: '',
    deadline: '',
    image: '',
    totalShares: '',
    sharePrice: '',
    bondType: 'Government Treasury',
    maturityPeriod: '',
    interestRate: '',
    riskLevel: 'Low'
  });

  // Clear wallet cache when wallet changes
  useEffect(() => {
    clearWalletCache();
  }, [address]);

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setIsLoading(true);
      
      // Check if user is owner
      const isOwner = await contractFunctions.isOwner(address);
      if (!isOwner) {
        alert('Only contract owner can create assets');
        return;
      }

      // Convert deadline to timestamp (days from now)
      const deadlineTimestamp = Math.floor(Date.now() / 1000) + (parseInt(form.deadline) * 24 * 60 * 60);
      
      // Create asset
      const tx = await contractFunctions.addAsset(
        AssetType.Bond,
        form.title,
        form.description,
        form.valuation,
        deadlineTimestamp,
        form.image,
        parseInt(form.totalShares),
        form.sharePrice,
        '0x0000000000000000000000000000000000000000' // Native token (ETH)
      );

      alert('Bond asset created successfully!');
      router.push('/admin');
    } catch (error) {
      console.error('Error creating bond:', error);
      alert('Error creating bond: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-3xl shadow-xl p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-white">Create Bond Asset</h1>
          <ConnectButton />
        </div>

        {isConnected ? (
          <>
            <div className="bg-blue-900/20 border border-blue-700 p-4 rounded-lg mb-6">
              <h3 className="text-sm font-medium text-blue-300 mb-2">Important Note</h3>
              <p className="text-blue-200 text-sm">
                All monetary values should be entered in ETH, not USD. For example, if you want a share to cost $100, 
                you would need to convert that to ETH based on current exchange rates.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              labelName="Bond Title *"
              placeholder="Enter bond title"
              inputType="text"
              value={form.title}
              handleChange={(e) => handleFormFieldChange('title', e)}
            />

            <FormField
              labelName="Description *"
              placeholder="Enter bond description"
              isTextArea
              value={form.description}
              handleChange={(e) => handleFormFieldChange('description', e)}
            />

            <FormField
              labelName="Face Value (ETH) *"
              placeholder="Enter bond face value in ETH (e.g., 10)"
              inputType="number"
              value={form.valuation}
              handleChange={(e) => handleFormFieldChange('valuation', e)}
              step="0.1"
            />

            <FormField
              labelName="Maturity Period (days) *"
              placeholder="Enter maturity period in days"
              inputType="number"
              value={form.deadline}
              handleChange={(e) => handleFormFieldChange('deadline', e)}
            />

            <FormField
              labelName="Image URL"
              placeholder="Enter image URL"
              inputType="url"
              value={form.image}
              handleChange={(e) => handleFormFieldChange('image', e)}
            />

            <FormField
              labelName="Total Shares *"
              placeholder="Enter total number of shares"
              inputType="number"
              value={form.totalShares}
              handleChange={(e) => handleFormFieldChange('totalShares', e)}
            />

            <FormField
              labelName="Share Price (ETH) *"
              placeholder="Enter price per share in ETH (e.g., 0.01)"
              inputType="number"
              value={form.sharePrice}
              handleChange={(e) => handleFormFieldChange('sharePrice', e)}
              step="0.001"
            />

            <FormField
              labelName="Maturity Period (years)"
              placeholder="Enter maturity period in years"
              inputType="text"
              value={form.maturityPeriod}
              handleChange={(e) => handleFormFieldChange('maturityPeriod', e)}
            />

            <FormField
              labelName="Interest Rate (%)"
              placeholder="Enter interest rate"
              inputType="text"
              value={form.interestRate}
              handleChange={(e) => handleFormFieldChange('interestRate', e)}
            />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bond Type
              </label>
              <select
                value={form.bondType}
                onChange={(e) => handleFormFieldChange('bondType', e)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Government Treasury">Government Treasury</option>
                <option value="Corporate">Corporate</option>
                <option value="Municipal">Municipal</option>
                <option value="High-Yield Corporate">High-Yield Corporate</option>
                <option value="Investment Grade">Investment Grade</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Risk Level
              </label>
              <select
                value={form.riskLevel}
                onChange={(e) => handleFormFieldChange('riskLevel', e)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="flex gap-4">
              <CustomButton
                btnType="submit"
                title={isLoading ? 'Creating...' : 'Create Bond Asset'}
                styles="bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              />
              <CustomButton
                btnType="button"
                title="Cancel"
                styles="bg-gray-600 hover:bg-gray-700"
                handleClick={() => router.push('/admin')}
              />
            </div>
          </form>
          </>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-400 text-lg">Please connect your wallet to create bond assets</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateBond;