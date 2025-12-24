// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IUniswapV2Router {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);

    function getAmountsOut(
        uint amountIn,
        address[] calldata path
    ) external view returns (uint[] memory amounts);
}

/// @notice Per-user portfolio contract
contract UserPortfolio is ReentrancyGuard {
    using SafeERC20 for IERC20;

    address public owner;
    IUniswapV2Router public router;

    bool public paused;

    struct TokenAllocation {
        address token;
        uint16 percent; // out of 100
    }

    TokenAllocation[] private allocations;

    /// --------------------
    /// Events
    /// --------------------
    event DynamicAllocationSet(
        address indexed user,
        address[] tokens,
        uint16[] percents
    );
    event RebalanceExecuted(
        address indexed user,
        address indexed executor,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        string reason,
        uint256 timestamp
    );
    event Paused(address by);
    event Unpaused(address by);
    event ApprovalRevoked(address indexed user, address indexed token);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Portfolio paused");
        _;
    }

    constructor(address _owner, address _router) {
        require(_owner != address(0) && _router != address(0), "zero address");
        owner = _owner;
        router = IUniswapV2Router(_router);
    }

    /// --------------------
    /// Allocation Management
    /// --------------------
    function setAllocation(
        address[] calldata tokens,
        uint16[] calldata percents
    ) external onlyOwner {
        require(
            tokens.length == percents.length && tokens.length > 0,
            "Invalid input"
        );

        delete allocations;

        uint256 total;
        for (uint i = 0; i < tokens.length; i++) {
            require(tokens[i] != address(0), "Zero token");
            require(percents[i] > 0, "Zero percent");
            total += percents[i];

            allocations.push(TokenAllocation(tokens[i], percents[i]));
        }

        require(total == 100, "Sum must equal 100");

        emit DynamicAllocationSet(owner, tokens, percents);
    }

    function getAllocation() external view returns (TokenAllocation[] memory) {
        return allocations;
    }

    function removeAllocation() external onlyOwner {
        delete allocations;
        emit DynamicAllocationSet(owner, new address[](0), new uint16[](0));
    }

    /// --------------------
    /// Rebalance
    /// --------------------
    function executeRebalance(
        address executor, // informational - tracks which bot executed
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        string calldata reason
    )
        external
        onlyOwner
        nonReentrant
        whenNotPaused
        returns (uint256 amountOut)
    {
        require(amountIn > 0, "amountIn=0");
        require(
            path.length >= 2 &&
                path[0] == tokenIn &&
                path[path.length - 1] == tokenOut,
            "Invalid path"
        );

        // Pull tokens from owner
        IERC20(tokenIn).safeTransferFrom(owner, address(this), amountIn);

        // Approve router
        IERC20(tokenIn).forceApprove(address(router), amountIn);

        // Swap via router
        uint[] memory amounts = router.swapExactTokensForTokens(
            amountIn,
            amountOutMin,
            path,
            owner,
            block.timestamp + 300
        );
        amountOut = amounts[amounts.length - 1];

        // Reset approval
        IERC20(tokenIn).forceApprove(address(router), 0);

        emit RebalanceExecuted(
            owner,
            executor,
            tokenIn,
            tokenOut,
            amountIn,
            amountOut,
            reason,
            block.timestamp
        );
    }

    /// --------------------
    /// Pause / Unpause
    /// --------------------
    function pause() external onlyOwner {
        paused = true;
        emit Paused(msg.sender);
    }

    function unpause() external onlyOwner {
        paused = false;
        emit Unpaused(msg.sender);
    }

    /// --------------------
    /// View / Helper
    /// --------------------
    function hasAllocation() external view returns (bool) {
        if (allocations.length == 0) return false;
        uint256 total;
        for (uint i = 0; i < allocations.length; i++)
            total += allocations[i].percent;
        return total == 100;
    }

    function getContractBalance(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }

    /// @notice Get estimated output from router
    function getEstimatedOut(
        uint256 amountIn,
        address[] calldata path
    ) external view returns (uint256[] memory) {
        return router.getAmountsOut(amountIn, path);
    }

    /// @notice Validate a rebalance before execution
    function validateRebalance(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path
    ) external view returns (bool valid, string memory reason) {
        if (paused) return (false, "Portfolio paused");
        if (amountIn == 0) return (false, "Amount is zero");
        if (path.length < 2) return (false, "Invalid path length");
        if (path[0] != tokenIn) return (false, "Path start mismatch");
        if (path[path.length - 1] != tokenOut)
            return (false, "Path end mismatch");

        // Check expected output
        try router.getAmountsOut(amountIn, path) returns (
            uint[] memory amounts
        ) {
            if (amounts[amounts.length - 1] < amountOutMin) {
                return (false, "Slippage too high");
            }
        } catch {
            return (false, "Router estimation failed");
        }
        return (true, "Valid");
    }

    function revokeApproval(address token) external onlyOwner {
        IERC20(token).forceApprove(address(router), 0);
        emit ApprovalRevoked(owner, token);
    }
}
