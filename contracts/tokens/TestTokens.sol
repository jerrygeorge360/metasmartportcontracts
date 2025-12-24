// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title TestERC20Base
 * @dev Base contract for test tokens with minting capability
 */
abstract contract TestERC20Base {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    constructor(string memory _name, string memory _symbol, uint8 _decimals) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
    }

    function transfer(address to, uint256 value) external returns (bool) {
        return _transfer(msg.sender, to, value);
    }

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool) {
        if (allowance[from][msg.sender] != type(uint256).max) {
            require(
                allowance[from][msg.sender] >= value,
                "Insufficient allowance"
            );
            allowance[from][msg.sender] -= value;
        }
        return _transfer(from, to, value);
    }

    function approve(address spender, uint256 value) external returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    // Anyone can mint for testing purposes
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    // Burn tokens
    function burn(uint256 amount) external {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        emit Transfer(msg.sender, address(0), amount);
    }

    function _transfer(
        address from,
        address to,
        uint256 value
    ) internal returns (bool) {
        require(balanceOf[from] >= value, "Insufficient balance");
        require(to != address(0), "Transfer to zero address");

        balanceOf[from] -= value;
        balanceOf[to] += value;
        emit Transfer(from, to, value);
        return true;
    }

    function _mint(address to, uint256 value) internal {
        require(to != address(0), "Mint to zero address");
        totalSupply += value;
        balanceOf[to] += value;
        emit Transfer(address(0), to, value);
    }
}

/**
 * @title TestDAI
 * @dev Test version of DAI stablecoin (18 decimals)
 */
contract TestDAI is TestERC20Base {
    constructor() TestERC20Base("Test Dai Stablecoin", "DAI", 18) {
        // Mint initial supply to deployer for convenience
        _mint(msg.sender, 1_000_000 * 10 ** 18); // 1M DAI
    }
}

/**
 * @title TestUSDC
 * @dev Test version of USDC stablecoin (6 decimals)
 */
contract TestUSDC is TestERC20Base {
    constructor() TestERC20Base("Test USD Coin", "USDC", 6) {
        // Mint initial supply to deployer
        _mint(msg.sender, 1_000_000 * 10 ** 6); // 1M USDC
    }
}

/**
 * @title TestUSDT
 * @dev Test version of USDT stablecoin (6 decimals)
 */
contract TestUSDT is TestERC20Base {
    constructor() TestERC20Base("Test Tether USD", "USDT", 6) {
        // Mint initial supply to deployer
        _mint(msg.sender, 1_000_000 * 10 ** 6); // 1M USDT
    }
}

/**
 * @title TestWBTC
 * @dev Test version of Wrapped Bitcoin (8 decimals)
 */
contract TestWBTC is TestERC20Base {
    constructor() TestERC20Base("Test Wrapped BTC", "WBTC", 8) {
        // Mint initial supply to deployer
        _mint(msg.sender, 1_000 * 10 ** 8); // 1000 WBTC
    }
}
