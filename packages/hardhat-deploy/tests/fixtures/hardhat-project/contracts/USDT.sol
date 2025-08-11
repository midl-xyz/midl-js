// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error NotEnoughBitcoinPassed();

contract USDT is ERC20, Ownable {
    using SafeERC20 for ERC20;
    IERC20 public collateralERC20;

    event RedemptionRequested(uint256 amount, address user);
    event RedemptionExecuted(uint256 amount, address user);

    constructor(
        IERC20 _collERC20
    ) ERC20("Rune as ERC20 Example", "RERC20") Ownable(msg.sender) {
        collateralERC20 = _collERC20;
    }

    function mint(uint256 _amount, address _receiver) external onlyOwner {
        _mint(_receiver, _amount);
    }

    function mintUsingERC20AsCollateral(uint256 _amount) external {
        collateralERC20.transferFrom(msg.sender, address(this), _amount);
        _mint(msg.sender, _amount);
    }

    function mintUsingBitcoinAsCollateral(uint256 _amount) external payable {
        if (_amount > msg.value) revert NotEnoughBitcoinPassed();
        _mint(msg.sender, _amount);
    }

    function requestRedemption(uint256 _amount) external {
        _burn(msg.sender, _amount);

        emit RedemptionRequested(_amount, msg.sender);
    }

    function redemptionExecuted(
        uint256 _amount,
        address _user
    ) external onlyOwner {
        emit RedemptionExecuted(_amount, _user);
    }
}