// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

error NotEnoughBitcoinPassed();

contract RunesRelayer {
    using SafeERC20 for IERC20;
    IERC20 public collateralERC20;

    event RedemptionRequested(uint256 amount, address user);
    event RedemptionExecuted(uint256 amount, address user);

    constructor(IERC20 _collERC20) {
        collateralERC20 = _collERC20;
    }

    function depositRune(uint256 _amount) external {
        collateralERC20.safeTransferFrom(msg.sender, address(this), _amount);
    }

    function withdrawRune(uint256 _amount) external {
        collateralERC20.safeTransfer(msg.sender, _amount);
    }
}