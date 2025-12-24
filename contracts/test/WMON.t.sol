// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";

import {WMON} from "../tokens/WMON.sol";

contract WMONTest is Test {
    WMON wmon;
    address user1 = address(0x100);
    address user2 = address(0x200);

    function setUp() public {
        wmon = new WMON();

        // give users ETH
        vm.deal(user1, 10 ether);
        vm.deal(user2, 10 ether);
    }

    function test_InitialSupply() public view {
        require(wmon.totalSupply() == 0, "Initial supply should be 0");
    }

    function test_Deposit() public {
        uint amount = 2 ether;

        vm.prank(user1);
        wmon.deposit{value: amount}();

        require(wmon.balanceOf(user1) == amount, "Deposit balance mismatch");
        require(
            wmon.totalSupply() == amount,
            "Total supply mismatch after deposit"
        );
    }

    function test_DepositViaReceive() public {
        uint amount = 1 ether;

        vm.prank(user1);
        (bool ok, ) = address(wmon).call{value: amount}("");
        require(ok, "receive failed");

        require(wmon.balanceOf(user1) == amount, "Receive deposit failed");
    }

    function test_Withdraw() public {
        uint amount = 3 ether;

        vm.prank(user1);
        wmon.deposit{value: amount}();

        vm.prank(user1);
        wmon.withdraw(1 ether);

        require(
            wmon.balanceOf(user1) == 2 ether,
            "Withdraw did not reduce balance"
        );
        require(
            wmon.totalSupply() == 2 ether,
            "Total supply incorrect after withdraw"
        );
    }

    function test_RevertWithdraw_InsufficientBalance() public {
        vm.prank(user1);
        vm.expectRevert("Insufficient balance");
        wmon.withdraw(1 ether);
    }

    function test_ApproveAndTransferFrom() public {
        uint amount = 5 ether;

        vm.prank(user1);
        wmon.deposit{value: amount}();

        vm.prank(user1);
        wmon.approve(user2, 5 ether);

        vm.prank(user2);
        wmon.transferFrom(user1, user2, 3 ether);

        require(wmon.balanceOf(user1) == 2 ether, "Src balance mismatch");
        require(wmon.balanceOf(user2) == 3 ether, "Dst balance mismatch");
        require(wmon.allowance(user1, user2) == 2 ether, "Allowance mismatch");
    }

    function test_Transfer() public {
        vm.prank(user1);
        wmon.deposit{value: 1 ether}();

        vm.prank(user1);
        wmon.transfer(user2, 1 ether);

        require(wmon.balanceOf(user1) == 0, "Transfer did not reduce balance");
        require(
            wmon.balanceOf(user2) == 1 ether,
            "Transfer did not increase balance"
        );
    }

    function test_MaxAllowance() public {
        vm.prank(user1);
        wmon.deposit{value: 4 ether}();

        vm.prank(user1);
        wmon.approve(user2, type(uint).max);

        vm.prank(user2);
        wmon.transferFrom(user1, user2, 4 ether);

        require(
            wmon.allowance(user1, user2) == type(uint).max,
            "Max allowance should not decrease"
        );
    }

    function test_RevertTransfer_InsufficientBalance() public {
        vm.prank(user1);
        vm.expectRevert("Insufficient balance");
        wmon.transfer(user2, 1 ether);
    }

    function test_RevertTransferFrom_InsufficientAllowance() public {
        vm.prank(user1);
        wmon.deposit{value: 1 ether}();

        vm.prank(user2);
        vm.expectRevert("Insufficient allowance");
        wmon.transferFrom(user1, user2, 1 ether);
    }

    function testFuzz_DepositWithdraw(uint128 amount) public {
        // limit fuzz input
        vm.assume(amount > 0 && amount < 100 ether);

        vm.deal(user1, amount);

        vm.prank(user1);
        wmon.deposit{value: amount}();

        require(wmon.balanceOf(user1) == amount, "Fuzz deposit mismatch");

        vm.prank(user1);
        wmon.withdraw(amount);

        require(wmon.balanceOf(user1) == 0, "Fuzz withdraw mismatch");
    }
}
