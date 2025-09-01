// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "forge-std/console.sol"; // <--- Add this
import "../src/RWATokenization.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        RWATokenization rwa = new RWATokenization();

        console.log("RWATokenization deployed at:", address(rwa));

        vm.stopBroadcast();
    }
}
