import { ethers } from 'ethers';
import { TokenizedAssetsABI } from '../constants/abis';

// Contract address - you'll need to update this with your deployed contract address
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

// Asset types enum
export const AssetType = {
  RealEstate: 0,
  Bond: 1
};

// Cache for provider and signer
let cachedProvider = null;
let cachedSigner = null;

// Initialize contract
export const getContract = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      // Use cached provider if available
      if (!cachedProvider) {
        cachedProvider = new ethers.providers.Web3Provider(window.ethereum);
      }
      
      // Use cached signer if available
      if (!cachedSigner) {
        cachedSigner = cachedProvider.getSigner();
        
        // Check if signer has an address without requesting accounts again
        try {
          await cachedSigner.getAddress();
        } catch (error) {
          // If no address available, request accounts
          await cachedProvider.send("eth_requestAccounts", []);
          cachedSigner = cachedProvider.getSigner();
        }
      }
      
      return new ethers.Contract(CONTRACT_ADDRESS, TokenizedAssetsABI, cachedSigner);
    } catch (error) {
      console.error('Error initializing contract:', error);
      throw new Error('Failed to connect wallet: ' + error.message);
    }
  }
  throw new Error('No Ethereum provider found');
};

// Get provider
export const getProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      if (!cachedProvider) {
        cachedProvider = new ethers.providers.Web3Provider(window.ethereum);
      }
      return cachedProvider;
    } catch (error) {
      console.error('Error getting provider:', error);
      return null;
    }
  }
  return null;
};

// Clear cache when wallet changes
export const clearWalletCache = () => {
  cachedProvider = null;
  cachedSigner = null;
};

// Contract functions
export const contractFunctions = {
  // Get total number of assets
  getAssetCount: async () => {
    try {
      const contract = await getContract();
      if (!contract) throw new Error('Contract not initialized');
      const count = await contract.getAssetCount();
      return parseInt(count.toString());
    } catch (error) {
      console.error('Error getting asset count:', error);
      throw error;
    }
  },

  // Get asset by ID
  getAsset: async (assetId) => {
    try {
      const contract = await getContract();
      if (!contract) throw new Error('Contract not initialized');
      const asset = await contract.getAsset(assetId);
      return {
        id: parseInt(asset.id.toString()),
        assetType: parseInt(asset.assetType.toString()),
        assetTitle: asset.assetTitle,
        assetDescription: asset.assetDescription,
        valuation: ethers.utils.formatEther(asset.valuation),
        deadline: parseInt(asset.deadline.toString()),
        amountCollected: ethers.utils.formatEther(asset.amountCollected),
        image: asset.image,
        totalShares: parseInt(asset.totalShares.toString()),
        sharesSold: parseInt(asset.sharesSold.toString()),
        sharePrice: ethers.utils.formatEther(asset.sharePrice),
        paymentToken: asset.paymentToken,
        active: asset.active
      };
    } catch (error) {
      console.error('Error getting asset:', error);
      throw error;
    }
  },

  // Get all assets
  getAllAssets: async () => {
    try {
      const count = await contractFunctions.getAssetCount();
      const assets = [];
      
      for (let i = 0; i < count; i++) {
        const asset = await contractFunctions.getAsset(i);
        assets.push(asset);
      }
      
      return assets;
    } catch (error) {
      console.error('Error getting all assets:', error);
      throw error;
    }
  },

  // Get assets by type
  getAssetsByType: async (assetType) => {
    try {
      const allAssets = await contractFunctions.getAllAssets();
      return allAssets.filter(asset => asset.assetType === assetType);
    } catch (error) {
      console.error('Error getting assets by type:', error);
      throw error;
    }
  },

  // Buy shares
  buyShares: async (assetId, shares) => {
    try {
      const contract = await getContract();
      if (!contract) throw new Error('Contract not initialized');
      
      const asset = await contractFunctions.getAsset(assetId);
      const totalPrice = parseFloat(asset.sharePrice) * shares;
      const totalPriceWei = ethers.utils.parseEther(totalPrice.toString());
      
      const tx = await contract.buyShares(assetId, shares, { value: totalPriceWei });
      await tx.wait();
      
      return tx;
    } catch (error) {
      console.error('Error buying shares:', error);
      throw error;
    }
  },

  // Get buyer shares
  getBuyerShares: async (assetId, buyerAddress) => {
    try {
      const contract = await getContract();
      if (!contract) throw new Error('Contract not initialized');
      const shares = await contract.getBuyerShares(assetId, buyerAddress);
      return parseInt(shares.toString());
    } catch (error) {
      console.error('Error getting buyer shares:', error);
      throw error;
    }
  },

  // Get contributors for an asset
  getContributors: async (assetId) => {
    try {
      const contract = await getContract();
      if (!contract) throw new Error('Contract not initialized');
      const contributors = await contract.getContributors(assetId);
      return contributors;
    } catch (error) {
      console.error('Error getting contributors:', error);
      throw error;
    }
  },

  // Admin functions
  addAsset: async (assetType, title, description, valuation, deadline, image, totalShares, sharePrice, paymentToken) => {
    try {
      const contract = await getContract();
      if (!contract) throw new Error('Contract not initialized');
      
      const valuationWei = ethers.utils.parseEther(valuation.toString());
      const sharePriceWei = ethers.utils.parseEther(sharePrice.toString());
      
      const tx = await contract.addAsset(
        assetType,
        title,
        description,
        valuationWei,
        deadline,
        image,
        totalShares,
        sharePriceWei,
        paymentToken
      );
      await tx.wait();
      
      return tx;
    } catch (error) {
      console.error('Error adding asset:', error);
      throw error;
    }
  },

  setAssetActive: async (assetId, active) => {
    try {
      const contract = await getContract();
      if (!contract) throw new Error('Contract not initialized');
      
      const tx = await contract.setAssetActive(assetId, active);
      await tx.wait();
      
      return tx;
    } catch (error) {
      console.error('Error setting asset active:', error);
      throw error;
    }
  },

  withdrawFunds: async (assetId, toAddress) => {
    try {
      const contract = await getContract();
      if (!contract) throw new Error('Contract not initialized');
      
      const tx = await contract.withdrawFunds(assetId, toAddress);
      await tx.wait();
      
      return tx;
    } catch (error) {
      console.error('Error withdrawing funds:', error);
      throw error;
    }
  },

  // Check if user is owner
  isOwner: async (address) => {
    try {
      const contract = await getContract();
      if (!contract) throw new Error('Contract not initialized');
      const owner = await contract.owner();
      return owner.toLowerCase() === address.toLowerCase();
    } catch (error) {
      console.error('Error checking owner:', error);
      throw error;
    }
  }
};

// Helper function to format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Helper function to calculate percentage
export const calculatePercentage = (collected, target) => {
  if (target === 0) return 0;
  return Math.round((collected / target) * 100);
};

// Helper function to check if deadline has passed
export const isDeadlinePassed = (deadline) => {
  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime > deadline;
};
