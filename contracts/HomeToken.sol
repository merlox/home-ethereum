pragma solidity ^0.4.15;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import 'zeppelin-solidity/contracts/token/MintableToken.sol';

/// @title The token for the Home Ethereum's acommodation platform. The totalSupply
/// of tokens gets incremented when tokens are bought
/// @author Merunas Grincalaitis
contract HomeToken is MintableToken {
   using SafeMath for uint256;

   // Name of the token
   string public name;

   // Symbol of the token
   string public symbol;

   // The amount of decimals for that token
   uint8 public decimals;

   /// @notice Constructor to generate the HomeToken. The `totalSupply` of tokens
   /// gets incremented whenever someone buys tokens on the crowdsale
   /// @param _name The name of the token
   /// @param _symbol The symbol of the token
   /// @param _decimals The decimals of the token
   /// @param initialSupply The initial amount of tokens created that will go to
   /// the creator of the token and will be the `totalSupply` because it's a `MintableToken`
   function HomeToken(string _name, string _symbol, uint8 _decimals, uint initialSupply) {
      require(bytes(_name).length > 0);
      require(bytes(_symbol).length > 0);
      require(_decimals > 0);
      require(initialSupply > 0);

      name = _name;
      symbol = _symbol;
      decimals = _decimals;
      totalSupply = initialSupply;

      // The creator of the token gets the initial supply
      balances[msg.sender] = initialSupply;
   }
}
