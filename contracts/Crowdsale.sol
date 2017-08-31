pragma solidity ^0.4.15;

import './HomeToken.sol'
import './SafeMath.sol'

/// @title Crowdsale contract to carry out an ICO with the HomeToken
/// Crowdsales have a start and end timestamps, where investors can make
/// token purchases and the crowdsale will assign them tokens based
/// on a token per ETH rate. Funds collected are forwarded to a wallet
/// as they arrive.
/// @author Merunas Grincalaitis <merunasgrincalaitis@gmail.com>
contract Crowdsale {
   using SafeMath for uint256;

   // The token being sold
   HomeToken public token;

   // The block number of when the crowdsale starts
   uint256 public startTime;

   // The block number of when the crowdsale ends
   uint256 public endTime;

   // The wallet that holds the Wei raised on the crowdsale
   address public wallet;

   // How many tokens you get per Wei
   uint256 public rate;

   // The amount of wei raised
   uint256 public weiRaised;

   // The minimum amount of Wei you must pay to participate in the crowdsale
   uint256 public minPurchase;

   // The max amount of Wei that you can pay to participate in the crowdsale
   uint256 public maxPurchase;

   // To indicate who purchased what amount of tokens and who received what amount of wei
   event TokenPurchase(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);

   /// @notice Constructor of the crowsale to set up the main variables and create a token
   /// @param _startTime When the crowdsale starts
   /// @param _endTime When the crowdsale ends
   /// @param _rate How much tokens you get per Wei
   /// @param _wallet The wallet that stores the Wei raised
   /// @param tokenName The name of the token generated
   /// @param tokenSymbol The symbol of the token to create
   /// @param initialSupply The amount of tokens that the owner will get
   /// @param totalSupply The total amount of tokens to create
   function Crowdsale(
      uint256 _startTime,
      uint256 _endTime,
      uint256 _rate,
      address _wallet,
      uint256 _minPurchase,
      uint256 _maxPurchase,
      string tokenName,
      string tokenSymbol,
      uint256 initialSupply,
      uint256 totalSupply
   ) {
      require(_startTime >= now);
      require(_endTime >= _startTime);
      require(_rate > 0);
      require(_wallet != address(0));

      token = new HomeToken(tokenName, tokenSymbol, initialSupply, totalSupply);
      startTime = _startTime;
      endTime = _endTime;
      rate = _rate;
      wallet = _wallet;
      minPurchase = _minPurchase;
      maxPurchase = _maxPurchase;
   }

   // TODO check that this is working. It may be neccesary to do a
   // `buyTokens.value(msg.value)(msg.sender)`
   /// @notice Fallback function to buy tokens
   function () payable {
      buyTokens(msg.sender);
   }

   /// @notice To buy tokens given an address
   /// @param beneficiary The address that will get the tokens
   function buyTokens(address beneficiary) payable {
      require(beneficiary != address(0));
      require(validPurchase());

      uint256 weiAmount = msg.value;

      // Calculate the amount of tokens that will be generated for that amount of Wei
      uint256 tokens = weiAmount.safeMultiply(rate);
      weiRaised = weiRaised.safeSum(weiAmount);

      token.mint(beneficiary, tokens);
      TokenPurchase(msg.sender, beneficiary, weiAmount, tokens);

      forwardFunds();
   }

   /// @notice Sends the payment from the buyer to the crowdsale saller
   function forwardFunds() internal {
      wallet.transfer(msg.value);
   }

   /// @notice Checks if a purchase is considered valid
   /// @return bool If the purchase is valid or not
   function validPurchase() internal constant returns(bool) {
      bool withinPeriod = now >= startTime && now <= endTime;
      bool nonZeroPurchase = msg.value > 0;

      return withinPeriod && nonZeroPurchase;
   }

   /// @notice Public function to check if the crowdsale has ended or not
   function hasEnded() public constant returns(bool) {
      return now > endTime;
   }
}
