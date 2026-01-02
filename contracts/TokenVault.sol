// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./MyToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TokenVault is Ownable, ReentrancyGuard {
    MyToken public token;

    mapping(address => uint256) public balances;
    mapping(address => bool) public isApproved;

    event UserApproved(address indexed user);
    event UserRevoked(address indexed user);
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    constructor(address _tokenAddress)
        Ownable(msg.sender)    // FIX: sets initial owner
    {
        token = MyToken(_tokenAddress);
    }

    function approveUser(address user) external onlyOwner {
        isApproved[user] = true;
        emit UserApproved(user);
    }

    function revokeUser(address user) external onlyOwner {
        isApproved[user] = false;
        emit UserRevoked(user);
    }

    function deposit(uint256 amount) external nonReentrant {
        require(isApproved[msg.sender], "User not approved by admin");
        require(amount > 0, "Cannot deposit 0");

        uint256 beforeBal = token.balanceOf(address(this));
        token.transferFrom(msg.sender, address(this), amount);
        uint256 afterBal = token.balanceOf(address(this));

        uint256 received = afterBal - beforeBal;
        balances[msg.sender] += received;

        emit Deposited(msg.sender, received);
    }

    function withdraw(uint256 amount) external nonReentrant {
        require(isApproved[msg.sender], "User not approved by admin");
        require(amount > 0, "Cannot withdraw 0");
        require(balances[msg.sender] >= amount, "Insufficient balance");

        balances[msg.sender] -= amount;
        token.transfer(msg.sender, amount);

        emit Withdrawn(msg.sender, amount);
    }

    // Admin transfers tokens between users within vault (no external token movement)
    function transferBetweenUsers(address from, address to, uint256 amount) 
        external onlyOwner nonReentrant {
        require(isApproved[from], "Sender not approved");
        require(isApproved[to], "Recipient not approved");
        require(amount > 0, "Cannot transfer 0");
        require(balances[from] >= amount, "Insufficient balance");
        
        balances[from] -= amount;
        balances[to] += amount;
        
        emit TransferBetweenUsers(from, to, amount);
    }

    event TransferBetweenUsers(address indexed from, address indexed to, uint256 amount);
}