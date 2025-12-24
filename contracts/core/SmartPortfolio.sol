// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./SmartPortfolioFactory.sol";

/// @notice Factory for deploying per-user portfolios
contract PortfolioFactory {
    address public router;
    mapping(address => address) public userPortfolios;
    bool public paused;

    event PortfolioCreated(address indexed user, address portfolio);
    event FactoryPaused();
    event FactoryUnpaused();

    modifier whenNotPaused() {
        require(!paused, "Factory paused");
        _;
    }

    constructor(address _router) {
        require(_router != address(0), "router=0");
        router = _router;
    }

    function createPortfolio() external whenNotPaused {
        require(userPortfolios[msg.sender] == address(0), "Already exists");

        UserPortfolio portfolio = new UserPortfolio(msg.sender, router);
        userPortfolios[msg.sender] = address(portfolio);

        emit PortfolioCreated(msg.sender, address(portfolio));
    }

    function getPortfolio(address user) external view returns (address) {
        return userPortfolios[user];
    }

    /// --------------------
    /// Admin: Global Pause
    /// --------------------
    function pauseFactory() external {
        paused = true;
        emit FactoryPaused();
    }

    function unpauseFactory() external {
        paused = false;
        emit FactoryUnpaused();
    }
}
