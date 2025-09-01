"use client"

import Topbar from "@components/topbar"
import DisplayEvents from "@components/DisplayEvents";
import { useEffect, useState } from "react";
import { contractFunctions, AssetType } from "../../utils/contract";
import { useAccount } from 'wagmi';

const Estates = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [investments, setInvestments] = useState([]);
  const { isConnected } = useAccount();

  const fetchEstates = async () => {
    try {
      setIsLoading(true);
      const estates = await contractFunctions.getAssetsByType(AssetType.RealEstate);
      
      const formattedEstates = estates.map((estate, index) => ({
        id: estate.id,
        owner: estate.paymentToken, // This will be the contract owner
        title: estate.assetTitle,
        description: estate.assetDescription,
        target: estate.valuation,
        deadline: estate.deadline,
        image: estate.image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3",
        image2: estate.image || "https://images.unsplash.com/photo-1486406146923-c433d7bca75f?ixlib=rb-4.0.3",
        image3: estate.image || "https://images.unsplash.com/photo-1512917774080-9991f1c4c129?ixlib=rb-4.0.3",
        amountCollected: estate.amountCollected,
        type: "estate",
        location: "New York, NY", // This would need to be stored in the contract or metadata
        propertyType: "Residential",
        expectedROI: "12%",
        totalShares: estate.totalShares,
        sharesSold: estate.sharesSold,
        sharePrice: estate.sharePrice,
        active: estate.active
      }));

      setInvestments(formattedEstates);
    } catch (error) {
      console.error('Error fetching estates:', error);
      // Fallback to static data if contract is not available
      setInvestments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchEstates();
    } else {
      setIsLoading(false);
      setInvestments([]);
    }
  }, [isConnected]);

  return (
    <div className="bg-[#000000] text-center min-h-screen">
      <Topbar />
      <DisplayEvents 
        title="All Real Estate Assets"
        isLoading={isLoading}
        investments={investments}
      />
    </div>
  )
} 

export default Estates