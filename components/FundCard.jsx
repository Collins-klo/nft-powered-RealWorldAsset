// import Image from "@node_modules/next/image";
import { tagType, logo } from "@public/assets/icons";
import { daysLeft, calculateBarPercentage } from "../utils";

const FundCard = ({ id, owner, title, description, target, deadline,
     amountCollected, image, handleClick, sharePrice, totalShares, sharesSold, active }) => {
        const remainingDays = daysLeft(deadline);
        const percentage = calculateBarPercentage(parseFloat(target), parseFloat(amountCollected));

        return (
          <div className="sm:w-[288px] w-full rounded-[15px] bg-[#322543] cursor-pointer" onClick={handleClick}>
            <img src={image} alt="fund" className="w-full h-[158px] object-cover rounded-[15px]"/>
      
            <div className="flex flex-col p-4">
              <div className="flex flex-row items-center mb-[18px]">
                <img src={tagType} alt="tag" className="w-[17px] h-[17px] object-contain"/>
                <p className="ml-[12px] mt-[2px] font-epilogue font-medium text-[12px] text-[#c1b6eb]">Real Estate</p>
                {!active && (
                  <span className="ml-2 px-2 py-1 bg-red-900 text-red-300 text-xs rounded-full">Inactive</span>
                )}
              </div>
      
              <div className="block">
                <h3 className="font-epilogue font-semibold text-[16px] text-[#ffffff] text-left leading-[26px] truncate">{title}</h3>
                <p className="mt-[5px] font-epilogue font-normal text-[#808191] text-left leading-[18px] truncate">{description}</p>
              </div>
      
              <div className="flex justify-between flex-wrap mt-[15px] gap-2">
                <div className="flex flex-col">
                  <h4 className="font-epilogue font-semibold text-[14px] text-[#808191] leading-[22px]">${amountCollected}</h4>
                  <p className="mt-[3px] font-epilogue font-normal text-[12.4px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">Raised of ${target}</p>
                </div>
                <div className="flex flex-col">
                  <h4 className="font-epilogue font-semibold text-[14px] text-[#808191] leading-[22px]">{remainingDays}</h4>
                  <p className="mt-[3px] font-epilogue font-normal text-[12.4px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">Days Left</p>
                </div>
              </div>

              <div className="flex justify-between flex-wrap mt-[15px] gap-2">
                <div className="flex flex-col">
                  <h4 className="font-epilogue font-semibold text-[14px] text-[#808191] leading-[22px]">${sharePrice}</h4>
                  <p className="mt-[3px] font-epilogue font-normal text-[12.4px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">Share Price</p>
                </div>
                <div className="flex flex-col">
                  <h4 className="font-epilogue font-semibold text-[14px] text-[#808191] leading-[22px]">{sharesSold}/{totalShares}</h4>
                  <p className="mt-[3px] font-epilogue font-normal text-[12.4px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">Shares Sold</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-[15px]">
                <div className="flex justify-between text-[12px] text-[#808191] mb-2">
                  <span>Progress</span>
                  <span>{percentage}%</span>
                </div>
                <div className="w-full bg-[#1c1c24] rounded-full h-[4px]">
                  <div 
                    className="bg-[#c1b6eb] h-[4px] rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
      
              <div className="flex items-center mt-[20px] gap-[12px]">
                <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#d8d2f3]">
                  <img src={logo} alt="user" className="w-1/2 h-1/2 object-contain"/>
                </div>
                <p className="flex-1 font-epilogue font-normal text-[12.5px] text-[#c1b6eb] truncate">by <span className="text-[#808191]">{owner}</span></p>
              </div>
            </div>
          </div>
        )
}

export default FundCard