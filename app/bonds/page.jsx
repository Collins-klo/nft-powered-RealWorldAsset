"use client"

import Topbar from "@components/topbar"
import BondEvents from "@components/BondEvents";
import { useEffect, useState } from "react";
import { contractFunctions, AssetType } from "../../utils/contract";
import { useAccount } from 'wagmi';

const Bonds = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [investments, setInvestments] = useState([]);
  const { isConnected } = useAccount();

  const fetchBonds = async () => {
    try {
      setIsLoading(true);
      const bonds = await contractFunctions.getAssetsByType(AssetType.Bond);
      
      const formattedBonds = bonds.map((bond, index) => ({
        id: bond.id,
        owner: bond.paymentToken, // This will be the contract owner
        title: bond.assetTitle,
        description: bond.assetDescription,
        target: bond.valuation,
        deadline: bond.deadline,
        image: bond.image || "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3",
        image2: bond.image || "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3",
        image3: bond.image || "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3",
        amountCollected: bond.amountCollected,
        type: "bonds",
        bondType: "Government Treasury", // This would need to be stored in the contract or metadata
        maturityPeriod: "10 years",
        interestRate: "4.5%",
        riskLevel: "Low",
        totalShares: bond.totalShares,
        sharesSold: bond.sharesSold,
        sharePrice: bond.sharePrice,
        active: bond.active
      }));

      setInvestments(formattedBonds);
    } catch (error) {
      console.error('Error fetching bonds:', error);
      // Fallback to static data if contract is not available
      setInvestments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchBonds();
    } else {
      setIsLoading(false);
      setInvestments([]);
    }
  }, [isConnected]);

  return (
    <div className="bg-[#000000] text-center min-h-screen">
      <Topbar />
      <BondEvents 
        title="All Bonds"
        isLoading={isLoading}
        investments={investments}
      />
    </div>
  )
} 

export default Bonds