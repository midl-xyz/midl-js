// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import {FlashLoanLogic} from "./FlashLoanLogic.sol";
import {BorrowLogic} from "./BorrowLogic.sol";
import {ReserveLogic} from "./ReserveLogic.sol";

/**
 * @title FlashLoanUser
 * @dev Contract that demonstrates using the FlashLoanLogic library
 */
contract FlashLoanUser {
    // State variable to store the result of the flash loan operation
    uint256 public lastFlashLoanResult;
    
    /**
     * @notice Executes a flash loan operation using the FlashLoanLogic library
     * @return result The return value from the flash loan operation (always 0)
     */
    function executeFlashLoan() external returns (uint256) {
        // Call the function from the imported library
        // This will internally call BorrowLogic.b() and ReserveLogic.c()
        uint256 result = FlashLoanLogic.a();
        
        // Store the result in the state variable
        lastFlashLoanResult = result;
        
        return result;
    }
}