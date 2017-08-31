pragma solidity ^0.4.15;

/// @title Library for making safe mathematic operations to prevent oveflows
/// @author Merunas Grincalaitis
library SafeMath {
   function safeMultiply(uint256 a, uint256 b) internal constant returns(uint256) {
      uint256 result = a * b;
      assert(result / a == b || a == 0);
      return result;
   }

   function safeSubstract(uint256 a, uint256 b) internal constant returns(uint256) {
      assert(b <= a);
      return a - b;
   }

   function safeSum(uint256 a, uint256 b) internal constant returns(uint256) {
      uint256 c = a + b;
      assert(c >= a);
      return c
   }
}
