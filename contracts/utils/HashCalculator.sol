// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "../dex/UniswapV2Pair.sol";

contract HashCalculator {
    function getInitCodeHash() public pure returns (bytes32) {
        return keccak256(type(UniswapV2Pair).creationCode);
    }
}
