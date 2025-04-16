// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.10;

import {BorrowLogic} from "./BorrowLogic.sol";
import {ReserveLogic} from "./ReserveLogic.sol";

/**
 * @title FlashLoanLogic library
 * @author Aave
 * @notice Implements the logic for the flash loans
 */
library FlashLoanLogic {
    function a() public view returns (uint256) {
        return BorrowLogic.b() + ReserveLogic.c();
    }
}
