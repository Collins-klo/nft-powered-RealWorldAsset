// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/RWATokenization.sol";

contract RWATokenizationTest is Test {
    RWATokenization public rwaTokenization;
    address public owner;
    address public user1;
    address public user2;

    function setUp() public {
        owner = address(this);
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        
        // Deploy the contract
        rwaTokenization = new RWATokenization();
        
        // Fund test accounts
        vm.deal(user1, 100 ether);
        vm.deal(user2, 100 ether);
    }

    function testInitialState() public {
        // Check if contract is deployed correctly
        assertTrue(address(rwaTokenization) != address(0));
        
        // Check if deployer is owner
        assertEq(rwaTokenization.owner(), address(this));
    }

    function testAddAsset() public {
        // Test adding a real estate asset
        uint256 assetId = rwaTokenization.addAsset(
            RWATokenization.AssetType.RealEstate,
            "Test Property",
            "A test real estate property",
            1000 ether, // 1000 ETH valuation
            0, // no deadline
            "ipfs://test-image",
            100000, // 100k shares
            0.01 ether, // 0.01 ETH per share
            address(0) // native ETH payment
        );
        
        assertEq(assetId, 0, "First asset should have ID 0");
    }

    function testFailAddAssetNotOwner() public {
        // Test that non-owner cannot add assets
        vm.prank(user1);
        vm.expectRevert();
        rwaTokenization.addAsset(
            RWATokenization.AssetType.RealEstate,
            "Test Property",
            "A test real estate property",
            1000 ether,
            0,
            "ipfs://test-image",
            100000,
            0.01 ether,
            address(0)
        );
    }
}
