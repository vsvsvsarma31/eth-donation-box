// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

/// @title DonationBox
/// @notice A transparent, on-chain donation contract deployed on Sepolia testnet.
///         Anyone can donate ETH. Only the owner can withdraw. All activity is
///         recorded on-chain and emits events for full auditability.
contract DonationBox {

    // ─────────────────────────────────────────────
    //  State variables
    // ─────────────────────────────────────────────

    /// @notice The address that deployed the contract and can withdraw funds.
    address public owner;

    /// @notice Running total of all ETH ever donated (in wei).
    uint256 public totalDonations;

    /// @notice Number of unique donors who have ever donated.
    uint256 public donorCount;

    /// @notice Maps each donor address to their total donated amount (in wei).
    mapping(address => uint256) public donations;

    /// @notice Ordered list of all unique donor addresses.
    address[] private donors;

    // ─────────────────────────────────────────────
    //  Events
    // ─────────────────────────────────────────────

    /// @notice Emitted every time a donation is received.
    /// @param donor    The address that sent ETH.
    /// @param amount   The amount sent, in wei.
    /// @param timestamp The block timestamp at the time of donation.
    event DonationReceived(
        address indexed donor,
        uint256 amount,
        uint256 timestamp
    );

    /// @notice Emitted when the owner withdraws accumulated funds.
    /// @param owner    The owner's address.
    /// @param amount   The total amount withdrawn, in wei.
    /// @param timestamp The block timestamp at the time of withdrawal.
    event FundsWithdrawn(
        address indexed owner,
        uint256 amount,
        uint256 timestamp
    );

    // ─────────────────────────────────────────────
    //  Modifiers
    // ─────────────────────────────────────────────

    /// @dev Restricts a function so only the deployer (owner) can call it.
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    // ─────────────────────────────────────────────
    //  Constructor
    // ─────────────────────────────────────────────

    /// @notice Runs once at deployment. Captures the deployer's address as owner.
    constructor() {
        owner = msg.sender;
    }

    // ─────────────────────────────────────────────
    //  External / Public functions
    // ─────────────────────────────────────────────

    /// @notice Send ETH to donate to this contract.
    ///         Tracks the donor's cumulative total and the contract-wide total.
    ///         Emits a DonationReceived event.
    function donate() public payable {
        require(msg.value > 0, "Donation amount must be greater than zero");

        // First-time donor: add to the unique donor list and increment count.
        if (donations[msg.sender] == 0) {
            donors.push(msg.sender);
            donorCount++;
        }

        // Update per-donor and global totals.
        donations[msg.sender] += msg.value;
        totalDonations += msg.value;

        emit DonationReceived(msg.sender, msg.value, block.timestamp);
    }

    /// @notice Withdraw the entire contract balance to the owner's address.
    ///         Only callable by the owner. Reverts if balance is zero.
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds available to withdraw");

        // Use call (not transfer) as recommended by the Solidity security community
        // to avoid issues with gas limit changes in future EVM versions.
        emit FundsWithdrawn(owner, balance, block.timestamp);

        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Withdrawal transfer failed");
    }

    // ─────────────────────────────────────────────
    //  View functions (free to call, no gas)
    // ─────────────────────────────────────────────

    /// @notice Returns the current ETH balance held by this contract (in wei).
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    /// @notice Returns the total amount donated by a specific address (in wei).
    /// @param _donor The wallet address to query.
    function getDonorAmount(address _donor) public view returns (uint256) {
        return donations[_donor];
    }

    /// @notice Returns the full list of unique donor addresses.
    function getDonors() public view returns (address[] memory) {
        return donors;
    }
}
