// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";

// TODO: Make upgradable
contract VDelegateMidl is
    OwnableUpgradeable,
    ERC20Upgradeable,
    ReentrancyGuardUpgradeable,
    PausableUpgradeable
{
    mapping(address => uint256) public rewardByUser;
    mapping(address => bool) public userClaimed;

    event UserConfigSet(address user, uint256 reward);
    event MultiUserConfigSet(address[] user, uint256[] reward);
    event Deposited(address depositor, uint256 amount);
    event RewardClaimed(address claimer, uint256 amount);

    function initialize() external initializer {
        __Ownable_init(msg.sender);

        __ERC20_init("Governance Midl", "VMidl");

        _mint(address(this), 1_000_000 ether);
    }

    function claimReward() external nonReentrant whenNotPaused {
        require(!userClaimed[msg.sender], "Rewards were claimed already");
        uint256 reward = rewardByUser[msg.sender];

        // Check if there are rewards available
        require(reward > 0, "No rewards available to withdraw");
        // Check if the contract has enough balance
        require(
            balanceOf(address(this)) >= reward,
            "Contract does not have enough funds"
        );

        // Reset reward to zero before transfer to prevent reentrancy
        userClaimed[msg.sender] = true;

        // Transfer the reward to msg.sender
        _transfer(address(this), msg.sender, reward);

        emit RewardClaimed(msg.sender, reward);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function multiSetRewardByUser(
        address[] calldata _users,
        uint256[] calldata _rewards
    ) external onlyOwner {
        require(_users.length == _rewards.length, "Array length mismatch");
        for (uint256 i; i < _users.length; i++) {
            rewardByUser[_users[i]] = _rewards[i];
        }
        emit MultiUserConfigSet(_users, _rewards);
    }

    function multiSetRewardByUserWithReclaimRight(
        address[] calldata _users,
        uint256[] calldata _rewards
    ) external onlyOwner {
        require(_users.length == _rewards.length, "Array length mismatch");
        for (uint256 i; i < _users.length; i++) {
            rewardByUser[_users[i]] = _rewards[i];
            userClaimed[_users[i]] = false;
        }
        emit MultiUserConfigSet(_users, _rewards);
    }

    function setRewardByUser(
        address _user,
        uint256 _reward
    ) external onlyOwner {
        rewardByUser[_user] = _reward;
        userClaimed[_user] = false;
        emit UserConfigSet(_user, _reward);
    }
}
