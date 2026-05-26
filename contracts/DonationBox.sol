pragma solidity ^0.8.10;

contract DonationBox {

    address public owner;

    uint256 public totalDonations;

    uint256 public donorCount;

    mapping(address => uint256) public donations;

    address[] private donors;

    event DonationReceived(
        address indexed donor,
        uint256 amount,
        uint256 timestamp
    );

    event FundsWithdrawn(
        address indexed owner,
        uint256 amount,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function donate() public payable {
        require(msg.value > 0, "Donation amount must be greater than zero");

        if (donations[msg.sender] == 0) {
            donors.push(msg.sender);
            donorCount++;
        }

        donations[msg.sender] += msg.value;
        totalDonations += msg.value;

        emit DonationReceived(msg.sender, msg.value, block.timestamp);
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds available to withdraw");

        emit FundsWithdrawn(owner, balance, block.timestamp);

        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Withdrawal transfer failed");
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getDonorAmount(address _donor) public view returns (uint256) {
        return donations[_donor];
    }

    function getDonors() public view returns (address[] memory) {
        return donors;
    }
}
