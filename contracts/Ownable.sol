pragma solidity ^0.4.15;

/// @title Contract to provide basic authentification control functionality
/// @author Merunas Grincalaitis
contract Ownable {
   address public owner;

   /// @notice Modifier to only allow owner execution
   modifier onlyOwner() {
      require(msg.sender == owner);
      _;
   }

   /// @notice Constructor to set the owner
   function Ownable() {
      owner = msg.sender;
   }

   /// @notice Function to change the ownership of the contract
   /// @param to The address that will get the ownership
   function transferOwnership(address to) onlyOwner {
      require(to != address(0));

      owner = to;
   }
}
